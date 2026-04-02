# Guide d'intégration Front-End & Back-End

## ✅ État de l'assemblage

Le projet est maintenant **complètement assemblé** avec une communication bidirectionnelle entre le front-end (Client) et le back-end (Server).

### Architecture

```
┌─────────────────────────────────────────────┐
│         Client (React + Vite)               │
│         Port: 5173                          │
│    - Proxy /api → localhost:5000            │
│    - Axios baseURL: /api                    │
│    - CORS headers: Authorization Bearer     │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST
                   ▼
┌─────────────────────────────────────────────┐
│      Server (Express + PostgreSQL)          │
│      Port: 5000                             │
│    - CORS enabled for localhost:5173        │
│    - JWT middleware                         │
│    - Error handling                         │
└─────────────────────────────────────────────┘
```

## 🔌 Routes Disponibles

### Authentification & Utilisateurs
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/users` - Récupérer utilisateurs
- `PUT /api/users/:id` - Mettre à jour utilisateur
- `DELETE /api/users/:id` - Supprimer utilisateur

### Produits & Catalogue
- `GET /api/produits` - Lister les produits
- `GET /api/produits/:id` - Détails d'un produit
- `POST /api/produits` - Créer un produit
- `PUT /api/produits/:id` - Mettre à jour un produit
- `DELETE /api/produits/:id` - Supprimer un produit

### Panier (Cart)
- `GET /api/cart/:id_users` - Récupérer le panier
- `POST /api/cart` - Ajouter au panier
- `PUT /api/cart/:id_cart` - Mettre à jour quantité
- `DELETE /api/cart/:id_cart` - Supprimer du panier

### Commandes
- `GET /api/commandes` - Lister les commandes
- `GET /api/commandes/:id_command` - Détails d'une commande
- `POST /api/commandes` - Créer une commande
- `PUT /api/commandes/:id_command` - Mettre à jour commande
- `DELETE /api/commandes/:id_command` - Supprimer commande

### Paiements
- `GET /api/payments` - Historique des paiements (MVola)
- `POST /api/payments/initiate` - Initier paiement MVola
- `GET /api/payments/poll/:id` - Vérifier statut paiement
- `GET /api/payments-db` - Paiements en base de données
- `POST /api/payments-db` - Enregistrer paiement

### Livraisons
- `GET /api/livraisons` - Lister les livraisons
- `GET /api/livraisons/:id_livraison` - Détails livraison
- `POST /api/livraisons` - Créer livraison
- `PUT /api/livraisons/:id_livraison` - Mettre à jour livraison

### Webhooks & Notifications
- `POST /api/webhooks/payment` - Recevoir webhook paiement
- `GET /api/webhooks/payment-status/:id_command` - Statut paiement
- `GET /api/webhooks/history` - Historique webhooks

### Wishlist & Favoris
- `GET /api/wishlist` - Récupérer la wishlist
- `POST /api/wishlist` - Ajouter à la wishlist
- `DELETE /api/wishlist/:id` - Retirer de la wishlist

### Santé API
- `GET /api/health` - Vérifier l'état du serveur

## 🚀 Démarrage du Projet

### Option 1: Avec npm (Recommandé)
```bash
npm run dev
```
Cela lance:
- ✅ Server: http://localhost:5000
- ✅ Client: http://localhost:5173

### Option 2: Avec le script bash
```bash
./start-dev.sh
```

### Option 3: Manuellement
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

## 🔧 Configuration

### Variables d'environnement Server (`server/.env`)
```
PORT=5000
NODE_ENV=development
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hackttrain2
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_super_secret_jwt_key_here
```

### Variables d'environnement Client (`client/.env.local`)
```
VITE_API_URL=http://localhost:5000/api
```

## 📝 Utilisation côté Client

### 1. Importer axios
```javascript
import api from "../api/axios";
```

### 2. Faire des appels API
```javascript
// GET
const response = await api.get('/produits');

// POST
const response = await api.post('/cart', { id_products: 1, quantity: 2 });

// PUT
const response = await api.put('/users/1', { nom: 'Nouveau Nom' });

// DELETE
await api.delete('/cart/1');
```

### 3. Authentification
- Le token JWT est automatiquement ajouté aux headers via l'interceptor
- Stocké dans localStorage sous la clé `token`
- Redirige automatiquement vers /login si 401 Unauthorized

## 🧪 Test des Endpoints

### Avec curl
```bash
# Test de santé
curl http://localhost:5000/api/health

# Lister les produits
curl http://localhost:5000/api/produits

# Créer une commande
curl -X POST http://localhost:5000/api/commandes \
  -H "Content-Type: application/json" \
  -d '{"id_users": 1, "montant_total": 50000}'
```

### Avec le client
Toutes les pages React utilisent automatiquement le proxy Vite:
```javascript
// Cet appel dans React va automatiquement à localhost:5000 via le proxy
const response = await api.get('/produits');
```

## ✨ Flux de Communication

1. **Client fait une requête**: `axios.get('/api/produits')`
2. **Vite intercepte**: Via le proxy défini dans `vite.config.js`
3. **Requête redirigée**: Vers `http://localhost:5000/api/produits`
4. **Server reçoit**: Via Express et CORS configuré
5. **Réponse retournée**: Avec les bons headers CORS
6. **Client reçoit**: Via les interceptors axios

## 🐛 Dépannage

### Erreur: "Cannot GET /api/..."
- Vérifiez que le server est en cours d'exécution
- Vérifiez que le port 5000 est libre

### Erreur: "CORS error"
- Le serveur écoute sur le bon port (5000)
- CLIENT_URL est configuré sur http://localhost:5173

### Erreur de connexion DB
- La base de données n'est pas requise en mode développement
- Les routes retourneront une erreur d'authentification, ce qui est normal

## 📦 Dépendances

### Client
- React 18.2.0
- Axios 1.6.8 (requêtes HTTP)
- React Router DOM 6.22.3 (routing)
- Vite 5.2.0 (build tool)

### Server
- Express 4.18.2
- PostgreSQL (pg 8.11.3)
- JWT (jsonwebtoken 9.0.2)
- CORS 2.8.5
- Nodemon (développement)

## 🎯 Prochaines Étapes

1. **Configuration BD**: Adapter les credentials PostgreSQL
2. **Tests**: Utiliser les fichiers test-*.js du serveur
3. **Déploiement**: Utiliser le package.json root pour la structure monorepo
4. **CI/CD**: Utiliser concurrently pour les pipelines

---

✅ **Le front et le back sont maintenant complètement assemblés et prêts à fonctionner ensemble!**
