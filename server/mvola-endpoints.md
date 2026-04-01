# MVola API Endpoints - Guide de vérification

## 📍 Où trouver les endpoints

1. Va sur [https://developer.mvola.mg](https://developer.mvola.mg)
2. Connecte-toi avec ton compte
3. Cherche la documentation API pour **Merchant Pay v1.0**
4. Tu devrais voir une section comme:
   - **API Base URL**
   - **Endpoints disponibles**
   - **Merchant Pay** ou **Payment Initiation**

## 🔍 Endpoints typiques MVola

Voici les endpoints attendus dans `mvola.js`:

```javascript
// Token endpoint (déjà testé - ✅ MARCHE)
POST /token
Authorization: Basic {base64(key:secret)}

// Initiation de paiement (❌ 404)
POST /mvola/mm/transactions/type/merchantpay/1.0/
  ou
POST /v1/mvola/mm/transactions/type/merchantpay
  ou
POST /transactions/merchantpay
```

## 📋 À vérifier dans la documentation MVola

- [ ] L'URL exacte pour initier un paiement
- [ ] Le format du body (paramètres requis)
- [ ] Les headers requis
- [ ] La version de l'API (v1.0? v2?)
- [ ] Le chemin exact: `/mvola/mm/...` ou autre?

## 🛠️ Comment tester les endpoints

Une fois que tu as l'endpoint correct:

1. Mets à jour le chemin dans `server/utils/mvola.js` ligne 131
2. Relance le test: `node test-mvola.js`

## 📞 Besoin d'aide?

Si tu trouves l'endpoint correct, colle-le ici et je mettrai à jour le code! 👇
