const wishlistModel = require('../models/wishlistModel');
const notificationService = require('../services/notificationService');

const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id_users; // assuming auth middleware sets req.user

        if (!productId) {
            return res.status(400).json({ message: 'productId est requis' });
        }

        const added = await wishlistModel.addToWishlist(userId, productId);
        if (added) {
            // Send notification on successful add
            notificationService.notifyWishlistEvent(req.user, 'added', `Produit #${productId}`)
                .catch(err => console.error('Notification error:', err));

            res.status(201).json({ message: 'Produit ajouté à la wishlist' });
        } else {
            res.status(409).json({ message: 'Produit déjà dans la wishlist' });
        }
    } catch (err) {
        next(err);
    }
};

const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id_users;

        const removed = await wishlistModel.removeFromWishlist(userId, parseInt(productId, 10));
        if (removed) {
            // Send notification on successful remove
            notificationService.notifyWishlistEvent(req.user, 'removed', `Produit #${productId}`)
                .catch(err => console.error('Notification error:', err));

            res.json({ message: 'Produit retiré de la wishlist' });
        } else {
            res.status(404).json({ message: 'Produit non trouvé dans la wishlist' });
        }
    } catch (err) {
        next(err);
    }
};

const getWishlist = async (req, res, next) => {
    try {
        const userId = req.user.id_users;
        const wishlist = await wishlistModel.getWishlistByUser(userId);
        res.json({ wishlist });
    } catch (err) {
        next(err);
    }
};

module.exports = { addToWishlist, removeFromWishlist, getWishlist };
