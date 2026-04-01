# Système de Notifications - Documentation

## Vue d'ensemble

Le système de notifications envoie automatiquement des **emails** (SendGrid) et des **SMS** (Twilio) lorsque:
- Le statut d'une **livraison** change
- Le statut d'un **paiement** change
- Un produit est **ajouté/retiré** d'une **wishlist**

## Configuration

### 1. Variables d'environnement requises

Créez un fichier `.env` à la racine du dossier `/server/` avec les variables suivantes:

```env
# SendGrid (pour les emails)
SENDGRID_API_KEY=sg_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
FROM_EMAIL=noreply@hackttrain.com

# Twilio (pour les SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+261xxxxxxxxx  # Numéro Twilio (format E.164)
```

### 2. Installation des dépendances

Les packages ont déjà été installés:
```bash
npm install @sendgrid/mail twilio
```

### 3. Base de données

#### Nouvelle colonne: `phone` dans la table `users`

La colonne `phone` a été ajoutée à la table `users`:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
```

**Note:** Le téléphone est optionnel. Si un utilisateur n'a pas de numéro de téléphone, seul l'email sera utilisé.

#### Nouvelle table: `command`

La table `command` a été ajoutée (elle était manquante):

```sql
CREATE TABLE IF NOT EXISTS command (
  id_command SERIAL PRIMARY KEY,
  id_users INTEGER NOT NULL REFERENCES users(id_users) ON DELETE CASCADE,
  id_products INTEGER NOT NULL REFERENCES products(id_products) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);
```

Runnable via `npm run dev` qui exécutera `/server/database.sql`.

## Architecture

### Service de notification: `services/notificationService.js`

Expose les fonctions suivantes:

```javascript
// Envoyer un email
await sendEmail(to, subject, html);

// Envoyer un SMS
await sendSMS(to, body);

// Notifier changement de statut de livraison
await notifyLivraisonStatusChange(idLivraison, idCommand, oldStatus, newStatus);

// Notifier changement de statut de paiement
await notifyPaymentStatusChange(idCommand, status, amount);

// Notifier événement wishlist
await notifyWishlistEvent(user, event, productName);
```

### Points d'intégration

#### 1. Livraison (`controllers/livraisonController.js`)

Quand `updateLivraison()` change le statut:
- Récupère l'ancienne livraison
- Met à jour la livraison
- **Si le statut a changé**, envoie une notification

Statuts déclenchant des notifications:
- `non commencé` → `en cours`: "Votre commande est en cours de livraison"
- `en cours` → `livré`: "Votre commande a été livrée !"
- `*` → `annulé`: "Votre livraison a été annulée"

#### 2. Paiement (`controller/payment.js`)

Le webhook MVola `/api/payments/webhook` reçoit:
- `webhook_id`
- `id_command`
- `status` (pending, processing, success, failed)
- `amount`
- Autres champs optionnels

Workflow:
1. Enregistre le webhook dans `payment_webhooks`
2. Normalise le statut (`completed` → `success`)
3. **Si statut est `success` ou `failed`**, envoie une notification

Messages:
- `success`: "Paiement confirmé"
- `failed`: "Echec du paiement"

#### 3. Wishlist (`controller/wishlistController.js`)

Quand un produit est ajouté ou retiré:
- Déclenche une notification en parallèle avec la réponse HTTP
- Ne bloque pas la réponse (async, pas d'await)

Messages:
- `added`: "Produit ajouté à votre wishlist"
- `removed`: "Produit retiré de votre wishlist"

## Gestion des erreurs

### Graceful degradation

- **Email sans clé SendGrid**: L'email est ignoré, SMS envoyé (si dispo)
- **SMS sans credentials Twilio**: L'SMS est ignoré, email envoyé (si dispo)
- **Utilisateur sans email**: Seul SMS sera tenté (si numéro fourni)
- **Utilisateur sans téléphone**: Seul email sera tenté

Erreurs d'envoi sont loguées mais **ne bloquent jamais la réponse HTTP**.

## Exemple d'utilisation

### Ajouter un numéro de téléphone lors de l'inscription

```javascript
// POST /api/users/register
const { username, email, password, age, phone } = req.body;
const user = await createUser({ username, email, password, age, phone });
```

### Mettre à jour le numéro de téléphone

```javascript
// PUT /api/users/:id
const updated = await updateUser(userId, { phone: '+261123456789' });
```

### Tester les notifications

En mode mock (`MVOLA_USE_MOCK=true`):

```bash
# 1. Tester notification de livraison
curl -X PUT http://localhost:5000/api/livraisons/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"en cours"}'

# 2. Tester notification de wishlist
curl -X POST http://localhost:5000/api/wishlist \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":1}'

# 3. Tester webhook de paiement
curl -X POST http://localhost:5000/api/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "webhook_id":"test-123",
    "id_command":1,
    "status":"success",
    "amount":50000
  }'
```

## Vérification de la configuration

```bash
# 1. S'assurer que les env vars sont présentes
grep -E "SENDGRID_API_KEY|TWILIO" /server/.env

# 2. Vérifier que le service est importé
grep -r "notificationService" /server/controllers

# 3. Vérifier que la colonne phone existe
psql hackttrain2 -c "SELECT * FROM users LIMIT 1;"
```

## Troubleshooting

### Notifications ne s'envoient pas

1. **Vérifier les logs**:
   ```bash
   npm run dev 2>&1 | grep -i "notification\|sendgrid\|twilio"
   ```

2. **Vérifier les credentials**:
   ```bash
   echo $SENDGRID_API_KEY
   echo $TWILIO_ACCOUNT_SID
   ```

3. **Tester SendGrid directement**:
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   await sgMail.send({
     to: 'test@example.com',
     from: 'noreply@hackttrain.com',
     subject: 'Test',
     html: '<p>Test</p>'
   });
   ```

### Erreur: `Can't find PaymentWebhook model`

S'assurer que le fichier `/server/models/webhookModels.js` existe et exporte `PaymentWebhook`.

### Erreur: `phone column doesn't exist`

Exécuter la migration:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
```

## Avenir

- [ ] Dashboard d'historique des notifications (admin)
- [ ] Préférences utilisateur (email/SMS/push)
- [ ] Support de notifications push (Web/mobile)
- [ ] Templates personnalisables par client
- [ ] Retry automatique pour notifications échouées
