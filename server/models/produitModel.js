const db = require('../config/db');

const getAllProduits = async () => {
    const result = await db.query('SELECT * FROM products');
    return result.rows;
};

const findById = async (id) => {
    const result = await db.query('SELECT * FROM products WHERE id_products = $1', [id]);
    return result.rows[0] || null;
};

const createProduit = async (produit) => {
    const { name, description, price, image_url, size, color, hover_image, delivery, published } = produit;
    const result = await db.query(
        'INSERT INTO products (name, description, price, image_url, size, color, hover_image, delivery, published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [name, description, price, image_url, size, color, hover_image, delivery, published]
    );
    return result.rows[0];
};

const updateProduit = async (id, produit) => {
    const { name, description, price, image_url, size, color, hover_image, delivery, published } = produit;
    const result = await db.query(
        'UPDATE products SET name = $1, description = $2, price = $3, image_url = $4, size = $5, color = $6, hover_image = $7, delivery = $8, published = $9 WHERE id_products = $10 RETURNING *',
        [name, description, price, image_url, size, color, hover_image, delivery, published, id]
    );
    return result.rows[0];
};

const deleteProduit = async (id) => {
    const result = await db.query('DELETE FROM products WHERE id_products = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { findById, getAllProduits, createProduit, updateProduit, deleteProduit };
