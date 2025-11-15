const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

/**
 * POST /api/auth/signup
 * (same behaviour as before, just using the updated model)
 */
router.post("/signup", async (req, res) => {
  try {
    console.log("=== SIGNUP REQUEST RECEIVED ===");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ error: "Email and password required" });
    }

    if (!email.endsWith("@pfw.edu")) {
      console.log("Invalid email domain");
      return res.status(400).json({ error: "Use @pfw.edu email" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("Email already exists");
      return res.status(400).json({ error: "Email already registered" });
    }

    if (password.length < 8) {
      console.log("Password too short");
      return res.status(400).json({ error: "Password must be 8+ characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const name = email.split("@")[0];

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    console.log("=== USER CREATED SUCCESSFULLY ===");
    console.log("User ID:", newUser._id);

    return res.status(201).json({
      message: "Account created successfully",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("=== SIGNUP ERROR ===");
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * ✅ NEW: POST /api/auth/login
 * Handles RETURNING users
 */
router.post("/login", async (req, res) => {
  try {
    console.log("=== LOGIN REQUEST RECEIVED ===");
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res
        .status(400)
        .json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 🔁 UPDATE returning-user fields
    user.lastLoginAt = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    user.loginHistory.push({
      loggedInAt: new Date(),
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await user.save();

    console.log("=== LOGIN SUCCESS ===", {
      email: user.email,
      loginCount: user.loginCount,
    });

    // Send minimal info for frontend
    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLoginAt: user.lastLoginAt,
        loginCount: user.loginCount,
      },
    });
  } catch (err) {
    console.error("=== LOGIN ERROR ===");
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
