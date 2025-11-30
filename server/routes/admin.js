const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Student = require("../models/Student");
const User = require("../models/User");

/**
 * GET /api/admin/bookings
 * Get all bookings for admin dashboard
 */
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(100);
    res.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/**
 * GET /api/admin/students
 * Get all students for admin dashboard
 */
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get("/stats", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const totalStudents = await Student.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    
    res.json({
      totalBookings,
      totalStudents,
      totalUsers,
      pendingBookings
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

module.exports = router;
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
