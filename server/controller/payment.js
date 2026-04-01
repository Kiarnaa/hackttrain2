// Use Mock API or Real API based on environment variable
const useMock = process.env.MVOLA_USE_MOCK === "true";
const mvola = useMock
  ? require("../utils/mvola-mock")
  : require("../utils/mvola");

const {
  initiatePayment,
  getTransactionStatus,
  pollUntilComplete,
  handleMvolaError,
} = mvola;

const PaymentWebhook = require("../models/webhookModels");
const notificationService = require("../services/notificationService");
const { v4: uuidv4 } = require("uuid");

// Log which API is being used
console.log(`📡 Using ${useMock ? "MOCK" : "REAL"} MVola API`);

// For debugging: get all mock transactions
const getAllTransactions = useMock ? mvola.getAllTransactions : null;

/**
 * Initiate a payment
 * POST /api/payments/initiate
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { amount, customerMsisdn, description, reference } = req.body;

    // Validation
    if (!amount || !customerMsisdn || !description) {
      return res.status(400).json({
        error:
          "Missing required fields: amount, customerMsisdn, description",
      });
    }

    const result = await initiatePayment({
      amount,
      customerMsisdn,
      description,
      reference,
      callbackUrl: `${process.env.SERVER_URL}/api/payments/webhook`,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    try {
      handleMvolaError(error);
    } catch (mvolaError) {
      res.status(500).json({ error: mvolaError.message });
    }
    next(error);
  }
};

/**
 * Check transaction status
 * GET /api/payments/status/:serverCorrelationId
 */
exports.getStatus = async (req, res, next) => {
  try {
    const { serverCorrelationId } = req.params;

    if (!serverCorrelationId) {
      return res.status(400).json({ error: "serverCorrelationId required" });
    }

    const status = await getTransactionStatus(serverCorrelationId);

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    try {
      handleMvolaError(error);
    } catch (mvolaError) {
      res.status(500).json({ error: mvolaError.message });
    }
    next(error);
  }
};

/**
 * Poll until transaction is complete
 * POST /api/payments/poll
 */
exports.pollPayment = async (req, res, next) => {
  try {
    const { serverCorrelationId, interval = 3000, timeout = 120000 } = req.body;

    if (!serverCorrelationId) {
      return res.status(400).json({ error: "serverCorrelationId required" });
    }

    const result = await pollUntilComplete(serverCorrelationId, {
      interval,
      timeout,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    try {
      handleMvolaError(error);
    } catch (mvolaError) {
      res.status(500).json({ error: mvolaError.message });
    }
    next(error);
  }
};

/**
 * Webhook for MVola callbacks
 * POST /api/payments/webhook
 */
exports.webhook = async (req, res) => {
  try {
    console.log("📨 Webhook MVola reçu:", req.body);

    // Extract webhook payload
    const {
      webhook_id,
      id_command,
      id_payment,
      status,
      amount,
      error_message,
      transactionReference,
    } = req.body;

    // Validation
    if (!webhook_id || !id_command) {
      return res.status(400).json({
        error: "webhook_id et id_command sont requis",
      });
    }

    // Normalize status to match payment_webhooks table constraints
    // MVola returns: pending, processing, success, failed
    let normalizedStatus = status ? status.toLowerCase() : "pending";
    if (normalizedStatus === "completed") normalizedStatus = "success";

    // Save webhook to database
    const webhook = await PaymentWebhook.create(
      webhook_id || uuidv4(),
      id_payment,
      id_command,
      {
        webhook_id,
        id_command,
        id_payment,
        status: normalizedStatus,
        amount,
        error_message,
        transactionReference,
        receivedAt: new Date().toISOString(),
      }
    );

    console.log(`✓ Webhook enregistré: ${webhook.id_webhook}`);

    // Send notification if status is success or failed
    if (normalizedStatus === "success" || normalizedStatus === "failed") {
      notificationService
        .notifyPaymentStatusChange(id_command, normalizedStatus, amount)
        .catch((err) => console.error("Notification error:", err));
    }

    res.json({ success: true, id_webhook: webhook.id_webhook });
  } catch (error) {
    console.error("Erreur webhook:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Debug: Get all mock transactions (mock mode only)
 * GET /api/payments/debug/transactions
 */
exports.debugTransactions = async (req, res) => {
  if (!useMock) {
    return res.status(403).json({ error: "Only available in mock mode" });
  }

  res.json({
    mode: "mock",
    transactions: getAllTransactions(),
  });
};
