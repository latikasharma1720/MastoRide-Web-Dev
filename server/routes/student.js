const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

/**
 * POST /api/student
 * Create a new student
 */
router.post("/", async (req, res) => {
  try {
<<<<<<< HEAD
    const { name, email, studentId, phone, major } = req.body;
=======
    const { name, email, studentId, phone, major, status } = req.body;
>>>>>>> origin/main

    if (!name || !email || !studentId) {
      return res.status(400).json({ error: "name, email and studentId required" });
    }

    const existing = await Student.findOne({ $or: [{ email: email.toLowerCase() }, { studentId }] });
    if (existing) {
      return res.status(400).json({ error: "Student with that email or studentId already exists" });
    }

<<<<<<< HEAD
    const student = await Student.create({
=======
    const studentData = {
>>>>>>> origin/main
      name,
      email: email.toLowerCase(),
      studentId,
      phone,
      major,
<<<<<<< HEAD
    });
=======
    };

    // Only add status if provided
    if (status) {
      studentData.status = status;
    }

    const student = await Student.create(studentData);
>>>>>>> origin/main

    return res.status(201).json({ message: "Student created", student });
  } catch (err) {
    console.error("[student:create]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/student
 * Get all students
 */
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ enrolledAt: -1 });
    return res.json({ students });
  } catch (err) {
    console.error("[student:list]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/student/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    return res.json({ student });
  } catch (err) {
    console.error("[student:get]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * PUT /api/student/:id
 */
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();

    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!student) return res.status(404).json({ error: "Student not found" });
    return res.json({ message: "Student updated", student });
  } catch (err) {
    console.error("[student:update]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * DELETE /api/student/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    return res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("[student:delete]", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
