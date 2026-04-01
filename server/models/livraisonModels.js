const db = require('../config/db');

// Modèle Livraison
class Livraison {
  constructor(id_livraison, id_command, date_livraison, status) {
    this.id_livraison = id_livraison;
    this.id_command = id_command;
    this.date_livraison = date_livraison;
    this.status = status;
  }

  // Statuts valides
  static VALID_STATUSES = ['non commencé', 'en cours', 'livré', 'annulé'];

  // Créer une nouvelle livraison
  static async create(id_command, date_livraison, status = 'non commencé') {
    try {
      if (!id_command || !date_livraison) {
        throw new Error('id_command et date_livraison sont requis');
      }

      if (!this.VALID_STATUSES.includes(status)) {
        throw new Error(`Statut invalide. Statuts valides: ${this.VALID_STATUSES.join(', ')}`);
      }

      const result = await db.query(
        'INSERT INTO livraison (id_command, date_livraison, status) VALUES ($1, $2, $3) RETURNING *',
        [id_command, date_livraison, status]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer toutes les livraisons
  static async findAll() {
    try {
      const result = await db.query('SELECT * FROM livraison');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer une livraison par ID
  static async findById(id_livraison) {
    try {
      const result = await db.query(
        'SELECT * FROM livraison WHERE id_livraison = $1',
        [id_livraison]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les livraisons par commande
  static async findByCommandId(id_command) {
    try {
      const result = await db.query(
        'SELECT * FROM livraison WHERE id_command = $1',
        [id_command]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les livraisons par statut
  static async findByStatus(status) {
    try {
      if (!this.VALID_STATUSES.includes(status)) {
        throw new Error(`Statut invalide. Statuts valides: ${this.VALID_STATUSES.join(', ')}`);
      }

      const result = await db.query(
        'SELECT * FROM livraison WHERE status = $1',
        [status]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour une livraison
  static async update(id_livraison, id_command, date_livraison, status) {
    try {
      if (!id_livraison) {
        throw new Error('ID de livraison requis');
      }

      if (status && !this.VALID_STATUSES.includes(status)) {
        throw new Error(`Statut invalide. Statuts valides: ${this.VALID_STATUSES.join(', ')}`);
      }

      const result = await db.query(
        'UPDATE livraison SET id_command = COALESCE($1, id_command), date_livraison = COALESCE($2, date_livraison), status = COALESCE($3, status) WHERE id_livraison = $4 RETURNING *',
        [id_command, date_livraison, status, id_livraison]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Supprimer une livraison
  static async delete(id_livraison) {
    try {
      if (!id_livraison) {
        throw new Error('ID de livraison requis');
      }

      const result = await db.query(
        'DELETE FROM livraison WHERE id_livraison = $1 RETURNING *',
        [id_livraison]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Livraison;
