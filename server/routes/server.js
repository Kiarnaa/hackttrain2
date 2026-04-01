const express = require('express');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./auth');
const usersRoutes = require('./users');
const paymentsRoutes = require('./payments');
const paymentDbRoutes = require('./paymentDb');
const commandeRoutes = require('./commande');
const livraisonRoutes = require('./livraison');
const cartRoutes = require('./cart');
const webhookRoutes = require('./webhooks');

// Intégrer les routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/payments-db', paymentDbRoutes);
app.use('/api/commandes', commandeRoutes);
app.use('/api/livraisons', livraisonRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/webhooks', webhookRoutes);

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
