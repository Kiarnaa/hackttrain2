const express = require('express');
const router = express.Router();
const livraisonController = require('../controllers/livraisonController');

// POST - Créer une nouvelle livraison
router.post('/', livraisonController.createLivraison);

// GET - Récupérer toutes les livraisons
router.get('/', livraisonController.getAllLivraisons);

// GET - Récupérer les livraisons par statut (avant l'ID spécifique)
router.get('/status/:status', livraisonController.getLivraisonsByStatus);

// GET - Récupérer les livraisons par commande (avant l'ID spécifique)
router.get('/command/:id_command', livraisonController.getLivraisonsByCommand);

// GET - Récupérer une livraison par ID
router.get('/:id_livraison', livraisonController.getLivraisonById);

// PUT - Mettre à jour une livraison
router.put('/:id_livraison', livraisonController.updateLivraison);

// DELETE - Supprimer une livraison
router.delete('/:id_livraison', livraisonController.deleteLivraison);

module.exports = router;
