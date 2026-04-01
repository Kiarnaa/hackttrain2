const db = require('../config/db');

const addToWishlist = async (userId, productId) => {
    const result = await db.query(
        'INSERT INTO wishlists (id_users, id_products) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        [userId, productId]
    );
    return result.rows[0] || null;
};

const removeFromWishlist = async (userId, productId) => {
    const result = await db.query(
        'DELETE FROM wishlists WHERE id_users = $1 AND id_products = $2 RETURNING *',
        [userId, productId]
    );
    return result.rows[0] || null;
};

const getWishlistByUser = async (userId) => {
    const result = await db.query(
        'SELECT p.* FROM wishlists w JOIN products p ON w.id_products = p.id_products WHERE w.id_users = $1',
        [userId]
    );
    return result.rows;
};

module.exports = { addToWishlist, removeFromWishlist, getWishlistByUser };