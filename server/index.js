const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const paymentRoutes = require("./routes/payments");
const errorHandler = require("./middleware/errorHandler");
const initDb = require("./config/initDb");

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err.message);
    console.warn("⚠️  Continuing without database - using mock mode only");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without database)`);
    });
  });
