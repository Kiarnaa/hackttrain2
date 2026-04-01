const express = require('express');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const paymentsRoutes = require('./payments');
const commandeRoutes = require('./commande');

// Intégrer les routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/commandes', commandeRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({ message: 'API running' });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

module.exports = app;
