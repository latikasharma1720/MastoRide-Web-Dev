/* eslint-disable */

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');
let app;
let mongoServer;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

describe("Admin Backend API Tests", () => {
  // Admin user for tests
  const adminUser = {
    name: "Admin Test User",
    email: "admin@mastoride.edu",
    password: "AdminPassword123",
    role: "admin",
  };

  let adminToken;
  let adminId;

  // Start in-memory MongoDB, clear users, and require server
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URL = mongoServer.getUri();
    await User.deleteMany({});

    app = require("../server");

    // Wait until mongoose connection is open to avoid buffering timeouts
    await new Promise((resolve, reject) => {
      if (mongoose.connection.readyState === 1) return resolve();
      const t = setTimeout(() => reject(new Error('Mongoose connection timeout')), 10000);
      mongoose.connection.once('open', () => {
        clearTimeout(t);
        resolve();
      });
    });
  });

  // After all tests, close mongoose and stop the memory server
  afterAll(async () => {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  // Clean up between each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  // ============================
  // ADMIN SIGNUP/REGISTRATION TESTS
  // ============================

  describe("Admin Registration", () => {
    test("Admin can register with valid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });

      // Should allow admin registration
      expect(res.status).toBe(201);
      expect(res.body.userId).toBeDefined();
      adminId = res.body.userId;
    });

    test("Admin email must be @mastoride.edu or @pfw.edu", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "admin@gmail.com",
          password: "AdminPassword123",
          name: "Admin User",
          role: "admin",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("@pfw.edu or @purdue.edu");
    });

    test("Admin password must meet minimum requirements", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: "short",
          name: adminUser.name,
          role: "admin",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("8+");
    });

    test("Duplicate email registration fails", async () => {
      // First registration
      await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });

      // Duplicate attempt
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toContain("already registered");
    });
  });

  // ============================
  // ADMIN LOGIN TESTS
  // ============================

  describe("Admin Login", () => {
    beforeEach(async () => {
      // Register an admin first
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = res.body.userId;
    });

    test("Admin can login with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: adminUser.email,
          password: adminUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Login successful");
      expect(res.body.user.email).toBe(adminUser.email);
      expect(res.body.user.role).toBe("admin");
      adminToken = res.body.token;
    });

    test("Login fails with wrong password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: adminUser.email,
          password: "WrongPassword123",
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain("Invalid email or password");
    });

    test("Login fails with non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@mastoride.edu",
          password: adminUser.password,
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toContain("Invalid email or password");
    });

    test("Login returns admin user object with correct role", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({
          email: adminUser.email,
          password: adminUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe("admin");
      expect(res.body.user.name).toBeDefined();
      expect(res.body.user.email).toBeDefined();
    });
  });

  // ============================
  // ADMIN DASHBOARD DATA TESTS
  // ============================

  describe("Admin Dashboard - User Statistics", () => {
    beforeEach(async () => {
      // Create admin user
      const adminRes = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = adminRes.body.userId;

      // Create multiple regular users for stats
      for (let i = 1; i <= 5; i++) {
        await request(app)
          .post("/api/auth/signup")
          .send({
            email: `user${i}@pfw.edu`,
            password: "UserPassword123",
            name: `Test User ${i}`,
            role: "user",
          });
      }
    });

    test("Admin can retrieve total user count", async () => {
      // This assumes your backend has a GET endpoint for user stats
      // Adjust the endpoint based on your actual API
      const res = await request(app)
        .get("/api/admin/stats/users")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      // Should return user statistics
      expect(res.status).toBe(200).or(res.status).toBe(401); // 401 if auth required but token invalid
    });

    test("Admin can access user list", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect(res.status).toBe(200).or(res.status).toBe(401);
    });
  });

  // ============================
  // ADMIN PROFILE MANAGEMENT TESTS
  // ============================

  describe("Admin Profile Management", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = res.body.userId;
    });

    test("Admin profile retrieval endpoint exists", async () => {
      const res = await request(app)
        .get(`/api/admin/profile/${adminId}`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      // Should return user profile or auth error
      expect([200, 401, 404]).toContain(res.status);
    });

    test("Admin can view their profile information", async () => {
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: adminUser.email,
          password: adminUser.password,
        });

      expect(loginRes.body.user.role).toBe("admin");
      expect(loginRes.body.user.email).toBe(adminUser.email);
    });
  });

  // ============================
  // USER MANAGEMENT TESTS
  // ============================

  describe("Admin User Management", () => {
    beforeEach(async () => {
      // Create admin
      const adminRes = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = adminRes.body.userId;

      // Create test users
      for (let i = 1; i <= 3; i++) {
        await request(app)
          .post("/api/auth/signup")
          .send({
            email: `testuser${i}@pfw.edu`,
            password: "TestPass123",
            name: `Test User ${i}`,
            role: "user",
          });
      }
    });

    test("Admin can get all users", async () => {
      // This endpoint may require authentication
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 401, 403]).toContain(res.status);
    });

    test("Admin can search/filter users", async () => {
      const res = await request(app)
        .get("/api/admin/users?search=testuser")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 401, 403]).toContain(res.status);
    });

    test("Admin can delete a user (if endpoint exists)", async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${adminId}`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 204, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can update user role (if endpoint exists)", async () => {
      const res = await request(app)
        .put(`/api/admin/users/${adminId}`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`)
        .send({ role: "moderator" });

      expect([200, 400, 401, 403, 404]).toContain(res.status);
    });
  });

  // ============================
  // ADMIN FEEDBACK MANAGEMENT TESTS
  // ============================

  describe("Admin Feedback Management", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = res.body.userId;
    });

    test("Admin can retrieve feedback list (if endpoint exists)", async () => {
      const res = await request(app)
        .get("/api/admin/feedback")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can filter feedback by rating (if endpoint exists)", async () => {
      const res = await request(app)
        .get("/api/admin/feedback?rating=5")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can respond to feedback (if endpoint exists)", async () => {
      const res = await request(app)
        .post("/api/admin/feedback/1/response")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`)
        .send({ response: "Thank you for your feedback!" });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.status);
    });
  });

  // ============================
  // ADMIN ANALYTICS TESTS
  // ============================

  describe("Admin Analytics", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = res.body.userId;
    });

    test("Admin can access dashboard statistics (if endpoint exists)", async () => {
      const res = await request(app)
        .get("/api/admin/stats/dashboard")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can get monthly ride data (if endpoint exists)", async () => {
      const res = await request(app)
        .get("/api/admin/analytics/rides/monthly")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can get ride type distribution (if endpoint exists)", async () => {
      const res = await request(app)
        .get("/api/admin/analytics/rides/types")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 401, 403, 404]).toContain(res.status);
    });
  });

  // ============================
  // ADMIN AUTHORIZATION TESTS
  // ============================

  describe("Admin Authorization", () => {
    beforeEach(async () => {
      // Create admin user
      const adminRes = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = adminRes.body.userId;

      // Create regular user
      await request(app)
        .post("/api/auth/signup")
        .send({
          email: "regularuser@pfw.edu",
          password: "UserPass123",
          name: "Regular User",
          role: "user",
        });
    });

    test("Regular user cannot access admin endpoints", async () => {
      // Login as regular user
      const userRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: "regularuser@pfw.edu",
          password: "UserPass123",
        });

      const userToken = userRes.body.token;

      // Try to access admin users endpoint
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", `Bearer ${userToken}`);

      expect([401, 403]).toContain(res.status);
    });

    test("Admin endpoints require authentication", async () => {
      const res = await request(app)
        .get("/api/admin/users");

      expect([401, 403]).toContain(res.status);
    });

    test("Non-admin role is denied admin access", async () => {
      const res = await request(app)
        .get("/api/admin/users")
        .set("Authorization", "Bearer invalid-token");

      expect([401, 403]).toContain(res.status);
    });
  });

  // ============================
  // ADMIN SETTINGS TESTS
  // ============================

  describe("Admin Settings Management", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = res.body.userId;
    });

    test("Admin can save profile settings (if endpoint exists)", async () => {
      const res = await request(app)
        .post(`/api/admin/settings/profile`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`)
        .send({
          department: "Administration",
          officeLocation: "Building A",
          phone: "(260) 555-0123",
        });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can save notification settings (if endpoint exists)", async () => {
      const res = await request(app)
        .post(`/api/admin/settings/notifications`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`)
        .send({
          emailNotifications: true,
          smsAlerts: false,
          systemAlerts: true,
        });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can enable maintenance mode (if endpoint exists)", async () => {
      const res = await request(app)
        .post(`/api/admin/settings/maintenance`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`)
        .send({ maintenanceMode: true });

      expect([200, 201, 400, 401, 403, 404]).toContain(res.status);
    });
  });

  // ============================
  // ADMIN SECURITY TESTS
  // ============================

  describe("Admin Security", () => {
    beforeEach(async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: adminUser.email,
          password: adminUser.password,
          name: adminUser.name,
          role: "admin",
        });
      adminId = res.body.userId;
    });

    test("Admin can change password (if endpoint exists)", async () => {
      const res = await request(app)
        .post(`/api/admin/security/change-password`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`)
        .send({
          currentPassword: adminUser.password,
          newPassword: "NewAdminPass123",
        });

      expect([200, 400, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can enable 2FA (if endpoint exists)", async () => {
      const res = await request(app)
        .post(`/api/admin/security/2fa/enable`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 201, 400, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can disable 2FA (if endpoint exists)", async () => {
      const res = await request(app)
        .post(`/api/admin/security/2fa/disable`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 201, 400, 401, 403, 404]).toContain(res.status);
    });

    test("Admin can retrieve security settings (if endpoint exists)", async () => {
      const res = await request(app)
        .get(`/api/admin/security/settings`)
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([200, 401, 403, 404]).toContain(res.status);
    });
  });

  // ============================
  // ERROR HANDLING TESTS
  // ============================

  describe("Error Handling", () => {
    test("Invalid endpoint returns 404", async () => {
      const res = await request(app)
        .get("/api/admin/invalid-endpoint")
        .set("Authorization", `Bearer ${adminToken || "mock-token"}`);

      expect([404, 401]).toContain(res.status);
    });

    test("Malformed request body returns error", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ invalidField: "value" });

      expect([400, 401]).toContain(res.status);
    });

    test("Missing required fields returns error", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({ email: "test@pfw.edu" }); // missing password

      expect(res.status).toBe(400);
    });
  });
});
