/**
 * Mock MVola API - For testing without real MVola credentials
 * Simulates realistic payment flows and responses
 */

const { v4: uuidv4 } = require("uuid");

// In-memory storage for mock transactions
const transactions = new Map();

// Mock access token (cached for performance)
let tokenCache = { token: null, expiresAt: 0 };

/**
 * Mock: Generate Access Token
 */
async function getAccessToken() {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  // Simulate API delay
  await new Promise((r) => setTimeout(r, 500));

  const mockToken =
    "mock_access_token_" + uuidv4().substring(0, 8) + "_sandbox";
  tokenCache = {
    token: mockToken,
    expiresAt: now + 3600 * 1000, // 1 hour
  };

  console.log(`✅ Mock Token généré: ${mockToken}`);
  return mockToken;
}

/**
 * Mock: Initiate Payment
 * Returns: { status, serverCorrelationId, ... }
 */
async function initiatePayment({
  amount,
  customerMsisdn,
  description,
  callbackUrl,
  reference,
}) {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 300));

  const correlationId = uuidv4();
  const transactionId = uuidv4();

  // Store transaction in memory
  const transaction = {
    correlationId,
    transactionId,
    amount,
    customerMsisdn,
    description,
    reference: reference || `REF-${Date.now()}`,
    status: "pending", // Will change over time
    createdAt: new Date().toISOString(),
    statusChangedAt: new Date().toISOString(),
    callbackUrl,
  };

  transactions.set(correlationId, transaction);

  // Simulate random status transition
  // 70% → "pending" then "completed"
  // 20% → "pending" then "failed"
  // 10% → "rejected" immediately
  const rand = Math.random();
  if (rand < 0.1) {
    transaction.status = "rejected";
  } else if (rand < 0.3) {
    // Will fail after a few seconds
    setTimeout(() => {
      transaction.status = "failed";
      transaction.statusChangedAt = new Date().toISOString();
    }, 5000);
  } else {
    // Will complete after a few seconds
    setTimeout(() => {
      transaction.status = "completed";
      transaction.statusChangedAt = new Date().toISOString();
    }, 3000);
  }

  console.log(`📤 Mock Payment initiated: ${correlationId}`);

  return {
    status: transaction.status,
    serverCorrelationId: correlationId,
    objectReference: transactionId,
    requestDate: new Date().toISOString(),
  };
}

/**
 * Mock: Get Transaction Status
 */
async function getTransactionStatus(serverCorrelationId) {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 200));

  const transaction = transactions.get(serverCorrelationId);

  if (!transaction) {
    throw new Error(
      `Transaction ${serverCorrelationId} not found`
    );
  }

  console.log(`🔍 Mock Transaction status: ${transaction.status}`);

  return {
    status: transaction.status,
    serverCorrelationId,
    requestDate: transaction.createdAt,
    statusLastChangedTime: transaction.statusChangedAt,
  };
}

/**
 * Mock: Get Transaction Details
 */
async function getTransactionDetails(transactionId) {
  // Simulate API delay
  await new Promise((r) => setTimeout(r, 200));

  // Find transaction by ID
  let transaction = null;
  for (const tx of transactions.values()) {
    if (tx.transactionId === transactionId) {
      transaction = tx;
      break;
    }
  }

  if (!transaction) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  return {
    objectReference: transactionId,
    amount: transaction.amount,
    currency: "Ar",
    descriptionText: transaction.description,
    debitParty: [{ key: "msisdn", value: transaction.customerMsisdn }],
    creditParty: [{ key: "msisdn", value: "0343500004" }],
    status: transaction.status,
    transactionStatus: transaction.status,
    transactionReference: transaction.reference,
    createdDate: transaction.createdAt,
  };
}

/**
 * Mock: Poll until Complete
 */
async function pollUntilComplete(
  serverCorrelationId,
  { interval = 3000, timeout = 120000 } = {}
) {
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const status = await getTransactionStatus(serverCorrelationId);

    if (status.status === "completed") {
      console.log("✅ Mock Transaction complétée!");
      return status;
    }
    if (status.status === "failed") {
      console.error("❌ Mock Transaction échouée");
      return status;
    }

    console.log(
      `⏳ Status: ${status.status} – nouvel essai dans ${interval / 1000}s…`
    );
    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error(
    "⏰ Timeout : la transaction n'a pas abouti dans le délai imparti."
  );
}

/**
 * Mock: Handle Errors (same as real)
 */
function handleMvolaError(error) {
  throw error;
}

/**
 * Get all mock transactions (debug only)
 */
function getAllTransactions() {
  return Array.from(transactions.values());
}

module.exports = {
  getAccessToken,
  initiatePayment,
  getTransactionStatus,
  getTransactionDetails,
  pollUntilComplete,
  handleMvolaError,
  getAllTransactions,
};
