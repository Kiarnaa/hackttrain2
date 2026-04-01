# 🔔 Documentation - Gestion des Webhooks de Paiement

## Vue d'ensemble

Le système de webhooks gère les confirmations asynchrones de paiement avec retry automatique en cas d'échec.

### Fonctionnalités principales
- ✅ Réception asynchrone des webhooks
- 🔄 Retry automatique avec délai exponentiel
- 📊 Suivi complet du statut
- 🛡️ Idempotence (pas de traitement en doublon)
- 📈 Statistiques et historique

---

## 📋 Architecture

```
Fournisseur de paiement
    ↓
[POST /api/webhooks/payment]
    ↓
WebhookController
    ↓
WebhookService (traitement asynchrone)
    ↓
Confirmation du paiement
    ↓
Base de données (payment_webhooks, payment)
```

---

## 🚀 Démarrage du Worker

Ajouter au fichier principal du serveur (server.js ou index.js):

```javascript
const { startWebhookWorker } = require('./workers/webhookWorker');

// Démarrer le worker de webhooks
startWebhookWorker();
```

Ou avec variable d'environnement:
```bash
WEBHOOK_AUTO_RETRY=true node server.js
```

---

## 📡 Endpoints des Webhooks

### 1. Recevoir un webhook de paiement
```
POST /api/webhooks/payment
Content-Type: application/json

{
  "webhook_id": "webhook_12345",
  "id_command": 1,
  "id_payment": 50,
  "status": "SUCCESS",
  "amount": 50000,
  "error_message": null
}
```

**Réponse (202 Accepted):**
```json
{
  "success": true,
  "message": "Webhook reçu et en traitement",
  "data": {
    "id_webhook": 1,
    "webhook_id": "webhook_12345",
    "status": "pending"
  }
}
```

---

### 2. Récupérer le statut d'un paiement
```
GET /api/webhooks/payment-status/:id_command
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "status": "success",
    "retry_count": 0,
    "processed_at": "2026-04-01T10:30:00Z",
    "error_message": null,
    "webhook_id": "webhook_12345"
  }
}
```

---

### 3. Récupérer les webhooks d'une commande
```
GET /api/webhooks/command/:id_command
```

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id_webhook": 1,
      "webhook_id": "webhook_12345",
      "status": "success",
      "retry_count": 0,
      "created_at": "2026-04-01T10:25:00Z"
    },
    {
      "id_webhook": 2,
      "webhook_id": "webhook_12346",
      "status": "success",
      "retry_count": 1,
      "created_at": "2026-04-01T10:30:00Z"
    }
  ]
}
```

---

### 4. Récupérer les détails d'un webhook
```
GET /api/webhooks/details/:id_webhook
```

---

### 5. Forcer un retry manuel
```
POST /api/webhooks/retry/:id_webhook
```

**Réponse (202 Accepted):**
```json
{
  "success": true,
  "message": "Retry programmé",
  "data": {
    "id_webhook": 1,
    "retry_count": 1,
    "next_retry_at": "2026-04-01T10:28:00Z"
  }
}
```

---

### 6. Récupérer l'historique
```
GET /api/webhooks/history?limit=50&offset=0
```

---

### 7. Récupérer les statistiques
```
GET /api/webhooks/statistics
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "success_count": 95,
    "failed_count": 3,
    "pending_count": 2,
    "processing_count": 0,
    "avg_retries": 0.15
  }
}
```

---

### 8. Forcer le traitement des retries (Admin)
```
POST /api/webhooks/process-retries
```

---

## ⏱️ Système de Retry

### Délai exponentiel
- Retry 1: 60 secondes
- Retry 2: 120 secondes (2 min)
- Retry 3: 240 secondes (4 min)
- Retry 4: 480 secondes (8 min)
- Retry 5: 960 secondes (16 min)
- Max: 5 retries

### Statuts possibles
- `pending`: En attente de traitement
- `processing`: Actuellement en traitement
- `success`: Traité avec succès ✅
- `failed`: Échec après max retries ❌

---

## 🔒 Sécurité et Idempotence

Le système utilise `webhook_id` (unique) pour garantir l'idempotence:
- Si le même `webhook_id` est reçu 2 fois, le webhook n'est traité qu'une fois
- Les webhooks duplicatas sont ignorés s'ils ont déjà le statut `success`

---

## 📊 Table de la Base de Données

```sql
CREATE TABLE payment_webhooks (
  id_webhook SERIAL PRIMARY KEY,
  webhook_id VARCHAR(255) UNIQUE,
  id_payment INTEGER REFERENCES payment(id_payment),
  id_command INTEGER REFERENCES command(id_command),
  status TEXT DEFAULT 'pending',
  payload JSONB,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 5,
  next_retry_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  CHECK (status IN ('pending', 'processing', 'success', 'failed'))
);
```

---

## 🧪 Exemple d'intégration

### 1. Recevoir un webhook depuis le fournisseur
```javascript
// Client envoie le webhook
fetch('http://localhost:3000/api/webhooks/payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    webhook_id: 'mvola_abc123',
    id_command: 1,
    id_payment: 50,
    status: 'SUCCESS',
    amount: 50000
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

### 2. Vérifier le statut du paiement
```javascript
// Vérifier régulièrement
fetch('http://localhost:3000/api/webhooks/payment-status/1')
  .then(r => r.json())
  .then(data => {
    if (data.data.status === 'success') {
      console.log('Paiement confirmé!');
    } else if (data.data.status === 'failed') {
      console.log('Paiement échoué');
    } else {
      console.log('En attente...');
    }
  });
```

### 3. Frontend - Polling du statut
```javascript
// Attendre la confirmation du paiement
async function waitForPaymentConfirmation(id_command, maxWait = 30000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    const response = await fetch(
      `http://localhost:3000/api/webhooks/payment-status/${id_command}`
    );
    const { data } = await response.json();
    
    if (data.status === 'success') {
      return { success: true, message: 'Paiement confirmé' };
    } else if (data.status === 'failed') {
      return { success: false, message: 'Paiement échoué' };
    }
    
    // Attendre 2 secondes avant de vérifier à nouveau
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return { success: false, message: 'Timeout' };
}
```

---

## 🔧 Configuration

Variables d'environnement:
```bash
# Activer le worker de retry automatique
WEBHOOK_AUTO_RETRY=true

# Intervalle de vérification des retries (ms)
WEBHOOK_RETRY_INTERVAL=60000

# Port du serveur
PORT=3000

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/hackttrain2
```

---

## 📝 Logs

Le système enregistre:
- 🔔 Réception de webhooks
- ⏳ Début du traitement
- ✅ Succès du traitement
- ❌ Erreurs et tentatives
- 🔄 Retries programmés

Exemple de logs:
```
🔔 Webhook reçu: webhook_12345
⏳ Traitement du paiement pour la commande 1
✅ Paiement créé: 50
✅ Webhook webhook_12345 traité avec succès
🔄 Vérification des webhooks à rejouer...
📧 2 webhooks à traiter
🔄 Retry #1 pour webhook 3
✅ Webhook 3 traité avec succès
```

---

## 🐛 Debugging

### Afficher tous les webhooks
```
GET /api/webhooks/history?limit=100
```

### Afficher les statistiques
```
GET /api/webhooks/statistics
```

### Forcer un retry
```
POST /api/webhooks/retry/:id_webhook
```

### Forcer le traitement des retries
```
POST /api/webhooks/process-retries
```

---

## ⚠️ Cas d'erreur courants

| Erreur | Cause | Solution |
|--------|-------|----------|
| `webhook_id et id_command sont requis` | Payload invalide | Vérifier le body de la requête |
| `Max retries reached` | Trop d'échecs | Vérifier les logs, retry manuel |
| `Webhook ${id} déjà traité` | Doublon | Normal, système idempotent |
| `Commande non trouvée` | ID commande invalide | Vérifier l'existence de la commande |

---

## 📚 Références

- [Table payment_webhooks](../server/database.sql)
- [Modèle PaymentWebhook](../server/models/webhookModels.js)
- [Service WebhookService](../server/services/webhookService.js)
- [Contrôleur WebhookController](../server/controllers/webhookController.js)
- [Worker WebhookWorker](../server/workers/webhookWorker.js)
