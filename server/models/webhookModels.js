const db = require('../config/db');

// Modèle Webhook de Paiement
class PaymentWebhook {
  constructor(id_webhook, webhook_id, id_payment, id_command, status, payload, retry_count) {
    this.id_webhook = id_webhook;
    this.webhook_id = webhook_id;
    this.id_payment = id_payment;
    this.id_command = id_command;
    this.status = status;
    this.payload = payload;
    this.retry_count = retry_count;
  }

  // Créer un nouveau webhook
  static async create(webhook_id, id_payment, id_command, payload) {
    try {
      if (!webhook_id || !id_command) {
        throw new Error('webhook_id et id_command sont requis');
      }

      const result = await db.query(
        `INSERT INTO payment_webhooks (webhook_id, id_payment, id_command, payload, status)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [webhook_id, id_payment, id_command, JSON.stringify(payload), 'pending']
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un webhook par ID
  static async findById(id_webhook) {
    try {
      const result = await db.query(
        'SELECT * FROM payment_webhooks WHERE id_webhook = $1',
        [id_webhook]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un webhook par webhook_id
  static async findByWebhookId(webhook_id) {
    try {
      const result = await db.query(
        'SELECT * FROM payment_webhooks WHERE webhook_id = $1',
        [webhook_id]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les webhooks en attente de traitement
  static async getPendingWebhooks() {
    try {
      const result = await db.query(
        `SELECT * FROM payment_webhooks
         WHERE status = 'pending' OR (status = 'processing' AND next_retry_at <= NOW())
         ORDER BY created_at ASC
         LIMIT 10`
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les webhooks en attente de retry
  static async getRetryableWebhooks() {
    try {
      const result = await db.query(
        `SELECT * FROM payment_webhooks
         WHERE status IN ('pending', 'failed')
         AND retry_count < max_retries
         AND (next_retry_at IS NULL OR next_retry_at <= NOW())
         ORDER BY retry_count ASC, created_at ASC
         LIMIT 10`
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour le statut du webhook
  static async updateStatus(id_webhook, status, error_message = null) {
    try {
      if (!id_webhook || !status) {
        throw new Error('id_webhook et status sont requis');
      }

      const processed_at = status === 'success' ? new Date() : null;

      const result = await db.query(
        `UPDATE payment_webhooks
         SET status = $1, error_message = $2, processed_at = $3
         WHERE id_webhook = $4
         RETURNING *`,
        [status, error_message, processed_at, id_webhook]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Marquer pour retry avec délai exponentiel
  static async scheduleRetry(id_webhook) {
    try {
      if (!id_webhook) {
        throw new Error('id_webhook est requis');
      }

      const webhook = await this.findById(id_webhook);

      if (!webhook) {
        throw new Error('Webhook non trouvé');
      }

      if (webhook.retry_count >= webhook.max_retries) {
        return await this.updateStatus(id_webhook, 'failed', 'Max retries reached');
      }

      // Délai exponentiel: 60s, 120s, 240s, 480s, 960s (max 16 min)
      const delaySeconds = Math.min(60 * Math.pow(2, webhook.retry_count), 960);
      const nextRetryAt = new Date(Date.now() + delaySeconds * 1000);

      const result = await db.query(
        `UPDATE payment_webhooks
         SET status = 'pending', retry_count = retry_count + 1, next_retry_at = $1
         WHERE id_webhook = $2
         RETURNING *`,
        [nextRetryAt, id_webhook]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Marquer comme en traitement
  static async markAsProcessing(id_webhook) {
    try {
      const result = await db.query(
        `UPDATE payment_webhooks
         SET status = 'processing'
         WHERE id_webhook = $1
         RETURNING *`,
        [id_webhook]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les webhooks par commande
  static async findByCommandId(id_command) {
    try {
      const result = await db.query(
        'SELECT * FROM payment_webhooks WHERE id_command = $1 ORDER BY created_at DESC',
        [id_command]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer l'historique des webhooks
  static async getHistory(limit = 50, offset = 0) {
    try {
      const result = await db.query(
        `SELECT * FROM payment_webhooks
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les statistiques des webhooks
  static async getStatistics() {
    try {
      const result = await db.query(
        `SELECT
           COUNT(*) as total,
           SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count,
           SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count,
           SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count,
           SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_count,
           AVG(retry_count) as avg_retries
         FROM payment_webhooks`
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PaymentWebhook;
