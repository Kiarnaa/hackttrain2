const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payments");
const paymentDbRoutes = require("./routes/paymentDb");
const produitsRoutes = require("./routes/produits");
const wishlistRoutes = require("./routes/wishlist");
const cartRoutes = require("./routes/cart");
const commandeRoutes = require("./routes/commande");
const livraisonRoutes = require("./routes/livraison");
const webhookRoutes = require("./routes/webhooks");
const uploadRoutes = require("./routes/upload");
const errorHandler = require("./middleware/errorHandler");
const initDb = require("./config/initDb");

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(require("path").join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/payments-db", paymentDbRoutes);
app.use("/api/produits", produitsRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/commandes", commandeRoutes);
app.use("/api/livraisons", livraisonRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Démarrer le serveur sans initialisation de DB (mode mock)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (mock mode)`);
});
