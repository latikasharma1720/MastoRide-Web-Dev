const express = require("express");
const User = require("../models/User");

const router = express.Router();


/**
 * GET /api/admin/users
 * Fetch all users (admin only)
 */
router.get("/users", async (req, res) => {
  try {
    console.log("=== FETCH USERS REQUEST RECEIVED ===");

    // Fetch all users, sorted by creation date (newest first)
    const users = await User.find({})
      .select("-password -resetToken -resetTokenExpiry") // Exclude sensitive fields
      .sort({ createdAt: -1 })
      .limit(50); // Limit to 50 most recent users

    console.log(`Found ${users.length} users`);

    // Format users for frontend
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      joined: new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      status: user.lastLoginAt ? 'Active' : 'Inactive',
      role: user.role,
      studentId: user.studentId,
      phone: user.phone,
      loginCount: user.loginCount || 0,
      lastLoginAt: user.lastLoginAt
    }));

    return res.json({
      success: true,
      users: formattedUsers,
      count: formattedUsers.length
    });
  } catch (err) {
    console.error("=== FETCH USERS ERROR ===");
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/admin/users/:userId
 * Delete a user by ID (admin only)
 */
router.delete("/users/:userId", async (req, res) => {
  try {
    console.log("=== DELETE USER REQUEST RECEIVED ===");
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await User.findByIdAndDelete(userId);

    console.log(`User deleted: ${user.email}`);

    return res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    console.error("=== DELETE USER ERROR ===");
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;