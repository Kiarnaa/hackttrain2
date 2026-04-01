/**
 * MVola API - Intégration Node.js
 * API Merchant Pay v1.0
 * Sandbox : https://devapi.mvola.mg
 * Production : https://api.mvola.mg
 */

const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// ─────────────────────────────────────────────
//  Configuration
// ─────────────────────────────────────────────
const CONFIG = {
  sandbox: {
    baseUrl: "https://devapi.mvola.mg",
    consumerKey: process.env.MVOLA_CONSUMER_KEY,
    consumerSecret: process.env.MVOLA_CONSUMER_SECRET,
  },
  production: {
    baseUrl: "https://api.mvola.mg",
    consumerKey: process.env.MVOLA_CONSUMER_KEY,
    consumerSecret: process.env.MVOLA_CONSUMER_SECRET,
  },
};

const ENV = process.env.MVOLA_ENV === "production" ? "production" : "sandbox";
const { baseUrl, consumerKey, consumerSecret } = CONFIG[ENV];

// Numéros de test (sandbox uniquement) : 0343500003 et 0343500004
const MERCHANT_NUMBER = process.env.MVOLA_MERCHANT_NUMBER || "0343500004";
const PARTNER_NAME = process.env.MVOLA_PARTNER_NAME || "ITHKL";

// ─────────────────────────────────────────────
//  Cache du token
// ─────────────────────────────────────────────
let tokenCache = { token: null, expiresAt: 0 };

/**
 * Génère ou retourne un Bearer token depuis le cache.
 * @returns {Promise<string>} Access token
 */
async function getAccessToken() {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64"
  );

  const response = await axios.post(
    `${baseUrl}/token`,
    "grant_type=client_credentials&scope=EXT_INT_MVOLA_API",
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
      },
    }
  );

  const { access_token, expires_in } = response.data;
  tokenCache = {
    token: access_token,
    // Renouveler 30 secondes avant expiration
    expiresAt: now + (expires_in - 30) * 1000,
  };

  console.log(`✅ Token généré (expire dans ${expires_in}s)`);
  return access_token;
}

// ─────────────────────────────────────────────
//  Headers communs
// ─────────────────────────────────────────────
async function buildHeaders(correlationId) {
  const token = await getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Version: "1.0",
    "X-CorrelationID": correlationId || uuidv4(),
    UserLanguage: "FR",
    UserAccountIdentifier: `msisdn;${MERCHANT_NUMBER}`,
    partnerName: PARTNER_NAME,
    "Cache-Control": "no-cache",
  };
}

// ─────────────────────────────────────────────
//  1. Initier un paiement (Merchant Pay)
// ─────────────────────────────────────────────
/**
 * @param {object} params
 * @param {string} params.amount          - Montant en Ariary (ex: "5000")
 * @param {string} params.customerMsisdn  - Numéro du client  (ex: "0340012345")
 * @param {string} params.description     - Description de la transaction
 * @param {string} [params.callbackUrl]   - URL de callback (webhook)
 * @param {string} [params.reference]     - Référence interne (max 50 chars)
 * @returns {Promise<object>} Réponse MVola { status, serverCorrelationId, ... }
 */
async function initiatePayment({
  amount,
  customerMsisdn,
  description,
  callbackUrl,
  reference,
}) {
  const correlationId = uuidv4();
  const headers = await buildHeaders(correlationId);

  if (callbackUrl) {
    headers["X-Callback-URL"] = callbackUrl;
  }

  const body = {
    amount: String(amount),
    currency: "Ar",
    descriptionText: description,
    requestDate: new Date().toISOString(),
    requestingOrganisationTransactionReference:
      reference || `REF-${Date.now()}`,
    originalTransactionReference: correlationId,
    debitParty: [{ key: "msisdn", value: customerMsisdn }],
    creditParty: [{ key: "msisdn", value: MERCHANT_NUMBER }],
    metadata: [{ key: "partnerName", value: PARTNER_NAME }],
  };

  const response = await axios.post(
    `${baseUrl}/mvola/mm/transactions/type/merchantpay/1.0.0/`,
    body,
    { headers }
  );

  console.log("📤 Paiement initié :", response.data);
  return { ...response.data, correlationId };
}

// ─────────────────────────────────────────────
//  2. Vérifier le statut d'une transaction
// ─────────────────────────────────────────────
/**
 * @param {string} serverCorrelationId - ID retourné par initiatePayment
 * @returns {Promise<object>} Statut : pending | completed | failed
 */
async function getTransactionStatus(serverCorrelationId) {
  const headers = await buildHeaders();

  const response = await axios.get(
    `${baseUrl}/mvola/mm/transactions/type/merchantpay/1.0.0/status/${serverCorrelationId}`,
    { headers }
  );

  console.log("🔍 Statut transaction :", response.data);
  return response.data;
}

// ─────────────────────────────────────────────
//  3. Récupérer les détails d'une transaction
// ─────────────────────────────────────────────
/**
 * @param {string} transactionId - objectReference retourné quand status=completed
 * @returns {Promise<object>} Détails complets de la transaction
 */
async function getTransactionDetails(transactionId) {
  const headers = await buildHeaders();

  const response = await axios.get(
    `${baseUrl}/mvola/mm/transactions/type/merchantpay/1.0.0/${transactionId}`,
    { headers }
  );

  console.log("📋 Détails transaction :", response.data);
  return response.data;
}

// ─────────────────────────────────────────────
//  4. Polling automatique jusqu'à completion
// ─────────────────────────────────────────────
/**
 * Interroge l'API toutes les `interval` ms jusqu'à ce que la transaction
 * soit complétée ou échouée, ou jusqu'au timeout.
 *
 * @param {string} serverCorrelationId
 * @param {object} [options]
 * @param {number} [options.interval=3000]   - Intervalle en ms entre chaque poll
 * @param {number} [options.timeout=120000]  - Timeout total en ms
 * @returns {Promise<object>} Dernier statut connu
 */
async function pollUntilComplete(
  serverCorrelationId,
  { interval = 3000, timeout = 120000 } = {}
) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const status = await getTransactionStatus(serverCorrelationId);

    if (status.status === "completed") {
      console.log("✅ Transaction complétée !");
      return status;
    }
    if (status.status === "failed") {
      console.error("❌ Transaction échouée :", status);
      return status;
    }

    console.log(
      `⏳ Statut: ${status.status} – nouvel essai dans ${interval / 1000}s…`
    );
    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error(
    "⏰ Timeout : la transaction n'a pas abouti dans le délai imparti."
  );
}

// ─────────────────────────────────────────────
//  5. Gestion des erreurs HTTP MVola
// ─────────────────────────────────────────────
function handleMvolaError(error) {
  if (error.response) {
    const { status, data } = error.response;
    const fault = data?.fault || data;
    console.error(`❌ Erreur MVola [HTTP ${status}]:`, fault);

    // Codes d'erreur connus
    const errorMessages = {
      900901: "Identifiants invalides (token expiré ou incorrect)",
      900902: "En-tête Authorization manquant",
      900906: "Méthode HTTP non autorisée",
      900907: "API désactivée",
      900910: "Quota d'abonnement dépassé",
      900800: "Message de requête invalide",
    };

    const msg =
      errorMessages[fault?.code] || fault?.message || "Erreur inconnue";
    throw new Error(`MVola API Error ${fault?.code}: ${msg}`);
  }
  throw error;
}

// ─────────────────────────────────────────────
//  Export du module
// ─────────────────────────────────────────────
module.exports = {
  getAccessToken,
  initiatePayment,
  getTransactionStatus,
  getTransactionDetails,
  pollUntilComplete,
  handleMvolaError,
};
