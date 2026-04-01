const Payment = require('../models/paymentModels');

// POST - Créer un nouveau paiement
exports.createPayment = async (req, res) => {
  try {
    const { id_command, amount } = req.body;

    // Validation
    if (!id_command || !amount) {
      return res.status(400).json({
        success: false,
        message: 'id_command et amount sont requis'
      });
    }

    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'amount doit être un nombre positif'
      });
    }

    const newPayment = await Payment.create(id_command, amount);

    res.status(201).json({
      success: true,
      message: 'Paiement créé avec succès',
      data: newPayment
    });
  } catch (error) {
    console.error('Erreur lors de la création :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer tous les paiements
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();

    if (payments.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aucun paiement trouvé',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer un paiement par ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id_payment } = req.params;

    if (!id_payment) {
      return res.status(400).json({
        success: false,
        message: 'ID de paiement requis'
      });
    }

    const payment = await Payment.findById(id_payment);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer les paiements par commande
exports.getPaymentsByCommand = async (req, res) => {
  try {
    const { id_command } = req.params;

    if (!id_command) {
      return res.status(400).json({
        success: false,
        message: 'ID commande requis'
      });
    }

    const payments = await Payment.findByCommandId(id_command);
    const total = await Payment.getTotalByCommand(id_command);

    res.status(200).json({
      success: true,
      count: payments.length,
      total: parseFloat(total),
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer le total des paiements pour une commande
exports.getTotalByCommand = async (req, res) => {
  try {
    const { id_command } = req.params;

    if (!id_command) {
      return res.status(400).json({
        success: false,
        message: 'ID commande requis'
      });
    }

    const total = await Payment.getTotalByCommand(id_command);

    res.status(200).json({
      success: true,
      total: parseFloat(total)
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer les paiements par plage de dates
exports.getPaymentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'startDate et endDate sont requis (format: YYYY-MM-DD)'
      });
    }

    const payments = await Payment.findByDateRange(startDate, endDate);

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// PUT - Mettre à jour un paiement
exports.updatePayment = async (req, res) => {
  try {
    const { id_payment } = req.params;
    const { id_command, amount } = req.body;

    if (!id_payment) {
      return res.status(400).json({
        success: false,
        message: 'ID de paiement requis'
      });
    }

    if (amount && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'amount doit être un nombre positif'
      });
    }

    const updatedPayment = await Payment.update(id_payment, id_command, amount);

    if (!updatedPayment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Paiement mis à jour avec succès',
      data: updatedPayment
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// DELETE - Supprimer un paiement
exports.deletePayment = async (req, res) => {
  try {
    const { id_payment } = req.params;

    if (!id_payment) {
      return res.status(400).json({
        success: false,
        message: 'ID de paiement requis'
      });
    }

    const deletedPayment = await Payment.delete(id_payment);

    if (!deletedPayment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Paiement supprimé avec succès',
      data: deletedPayment
    });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};
