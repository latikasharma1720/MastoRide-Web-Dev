// ✅ UPDATED server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow requests from your deployed frontend + local frontend
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://grateful-happiness-production.up.railway.app",
    ],
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

// ✅ FIXED PORT — Railway gives PORT automatically
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0'; // ✅ THIS IS THE KEY CHANGE

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
});