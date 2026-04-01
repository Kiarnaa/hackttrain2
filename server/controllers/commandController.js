const Command = require('../models/commandModels');

// POST - Créer une nouvelle commande
exports.createCommand = async (req, res) => {
  try {
    const { id_users, id_products, quantity } = req.body;

    // Validation
    if (!id_users || !id_products || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La quantité doit être supérieure à 0'
      });
    }

    const newCommand = await Command.create(id_users, id_products, quantity);

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: newCommand
    });
  } catch (error) {
    console.error('Erreur lors de la création :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer toutes les commandes
exports.getAllCommands = async (req, res) => {
  try {
    const commands = await Command.findAll();

    if (commands.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Aucune commande trouvée',
        data: []
      });
    }

    res.status(200).json({
      success: true,
      count: commands.length,
      data: commands
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer une commande par ID
exports.getCommandById = async (req, res) => {
  try {
    const { id_command } = req.params;

    if (!id_command) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande requis'
      });
    }

    const command = await Command.findById(id_command);

    if (!command) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      data: command
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer les commandes par utilisateur
exports.getCommandsByUser = async (req, res) => {
  try {
    const { id_users } = req.params;

    if (!id_users) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur requis'
      });
    }

    const commands = await Command.findByUserId(id_users);

    res.status(200).json({
      success: true,
      count: commands.length,
      data: commands
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// PUT - Mettre à jour une commande
exports.updateCommand = async (req, res) => {
  try {
    const { id_command } = req.params;
    const { id_users, id_products, quantity } = req.body;

    if (!id_command) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande requis'
      });
    }

    if (quantity && quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'La quantité doit être supérieure à 0'
      });
    }

    const updatedCommand = await Command.update(
      id_command,
      id_users,
      id_products,
      quantity
    );

    if (!updatedCommand) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Commande mise à jour avec succès',
      data: updatedCommand
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// DELETE - Supprimer une commande
exports.deleteCommand = async (req, res) => {
  try {
    const { id_command } = req.params;

    if (!id_command) {
      return res.status(400).json({
        success: false,
        message: 'ID de commande requis'
      });
    }

    const deletedCommand = await Command.delete(id_command);

    if (!deletedCommand) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Commande supprimée avec succès',
      data: deletedCommand
    });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};
