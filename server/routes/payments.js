const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment");

/**
 * Initiate a payment
 * POST /api/payments/initiate
 * Body: { amount, customerMsisdn, description, reference? }
 */
router.post("/initiate", paymentController.initiatePayment);

/**
 * Check payment status
 * GET /api/payments/status/:serverCorrelationId
 */
router.get("/status/:serverCorrelationId", paymentController.getStatus);

/**
 * Poll until payment is complete
 * POST /api/payments/poll
 * Body: { serverCorrelationId, interval?, timeout? }
 */
router.post("/poll", paymentController.pollPayment);

/**
 * Webhook for MVola callbacks
 * POST /api/payments/webhook
 */
router.post("/webhook", paymentController.webhook);

/**
 * Debug: Get all mock transactions (mock mode only)
 * GET /api/payments/debug/transactions
 */
router.get("/debug/transactions", paymentController.debugTransactions);

module.exports = router;
