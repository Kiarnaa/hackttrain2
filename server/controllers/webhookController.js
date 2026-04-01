const WebhookService = require('../services/webhookService');
const PaymentWebhook = require('../models/webhookModels');

// POST - Recevoir un webhook de paiement
exports.receivePaymentWebhook = async (req, res) => {
  try {
    const { webhook_id, id_command, id_payment, status, amount, error_message } = req.body;

    // Validation basique
    if (!webhook_id || !id_command) {
      return res.status(400).json({
        success: false,
        message: 'webhook_id et id_command sont requis'
      });
    }

    // Traiter le webhook de manière asynchrone
    const webhook = await WebhookService.processPaymentWebhook(
      {
        webhook_id,
        id_command,
        id_payment,
        status: status || 'SUCCESS',
        amount,
        error_message,
        timestamp: new Date()
      },
      webhook_id
    );

    // Répondre immédiatement (confirmation asynchrone)
    res.status(202).json({
      success: true,
      message: 'Webhook reçu et en traitement',
      data: {
        id_webhook: webhook.id_webhook,
        webhook_id: webhook.webhook_id,
        status: webhook.status
      }
    });

  } catch (error) {
    console.error('Erreur lors de la réception du webhook:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer le statut d'un paiement
exports.getPaymentStatus = async (req, res) => {
  try {
    const { id_command } = req.params;

    if (!id_command) {
      return res.status(400).json({
        success: false,
        message: 'id_command est requis'
      });
    }

    const paymentStatus = await WebhookService.getPaymentStatus(id_command);

    res.status(200).json({
      success: true,
      data: paymentStatus
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du statut:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer les détails d'un webhook
exports.getWebhookDetails = async (req, res) => {
  try {
    const { id_webhook } = req.params;

    if (!id_webhook) {
      return res.status(400).json({
        success: false,
        message: 'id_webhook est requis'
      });
    }

    const webhook = await PaymentWebhook.findById(id_webhook);

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: 'Webhook non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: webhook
    });

  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer les webhooks d'une commande
exports.getCommandWebhooks = async (req, res) => {
  try {
    const { id_command } = req.params;

    if (!id_command) {
      return res.status(400).json({
        success: false,
        message: 'id_command est requis'
      });
    }

    const webhooks = await PaymentWebhook.findByCommandId(id_command);

    res.status(200).json({
      success: true,
      count: webhooks.length,
      data: webhooks
    });

  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// POST - Forcer un retry d'un webhook
exports.retryWebhook = async (req, res) => {
  try {
    const { id_webhook } = req.params;

    if (!id_webhook) {
      return res.status(400).json({
        success: false,
        message: 'id_webhook est requis'
      });
    }

    const webhook = await PaymentWebhook.findById(id_webhook);

    if (!webhook) {
      return res.status(404).json({
        success: false,
        message: 'Webhook non trouvé'
      });
    }

    // Forcer le retry immédiatement
    const updatedWebhook = await PaymentWebhook.scheduleRetry(id_webhook);

    // Traiter le retry de manière asynchrone
    setImmediate(() => {
      const payload = typeof webhook.payload === 'string'
        ? JSON.parse(webhook.payload)
        : webhook.payload;

      WebhookService.confirmPayment(id_webhook, payload).catch(error => {
        console.error(`Erreur lors du retry du webhook ${id_webhook}:`, error);
      });
    });

    res.status(202).json({
      success: true,
      message: 'Retry programmé',
      data: updatedWebhook
    });

  } catch (error) {
    console.error('Erreur lors du retry:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer l'historique des webhooks
exports.getWebhookHistory = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const webhooks = await PaymentWebhook.getHistory(parseInt(limit), parseInt(offset));

    res.status(200).json({
      success: true,
      count: webhooks.length,
      data: webhooks
    });

  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer les statistiques des webhooks
exports.getWebhookStatistics = async (req, res) => {
  try {
    const statistics = await WebhookService.getStatistics();

    res.status(200).json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// POST - Forcer le traitement des retries
exports.processRetries = async (req, res) => {
  try {
    // Lancer le traitement asynchrone
    WebhookService.processRetries().catch(error => {
      console.error('Erreur lors du traitement des retries:', error);
    });

    res.status(202).json({
      success: true,
      message: 'Traitement des retries lancé'
    });

  } catch (error) {
    console.error('Erreur lors du lancement des retries:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};
