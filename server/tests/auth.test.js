/* eslint-disable */

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

describe("Guest User Auth API", () => {
  /**
   * IMPORTANT:
   * - server.js already calls mongoose.connect(...)
   * - so we DO NOT call mongoose.connect() here
   *   (otherwise we get the "openUri on active connection" error)
   */

  // Clean the users collection before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // After all tests, close the existing connection
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // ----------------------------
  // SIGNUP TESTS
  // ----------------------------
  test("User signup succeeds with @pfw.edu email", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "latika@pfw.edu",
        password: "mypassword123",
      });

    expect(res.status).toBe(201);
    // match your backend message
    expect(res.body.message).toBe("Student account created successfully");
    expect(res.body.userId).toBeDefined();
  });

  test("Signup should reject non-pfw.edu email", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "latika@gmail.com",
        password: "mypassword123",
      });

    expect(res.status).toBe(400);
    // match your backend error
    expect(res.body.error).toBe("Use @pfw.edu or @purdue.edu email");
  });

  test("Signup should reject short password", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "latika@pfw.edu",
        password: "short",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Password must be 8+ characters");
  });

  test("Signup should reject duplicate email", async () => {
    await User.create({
      name: "latika",
      email: "latika@pfw.edu",
      password: "hashedpassword",
      role: "user",
    });

    const res = await request(app)
      .post("/api/auth/signup")
      .send({
        email: "latika@pfw.edu",
        password: "mypassword123",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email already registered");
  });

  // ----------------------------
  // LOGIN TESTS
  // ----------------------------
  test("Login succeeds with correct credentials", async () => {
    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash("mypassword123", 10);

    await User.create({
      name: "latika",
      email: "latika@pfw.edu",
      password: hashed,
      role: "user",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "latika@pfw.edu",
        password: "mypassword123",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
    expect(res.body.user.email).toBe("latika@pfw.edu");
  });

  test("Login fails when email does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "unknown@pfw.edu",
        password: "password123",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });

  test("Login fails with wrong password", async () => {
    const bcrypt = require("bcryptjs");
    const hashed = await bcrypt.hash("correctpassword", 10);

    await User.create({
      name: "latika",
      email: "latika@pfw.edu",
      password: hashed,
      role: "user",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "latika@pfw.edu",
        password: "wrongpassword",
      });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid email or password");
  });

  // ----------------------------
  // STUDENT LOGIN TESTS
  // ----------------------------
  describe("Student Login Tests", () => {
    const bcrypt = require("bcryptjs");
    const Student = require("../models/Student");

    beforeEach(async () => {
      await Student.deleteMany({});
    });

    test("Student login succeeds with valid credentials and returns student profile", async () => {
      const hashed = await bcrypt.hash("student123", 10);

      // Create student record
      await Student.create({
        name: "John Doe",
        email: "johndoe@pfw.edu",
        studentId: "johndoe",
        phone: "123-456-7890",
        major: "Computer Science",
      });

      // Create user record with role=student
      await User.create({
        name: "John Doe",
        email: "johndoe@pfw.edu",
        password: hashed,
        role: "student",
        studentId: "johndoe",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "johndoe@pfw.edu",
          password: "student123",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe("johndoe@pfw.edu");
      expect(res.body.user.role).toBe("student");
      expect(res.body.student).toBeDefined();
      expect(res.body.student.studentId).toBe("johndoe");
      expect(res.body.student.major).toBe("Computer Science");
    });

    test("Student login updates lastLoginAt and loginCount", async () => {
      const hashed = await bcrypt.hash("student123", 10);

      await Student.create({
        name: "Jane Smith",
        email: "janesmith@pfw.edu",
        studentId: "janesmith",
      });

      await User.create({
        name: "Jane Smith",
        email: "janesmith@pfw.edu",
        password: hashed,
        role: "student",
        studentId: "janesmith",
        loginCount: 0,
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "janesmith@pfw.edu",
          password: "student123",
        });

      expect(res.status).toBe(200);
      expect(res.body.user.lastLoginAt).toBeDefined();
      expect(res.body.user.loginCount).toBe(1);

      // Login again
      const res2 = await request(app)
        .post("/api/auth/login")
        .send({
          email: "janesmith@pfw.edu",
          password: "student123",
        });

      expect(res2.status).toBe(200);
      expect(res2.body.user.loginCount).toBe(2);
    });

    test("Student login with case-insensitive email", async () => {
      const hashed = await bcrypt.hash("student123", 10);

      await Student.create({
        name: "Test Student",
        email: "teststudent@pfw.edu",
        studentId: "teststudent",
      });

      await User.create({
        name: "Test Student",
        email: "teststudent@pfw.edu",
        password: hashed,
        role: "student",
        studentId: "teststudent",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "TestStudent@PFW.EDU",
          password: "student123",
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.user.email).toBe("teststudent@pfw.edu");
    });

    test("Student login fails with incorrect password", async () => {
      const hashed = await bcrypt.hash("correctpassword", 10);

      await Student.create({
        name: "Failed Student",
        email: "failedstudent@pfw.edu",
        studentId: "failedstudent",
      });

      await User.create({
        name: "Failed Student",
        email: "failedstudent@pfw.edu",
        password: hashed,
        role: "student",
        studentId: "failedstudent",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "failedstudent@pfw.edu",
          password: "wrongpassword",
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid email or password");
    });

    test("Student login fails with missing credentials", async () => {
      const res1 = await request(app)
        .post("/api/auth/login")
        .send({
          email: "student@pfw.edu",
        });

      expect(res1.status).toBe(400);
      expect(res1.body.error).toBe("Email and password required");

      const res2 = await request(app)
        .post("/api/auth/login")
        .send({
          password: "password123",
        });

      expect(res2.status).toBe(400);
      expect(res2.body.error).toBe("Email and password required");
    });

    test("Student login fails for non-existent student", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@pfw.edu",
          password: "password123",
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe("Invalid email or password");
    });

    test("Student login returns student profile only for student role", async () => {
      const hashed = await bcrypt.hash("adminpass", 10);

      // Create a non-student user
      await User.create({
        name: "Admin User",
        email: "admin@pfw.edu",
        password: hashed,
        role: "admin",
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "admin@pfw.edu",
          password: "adminpass",
        });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe("admin");
      expect(res.body.student).toBeNull();
    });
  });

  // ----------------------------
  // FORGOT PASSWORD
  // ----------------------------
  test("Forgot-password returns generic message always", async () => {
    const res = await request(app)
      .post("/api/auth/forgot-password")
      .send({
        email: "noone@pfw.edu",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toContain("reset link has been created");
  });

  // ----------------------------
  // RESET PASSWORD
  // ----------------------------
  test("Reset password should reject invalid token", async () => {
    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({
        token: "fake-token",
        newPassword: "newpassword123",
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid or expired reset token.");
  });
});
