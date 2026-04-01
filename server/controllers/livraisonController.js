const Livraison = require('../models/livraisonModels');
const notificationService = require('../services/notificationService');

// POST - Créer une nouvelle livraison
exports.createLivraison = async (req, res) => {
  try {
    const { id_command, date_livraison, status = 'non commencé' } = req.body;

    // Validation
    if (!id_command || !date_livraison) {
      return res.status(400).json({
        success: false,
        message: 'id_command et date_livraison sont requis'
      });
    }

    if (status && !Livraison.VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Statuts valides: ${Livraison.VALID_STATUSES.join(', ')}`
      });
    }

    const newLivraison = await Livraison.create(id_command, date_livraison, status);

    res.status(201).json({
      success: true,
      message: 'Livraison créée avec succès',
      data: newLivraison
    });
  } catch (error) {
    console.error('Erreur lors de la création :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer toutes les livraisons
exports.getAllLivraisons = async (req, res) => {
  try {
    const livraisons = await Livraison.findAll();

    if (livraisons.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aucune livraison trouvée',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: livraisons.length,
      data: livraisons
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer une livraison par ID
exports.getLivraisonById = async (req, res) => {
  try {
    const { id_livraison } = req.params;

    if (!id_livraison) {
      return res.status(400).json({
        success: false,
        message: 'ID de livraison requis'
      });
    }

    const livraison = await Livraison.findById(id_livraison);

    if (!livraison) {
      return res.status(404).json({
        success: false,
        message: 'Livraison non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: livraison
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer les livraisons par commande
exports.getLivraisonsByCommand = async (req, res) => {
  try {
    const { id_command } = req.params;

    if (!id_command) {
      return res.status(400).json({
        success: false,
        message: 'ID commande requis'
      });
    }

    const livraisons = await Livraison.findByCommandId(id_command);

    res.status(200).json({
      success: true,
      count: livraisons.length,
      data: livraisons
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer les livraisons par statut
exports.getLivraisonsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Statut requis'
      });
    }

    if (!Livraison.VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Statuts valides: ${Livraison.VALID_STATUSES.join(', ')}`
      });
    }

    const livraisons = await Livraison.findByStatus(status);

    res.status(200).json({
      success: true,
      count: livraisons.length,
      data: livraisons
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// PUT - Mettre à jour une livraison
exports.updateLivraison = async (req, res) => {
  try {
    const { id_livraison } = req.params;
    const { id_command, date_livraison, status } = req.body;

    if (!id_livraison) {
      return res.status(400).json({
        success: false,
        message: 'ID de livraison requis'
      });
    }

    if (status && !Livraison.VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Statuts valides: ${Livraison.VALID_STATUSES.join(', ')}`
      });
    }

    // Fetch old livraison to detect status change
    const oldLivraison = await Livraison.findById(id_livraison);

    const updatedLivraison = await Livraison.update(
      id_livraison,
      id_command,
      date_livraison,
      status
    );

    if (!updatedLivraison) {
      return res.status(404).json({
        success: false,
        message: 'Livraison non trouvée'
      });
    }

    // Send notification if status changed
    if (oldLivraison && oldLivraison.status !== updatedLivraison.status) {
      notificationService.notifyLivraisonStatusChange(
        updatedLivraison.id_livraison,
        updatedLivraison.id_command,
        oldLivraison.status,
        updatedLivraison.status
      ).catch(err => console.error('Notification error:', err));
    }

    res.status(200).json({
      success: true,
      message: 'Livraison mise à jour avec succès',
      data: updatedLivraison
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// DELETE - Supprimer une livraison
exports.deleteLivraison = async (req, res) => {
  try {
    const { id_livraison } = req.params;

    if (!id_livraison) {
      return res.status(400).json({
        success: false,
        message: 'ID de livraison requis'
      });
    }

    const deletedLivraison = await Livraison.delete(id_livraison);

    if (!deletedLivraison) {
      return res.status(404).json({
        success: false,
        message: 'Livraison non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Livraison supprimée avec succès',
      data: deletedLivraison
    });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};
