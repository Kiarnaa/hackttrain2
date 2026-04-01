const db = require('../config/db');

// Modèle Command
class Command {
  constructor(id_command, id_users, id_products, quantity) {
    this.id_command = id_command;
    this.id_users = id_users;
    this.id_products = id_products;
    this.quantity = quantity;
  }

  // Créer une nouvelle commande
  static async create(id_users, id_products, quantity) {
    try {
      if (!id_users || !id_products || !quantity) {
        throw new Error('Tous les champs sont requis');
      }

      if (quantity <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
      }

      const result = await db.query(
        'INSERT INTO command (id_users, id_products, quantity) VALUES ($1, $2, $3) RETURNING *',
        [id_users, id_products, quantity]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer toutes les commandes
  static async findAll() {
    try {
      const result = await db.query('SELECT * FROM command');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer une commande par ID
  static async findById(id_command) {
    try {
      const result = await db.query(
        'SELECT * FROM command WHERE id_command = $1',
        [id_command]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les commandes par utilisateur
  static async findByUserId(id_users) {
    try {
      const result = await db.query(
        'SELECT * FROM command WHERE id_users = $1',
        [id_users]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour une commande
  static async update(id_command, id_users, id_products, quantity) {
    try {
      if (!id_command) {
        throw new Error('ID de commande requis');
      }

      if (quantity && quantity <= 0) {
        throw new Error('La quantité doit être supérieure à 0');
      }

      const result = await db.query(
        'UPDATE command SET id_users = COALESCE($1, id_users), id_products = COALESCE($2, id_products), quantity = COALESCE($3, quantity) WHERE id_command = $4 RETURNING *',
        [id_users, id_products, quantity, id_command]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Supprimer une commande
  static async delete(id_command) {
    try {
      if (!id_command) {
        throw new Error('ID de commande requis');
      }

      const result = await db.query(
        'DELETE FROM command WHERE id_command = $1 RETURNING *',
        [id_command]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Command;
