const WebhookService = require('../services/webhookService');

/**
 * Worker pour traiter les webhooks en arrière-plan
 * À exécuter régulièrement (cron job, interval, etc.)
 */

// Configuration
const RETRY_INTERVAL = 60000; // 1 minute
const AUTO_RETRY_ENABLED = process.env.WEBHOOK_AUTO_RETRY === 'true' || true;

// Variable pour stocker l'intervalle
let retryInterval = null;

/**
 * Démarrer le worker
 */
function startWebhookWorker() {
  if (!AUTO_RETRY_ENABLED) {
    console.log('⚙️ Worker de webhooks désactivé');
    return;
  }

  console.log('🚀 Démarrage du worker de webhooks...');

  // Traiter les retries immédiatement au démarrage
  processRetries();

  // Puis à intervalles réguliers
  retryInterval = setInterval(() => {
    processRetries();
  }, RETRY_INTERVAL);

  console.log(`✅ Worker de webhooks actif (intervalle: ${RETRY_INTERVAL}ms)`);
}

/**
 * Arrêter le worker
 */
function stopWebhookWorker() {
  if (retryInterval) {
    clearInterval(retryInterval);
    retryInterval = null;
    console.log('⏹️ Worker de webhooks arrêté');
  }
}

/**
 * Traiter les retries
 */
async function processRetries() {
  try {
    await WebhookService.processRetries();
  } catch (error) {
    console.error('❌ Erreur du worker:', error);
  }
}

/**
 * Exporter les fonctions
 */
module.exports = {
  startWebhookWorker,
  stopWebhookWorker,
  processRetries
};
