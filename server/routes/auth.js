const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

// ============================================
// 📝 SIGN UP (Create New User)
// ============================================
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate PFW email
    if (!email.endsWith("@pfw.edu")) {
      return res.status(400).json({ error: "Use your @pfw.edu email address" });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in ga_users collection
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user"
    });

    res.status(201).json({ 
      message: "Account created successfully",
      userId: newUser._id 
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error during signup" });
  }
});

// ============================================
// 🔐 LOGIN (Returning Users)
// ============================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// ============================================
// 🔑 FORGOT PASSWORD (Request Reset)
// ============================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success message (security best practice)
    // Don't reveal if email exists or not
    if (!user) {
      return res.json({ 
        message: `If an account exists for ${email}, a reset link was sent.` 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token to user (expires in 1 hour)
    user.resetToken = hashedToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // TODO: In production, send email with reset link
    // For now, we'll just log it (development only)
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    console.log("\n🔐 PASSWORD RESET LINK:");
    console.log(resetUrl);
    console.log("\n");

    res.json({ 
      message: `If an account exists for ${email}, a reset link was sent.`,
      // ⚠️ DEVELOPMENT ONLY - Remove in production
      resetToken: resetToken,
      resetUrl: resetUrl
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================
// ✅ RESET PASSWORD (Complete Reset)
// ============================================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    // Hash the token from URL to match database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() } // Token not expired
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================================
// 👤 GET USER PROFILE (Protected Route)
// ============================================
router.get("/profile", async (req, res) => {
  try {
    // Extract token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

module.exports = router;