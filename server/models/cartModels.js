const db = require('../config/db');

// Modèle Cart (Panier)
class Cart {
  constructor(id_cart, id_users, id_products, quantity, added_at) {
    this.id_cart = id_cart;
    this.id_users = id_users;
    this.id_products = id_products;
    this.quantity = quantity;
    this.added_at = added_at;
  }

  // Ajouter un produit au panier
  static async addToCart(id_users, id_products, quantity) {
    try {
      if (!id_users || !id_products || !quantity) {
        throw new Error('id_users, id_products et quantity sont requis');
      }

      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('quantity doit être un nombre positif');
      }

      // Vérifier si le produit existe déjà dans le panier
      const existing = await db.query(
        'SELECT * FROM cart WHERE id_users = $1 AND id_products = $2',
        [id_users, id_products]
      );

      if (existing.rows.length > 0) {
        // Mettre à jour la quantité
        const result = await db.query(
          'UPDATE cart SET quantity = quantity + $1 WHERE id_users = $2 AND id_products = $3 RETURNING *',
          [quantity, id_users, id_products]
        );
        return result.rows[0];
      } else {
        // Créer un nouveau produit dans le panier
        const result = await db.query(
          'INSERT INTO cart (id_users, id_products, quantity) VALUES ($1, $2, $3) RETURNING *',
          [id_users, id_products, quantity]
        );
        return result.rows[0];
      }
    } catch (error) {
      throw error;
    }
  }

  // Récupérer le panier d'un utilisateur
  static async getCartByUser(id_users) {
    try {
      if (!id_users) {
        throw new Error('id_users est requis');
      }

      const result = await db.query(
        `SELECT c.*, p.name, p.price, p.image_url, (p.price * c.quantity) as subtotal
         FROM cart c
         JOIN products p ON c.id_products = p.id_products
         WHERE c.id_users = $1
         ORDER BY c.added_at DESC`,
        [id_users]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un article du panier
  static async getCartItem(id_cart) {
    try {
      const result = await db.query(
        `SELECT c.*, p.name, p.price, p.image_url, (p.price * c.quantity) as subtotal
         FROM cart c
         JOIN products p ON c.id_products = p.id_products
         WHERE c.id_cart = $1`,
        [id_cart]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour la quantité d'un produit
  static async updateQuantity(id_cart, quantity) {
    try {
      if (!id_cart || !quantity) {
        throw new Error('id_cart et quantity sont requis');
      }

      if (isNaN(quantity) || quantity <= 0) {
        throw new Error('quantity doit être un nombre positif');
      }

      const result = await db.query(
        'UPDATE cart SET quantity = $1 WHERE id_cart = $2 RETURNING *',
        [quantity, id_cart]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un produit du panier
  static async removeFromCart(id_cart) {
    try {
      if (!id_cart) {
        throw new Error('id_cart est requis');
      }

      const result = await db.query(
        'DELETE FROM cart WHERE id_cart = $1 RETURNING *',
        [id_cart]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Supprimer le produit du panier par utilisateur et produit
  static async removeByUserAndProduct(id_users, id_products) {
    try {
      if (!id_users || !id_products) {
        throw new Error('id_users et id_products sont requis');
      }

      const result = await db.query(
        'DELETE FROM cart WHERE id_users = $1 AND id_products = $2 RETURNING *',
        [id_users, id_products]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Vider le panier complet d'un utilisateur
  static async clearCart(id_users) {
    try {
      if (!id_users) {
        throw new Error('id_users est requis');
      }

      const result = await db.query(
        'DELETE FROM cart WHERE id_users = $1 RETURNING *',
        [id_users]
      );

      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Calculer le total du panier pour un utilisateur
  static async getCartTotal(id_users) {
    try {
      if (!id_users) {
        throw new Error('id_users est requis');
      }

      const result = await db.query(
        `SELECT
          COUNT(*) as item_count,
          SUM(c.quantity) as total_quantity,
          SUM(p.price * c.quantity) as total_price
         FROM cart c
         JOIN products p ON c.id_products = p.id_products
         WHERE c.id_users = $1`,
        [id_users]
      );

      const data = result.rows[0];
      return {
        item_count: parseInt(data.item_count) || 0,
        total_quantity: parseInt(data.total_quantity) || 0,
        total_price: data.total_price ? parseFloat(data.total_price) : 0
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtenir le nombre d'articles dans le panier
  static async getCartItemCount(id_users) {
    try {
      if (!id_users) {
        throw new Error('id_users est requis');
      }

      const result = await db.query(
        'SELECT COUNT(*) as count FROM cart WHERE id_users = $1',
        [id_users]
      );

      return parseInt(result.rows[0].count) || 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cart;
