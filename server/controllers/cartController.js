const Cart = require('../models/cartModels');

// POST - Ajouter un produit au panier
exports.addToCart = async (req, res) => {
  try {
    const { id_users, id_products, quantity } = req.body;

    // Validation
    if (!id_users || !id_products || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'id_users, id_products et quantity sont requis'
      });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity doit être un nombre positif'
      });
    }

    const cartItem = await Cart.addToCart(id_users, id_products, quantity);

    res.status(201).json({
      success: true,
      message: 'Produit ajouté au panier',
      data: cartItem
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer le panier d'un utilisateur
exports.getCart = async (req, res) => {
  try {
    const { id_users } = req.params;

    if (!id_users) {
      return res.status(400).json({
        success: false,
        message: 'id_users est requis'
      });
    }

    const cartItems = await Cart.getCartByUser(id_users);
    const cartTotal = await Cart.getCartTotal(id_users);

    res.status(200).json({
      success: true,
      count: cartItems.length,
      total: cartTotal,
      data: cartItems
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer le total du panier
exports.getCartTotal = async (req, res) => {
  try {
    const { id_users } = req.params;

    if (!id_users) {
      return res.status(400).json({
        success: false,
        message: 'id_users est requis'
      });
    }

    const total = await Cart.getCartTotal(id_users);

    res.status(200).json({
      success: true,
      data: total
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// GET - Récupérer le nombre d'articles
exports.getItemCount = async (req, res) => {
  try {
    const { id_users } = req.params;

    if (!id_users) {
      return res.status(400).json({
        success: false,
        message: 'id_users est requis'
      });
    }

    const count = await Cart.getCartItemCount(id_users);

    res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Erreur lors de la récupération :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// PUT - Mettre à jour la quantité d'un produit
exports.updateQuantity = async (req, res) => {
  try {
    const { id_cart } = req.params;
    const { quantity } = req.body;

    if (!id_cart) {
      return res.status(400).json({
        success: false,
        message: 'id_cart est requis'
      });
    }

    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: 'quantity est requis'
      });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'quantity doit être un nombre positif'
      });
    }

    const updatedItem = await Cart.updateQuantity(id_cart, quantity);

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: 'Article du panier non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Quantité mise à jour',
      data: updatedItem
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// DELETE - Supprimer un produit du panier par ID
exports.removeFromCart = async (req, res) => {
  try {
    const { id_cart } = req.params;

    if (!id_cart) {
      return res.status(400).json({
        success: false,
        message: 'id_cart est requis'
      });
    }

    const deletedItem = await Cart.removeFromCart(id_cart);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Article du panier non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit supprimé du panier',
      data: deletedItem
    });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// DELETE - Supprimer un produit du panier par utilisateur et produit
exports.removeByProduct = async (req, res) => {
  try {
    const { id_users, id_products } = req.params;

    if (!id_users || !id_products) {
      return res.status(400).json({
        success: false,
        message: 'id_users et id_products sont requis'
      });
    }

    const deletedItem = await Cart.removeByUserAndProduct(id_users, id_products);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé dans le panier'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit supprimé du panier',
      data: deletedItem
    });
  } catch (error) {
    console.error('Erreur lors de la suppression :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};

// DELETE - Vider le panier complet
exports.clearCart = async (req, res) => {
  try {
    const { id_users } = req.params;

    if (!id_users) {
      return res.status(400).json({
        success: false,
        message: 'id_users est requis'
      });
    }

    const deletedItems = await Cart.clearCart(id_users);

    res.status(200).json({
      success: true,
      message: 'Panier vidé avec succès',
      deleted_count: deletedItems.length,
      data: deletedItems
    });
  } catch (error) {
    console.error('Erreur lors du vidage :', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur serveur'
    });
  }
};
