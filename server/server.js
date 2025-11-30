// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// 🔐 CORS: allow local dev + Railway frontend
const allowedOrigins = [
  "http://localhost:3000",
  "https://grateful-happiness-production.up.railway.app",
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

// ✅ Parse JSON request bodies
app.use(express.json());

console.log("Starting server...");

// ✅ Connect to MongoDB using MONGO_URL from .env
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✅ Simple test routes
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ✅ Use Railway's port in production, 5001 locally
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
