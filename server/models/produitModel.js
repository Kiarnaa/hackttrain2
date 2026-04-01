const db = require('../config/db');

const getAllProduits = async () => {
    const result = await db.query('SELECT * FROM products');
    return result.rows;
};

const findById = async (id) => {
    const result = await db.query('SELECT * FROM products WHERE id_products = $1', [id]);
    return result.rows[0] || null;
};

module.exports = { findById, getAllProduits };
