const express = require('express');
const router = express.Router();
const paymentDatabaseController = require('../controllers/paymentDatabaseController');

// POST - Créer un nouveau paiement
router.post('/', paymentDatabaseController.createPayment);

// GET - Récupérer tous les paiements
router.get('/', paymentDatabaseController.getAllPayments);

// GET - Récupérer les paiements par plage de dates
router.get('/range', paymentDatabaseController.getPaymentsByDateRange);

// GET - Récupérer le total des paiements pour une commande
router.get('/total/:id_command', paymentDatabaseController.getTotalByCommand);

// GET - Récupérer les paiements par commande (avant l'ID spécifique)
router.get('/command/:id_command', paymentDatabaseController.getPaymentsByCommand);

// GET - Récupérer un paiement par ID
router.get('/:id_payment', paymentDatabaseController.getPaymentById);

// PUT - Mettre à jour un paiement
router.put('/:id_payment', paymentDatabaseController.updatePayment);

// DELETE - Supprimer un paiement
router.delete('/:id_payment', paymentDatabaseController.deletePayment);

module.exports = router;
