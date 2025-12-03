// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:3000", // local dev
  "https://mastoride-frontend-deploy-production.up.railway.app", // 👈 your Railway frontend
];

app.use(
  cors({
    origin(origin, cb) {
      // allow tools like Postman / curl (no origin header)
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS not allowed"), false);
    },
    credentials: true,
  })
);

// ---------- JSON body parser ----------
app.use(express.json());

console.log("Starting server...");

// ---------- MongoDB connect ----------
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/mastoride";
if (!process.env.MONGO_URL) {
  console.warn("Warning: MONGO_URL not set — using fallback:", mongoUrl);
}

mongoose
  .connect(mongoUrl)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ---------- Routes ----------
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const studentRoutes = require("./routes/student");
app.use("/api/student", studentRoutes);

const bookingRoutes = require("./routes/booking");
app.use("/api/booking", bookingRoutes);

const rideHistoryRoutes = require("./routes/rideHistory");
app.use("/api/ride-history", rideHistoryRoutes);

const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);

// ---------- Test routes ----------
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// ---------- Start server (except in tests) ----------
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 5001; // 👈 IMPORTANT for Railway
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

module.exports = app;
