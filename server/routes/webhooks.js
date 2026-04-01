const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

// POST - Recevoir un webhook de paiement
router.post('/payment', webhookController.receivePaymentWebhook);

// GET - Récupérer le statut d'un paiement
router.get('/payment-status/:id_command', webhookController.getPaymentStatus);

// GET - Récupérer les webhooks d'une commande
router.get('/command/:id_command', webhookController.getCommandWebhooks);

// GET - Récupérer les détails d'un webhook
router.get('/details/:id_webhook', webhookController.getWebhookDetails);

// POST - Forcer un retry d'un webhook
router.post('/retry/:id_webhook', webhookController.retryWebhook);

// GET - Récupérer l'historique des webhooks
router.get('/history', webhookController.getWebhookHistory);

// GET - Récupérer les statistiques
router.get('/statistics', webhookController.getWebhookStatistics);

// POST - Forcer le traitement des retries (admin only)
router.post('/process-retries', webhookController.processRetries);

module.exports = router;
