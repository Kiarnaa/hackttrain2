const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// POST - Ajouter un produit au panier
router.post('/', cartController.addToCart);

// GET - Récupérer le panier d'un utilisateur
router.get('/:id_users', cartController.getCart);

// GET - Récupérer le total du panier
router.get('/:id_users/total', cartController.getCartTotal);

// GET - Récupérer le nombre d'articles
router.get('/:id_users/count', cartController.getItemCount);

// PUT - Mettre à jour la quantité d'un produit
router.put('/:id_cart', cartController.updateQuantity);

// DELETE - Supprimer un produit du panier par ID
router.delete('/:id_cart', cartController.removeFromCart);

// DELETE - Supprimer un produit du panier par utilisateur et produit
router.delete('/:id_users/:id_products', cartController.removeByProduct);

// DELETE - Vider le panier complet
router.delete('/:id_users', cartController.clearCart);

module.exports = router;
