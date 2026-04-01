const PaymentWebhook = require('../models/webhookModels');
const Payment = require('../models/paymentModels');
const Command = require('../models/commandModels');

// Service de gestion des webhooks de paiement
class WebhookService {

  /**
   * Traiter un webhook de paiement reçu
   * @param {Object} payload - Les données du webhook
   * @param {String} webhook_id - ID unique du webhook
   */
  static async processPaymentWebhook(payload, webhook_id) {
    try {
      console.log(`🔔 Webhook reçu: ${webhook_id}`);

      // Vérifier si le webhook a déjà été traité
      const existing = await PaymentWebhook.findByWebhookId(webhook_id);
      if (existing && existing.status === 'success') {
        console.log(`⚠️ Webhook ${webhook_id} déjà traité`);
        return existing;
      }

      // Extraire les informations du payload
      const { id_command, id_payment, status: payment_status } = payload;

      if (!id_command) {
        throw new Error('id_command manquant dans le payload');
      }

      // Créer le webhook en base de données
      let webhook = existing || await PaymentWebhook.create(
        webhook_id,
        id_payment,
        id_command,
        payload
      );

      // Marquer comme en traitement
      webhook = await PaymentWebhook.markAsProcessing(webhook.id_webhook);

      // Traiter la confirmation du paiement de manière asynchrone
      setImmediate(() => {
        this.confirmPayment(webhook.id_webhook, payload).catch(error => {
          console.error(`❌ Erreur lors du traitement du webhook:`, error);
        });
      });

      return webhook;
    } catch (error) {
      console.error('Erreur lors de la réception du webhook:', error);
      throw error;
    }
  }

  /**
   * Confirmer le paiement (traitement asynchrone)
   * @param {Number} id_webhook - ID du webhook
   * @param {Object} payload - Données du webhook
   */
  static async confirmPayment(id_webhook, payload) {
    try {
      const { id_command, id_payment, status: payment_status, amount } = payload;

      console.log(`⏳ Traitement du paiement pour la commande ${id_command}`);

      // Récupérer la commande
      const command = await Command.findById(id_command);
      if (!command) {
        throw new Error(`Commande ${id_command} non trouvée`);
      }

      // Vérifier le statut du paiement
      if (payment_status === 'SUCCESS' || payment_status === 'success') {
        // Créer l'enregistrement de paiement si nécessaire
        if (!id_payment && amount) {
          const newPayment = await Payment.create(id_command, amount);
          console.log(`✅ Paiement créé: ${newPayment.id_payment}`);
        }

        // Mettre à jour le webhook comme succès
        await PaymentWebhook.updateStatus(id_webhook, 'success');
        console.log(`✅ Webhook ${id_webhook} traité avec succès`);

        // Emit événement (optionnel pour notifications)
        this.emitEvent('payment:success', { id_command, id_payment });

      } else if (payment_status === 'FAILED' || payment_status === 'failed') {
        throw new Error(`Paiement échoué: ${payload.error_message || 'Raison inconnue'}`);
      } else {
        throw new Error(`Statut de paiement non reconnu: ${payment_status}`);
      }

    } catch (error) {
      console.error(`❌ Erreur lors de la confirmation du paiement:`, error);

      // Mettre à jour le webhook avec l'erreur
      await PaymentWebhook.updateStatus(id_webhook, 'pending', error.message);

      // Planifier un retry
      await PaymentWebhook.scheduleRetry(id_webhook);

      throw error;
    }
  }

  /**
   * Traiter les webhooks en attente de retry
   * Appelé régulièrement par un worker ou cron job
   */
  static async processRetries() {
    try {
      console.log(`🔄 Vérification des webhooks à rejouer...`);

      const retryableWebhooks = await PaymentWebhook.getRetryableWebhooks();

      if (retryableWebhooks.length === 0) {
        console.log('✅ Aucun webhook à rejouer');
        return;
      }

      console.log(`📧 ${retryableWebhooks.length} webhooks à traiter`);

      for (const webhook of retryableWebhooks) {
        try {
          console.log(`🔄 Retry #${webhook.retry_count + 1} pour webhook ${webhook.id_webhook}`);

          const payload = typeof webhook.payload === 'string'
            ? JSON.parse(webhook.payload)
            : webhook.payload;

          // Marquer comme en traitement
          await PaymentWebhook.markAsProcessing(webhook.id_webhook);

          // Traiter la confirmation
          await this.confirmPayment(webhook.id_webhook, payload);

        } catch (error) {
          console.error(`❌ Retry échoué pour webhook ${webhook.id_webhook}:`, error.message);

          // Si on a atteint le max de retries
          if (webhook.retry_count >= webhook.max_retries - 1) {
            await PaymentWebhook.updateStatus(
              webhook.id_webhook,
              'failed',
              `Max retries reached: ${error.message}`
            );
            console.log(`❌ Webhook ${webhook.id_webhook} marqué comme échoué (max retries)`);
          } else {
            // Sinon, planifier le prochain retry
            await PaymentWebhook.scheduleRetry(webhook.id_webhook);
          }
        }
      }

    } catch (error) {
      console.error('❌ Erreur lors du traitement des retries:', error);
    }
  }

  /**
   * Obtenir l'état d'un paiement via son webhook
   */
  static async getPaymentStatus(id_command) {
    try {
      const webhooks = await PaymentWebhook.findByCommandId(id_command);

      if (webhooks.length === 0) {
        return {
          status: 'unknown',
          message: 'Aucun webhook trouvé pour cette commande'
        };
      }

      // Prendre le dernier webhook
      const latestWebhook = webhooks[0];

      return {
        status: latestWebhook.status,
        retry_count: latestWebhook.retry_count,
        processed_at: latestWebhook.processed_at,
        error_message: latestWebhook.error_message,
        webhook_id: latestWebhook.webhook_id
      };

    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      throw error;
    }
  }

  /**
   * Émettre un événement (pour notifications en temps réel, etc.)
   */
  static emitEvent(eventName, data) {
    // À implémenter avec WebSocket, EventEmitter, etc.
    console.log(`📢 Événement: ${eventName}`, data);
  }

  /**
   * Obtenir les statistiques des webhooks
   */
  static async getStatistics() {
    try {
      return await PaymentWebhook.getStatistics();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}

module.exports = WebhookService;
