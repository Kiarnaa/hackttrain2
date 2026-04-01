const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController');

// POST - Créer une nouvelle commande
router.post('/', commandController.createCommand);

// GET - Récupérer toutes les commandes
router.get('/', commandController.getAllCommands);

// GET - Récupérer les commandes par utilisateur (avant l'ID spécifique)
router.get('/user/:id_users', commandController.getCommandsByUser);

// GET - Récupérer une commande par ID
router.get('/:id_command', commandController.getCommandById);

// PUT - Mettre à jour une commande
router.put('/:id_command', commandController.updateCommand);

// DELETE - Supprimer une commande
router.delete('/:id_command', commandController.deleteCommand);

module.exports = router;
