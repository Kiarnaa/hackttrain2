const db = require('../config/db');

// Modèle Payment
class Payment {
  constructor(id_payment, id_command, amount, payment_date) {
    this.id_payment = id_payment;
    this.id_command = id_command;
    this.amount = amount;
    this.payment_date = payment_date;
  }

  // Créer un nouveau paiement
  static async create(id_command, amount) {
    try {
      if (!id_command || !amount) {
        throw new Error('id_command et amount sont requis');
      }

      if (isNaN(amount) || amount <= 0) {
        throw new Error('amount doit être un nombre positif');
      }

      const result = await db.query(
        'INSERT INTO payment (id_command, amount) VALUES ($1, $2) RETURNING *',
        [id_command, amount]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer tous les paiements
  static async findAll() {
    try {
      const result = await db.query('SELECT * FROM payment ORDER BY payment_date DESC');
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer un paiement par ID
  static async findById(id_payment) {
    try {
      const result = await db.query(
        'SELECT * FROM payment WHERE id_payment = $1',
        [id_payment]
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les paiements par commande
  static async findByCommandId(id_command) {
    try {
      const result = await db.query(
        'SELECT * FROM payment WHERE id_command = $1 ORDER BY payment_date DESC',
        [id_command]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer les paiements par plage de dates
  static async findByDateRange(startDate, endDate) {
    try {
      const result = await db.query(
        'SELECT * FROM payment WHERE payment_date BETWEEN $1 AND $2 ORDER BY payment_date DESC',
        [startDate, endDate]
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Récupérer le montant total des paiements pour une commande
  static async getTotalByCommand(id_command) {
    try {
      const result = await db.query(
        'SELECT SUM(amount) as total FROM payment WHERE id_command = $1',
        [id_command]
      );
      return result.rows[0].total || 0;
    } catch (error) {
      throw error;
    }
  }

  // Mettre à jour un paiement
  static async update(id_payment, id_command, amount) {
    try {
      if (!id_payment) {
        throw new Error('ID de paiement requis');
      }

      if (amount && (isNaN(amount) || amount <= 0)) {
        throw new Error('amount doit être un nombre positif');
      }

      const result = await db.query(
        'UPDATE payment SET id_command = COALESCE($1, id_command), amount = COALESCE($2, amount) WHERE id_payment = $3 RETURNING *',
        [id_command, amount, id_payment]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Supprimer un paiement
  static async delete(id_payment) {
    try {
      if (!id_payment) {
        throw new Error('ID de paiement requis');
      }

      const result = await db.query(
        'DELETE FROM payment WHERE id_payment = $1 RETURNING *',
        [id_payment]
      );

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Payment;
