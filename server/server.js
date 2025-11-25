// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow frontend on localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// ✅ Parse JSON request bodies
app.use(express.json());

console.log("Starting server...");

// ✅ Connect to MongoDB using MONGO_URL from .env
// If MONGO_URL isn't set, fall back to a local MongoDB instance.
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/mastoride";
if (!process.env.MONGO_URL) {
  console.warn("Warning: MONGO_URL not set — using fallback:", mongoUrl);
}

mongoose
  .connect(mongoUrl)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Auth routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// ✅ Student routes
const studentRoutes = require("./routes/student");
app.use("/api/student", studentRoutes);

// ✅ Booking routes
const bookingRoutes = require("./routes/booking");
app.use("/api/booking", bookingRoutes);

// ✅ Ride History routes
const rideHistoryRoutes = require("./routes/rideHistory");
app.use("/api/ride-history", rideHistoryRoutes);

// ✅ Simple test routes
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const PORT = 5001;   // 👈 hard-coded, ignore env
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

