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
