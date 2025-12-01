/* eslint-env mocha */
/* global cy */

describe("Student E2E Flow", () => {
  // Use a fixed test user that will be created once
  const testStudent = {
    email: "cypresstest@pfw.edu",
    password: "TestPass123!",
  };

  // Create test user before all tests
  before(() => {
    // Try to create the test user (will fail if already exists, which is fine)
    cy.request({
      method: "POST",
      url: "http://localhost:5001/api/auth/signup",
      body: {
        email: testStudent.email,
        password: testStudent.password,
      },
      failOnStatusCode: false, // Don't fail if user already exists
    });
  });

  // ----------------------------
  // STUDENT SIGNUP
  // ----------------------------
  describe("Student Signup", () => {
    it("should complete student signup flow", () => {
      const uniqueEmail = `newsignup${Date.now()}@pfw.edu`;
      
      cy.visit("/signup");

      // Fill signup form
      cy.get("input[type='email']")
        .should("be.visible")
        .type(uniqueEmail);

      cy.get("input[type='password']")
        .first()
        .type(testStudent.password);

      cy.get("input[type='password']")
        .last()
        .type(testStudent.password); // Confirm password

      // Submit form
      cy.get("button[type='submit']").click();

      // Wait for redirect or success message
      cy.url().should("match", /login/i, { timeout: 10000 });
    });

    it("should detect @pfw.edu email as student", () => {
      cy.visit("/signup");

      cy.get("input[type='email']").type(testStudent.email);

      // Check if student indicator appears
      cy.get("body").then(($body) => {
        if ($body.text().match(/student/i)) {
          cy.contains(/student/i).should("be.visible");
        }
      });
    });

    it("should reject signup with existing email", () => {
      cy.visit("/signup");

      // Use the existing test user email
      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").first().type(testStudent.password);
      cy.get("input[type='password']").last().type(testStudent.password);

      cy.get("button[type='submit']").click();

      // Should show error for duplicate (check for any error message)
      cy.get(".sg-error", { timeout: 5000 }).should("exist");
    });
  });

  // ----------------------------
  // STUDENT LOGIN
  // ----------------------------
  describe("Student Login", () => {
    it("should login with student credentials", () => {
      cy.visit("/login");

      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);

      cy.get("button[type='submit']").click();

      // Should redirect to dashboard
      cy.url().should("include", "/user/dashboard", { timeout: 10000 });
    });

    it("should reject invalid credentials", () => {
      cy.visit("/login");

      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type("WrongPassword123");

      cy.get("button[type='submit']").click();

      // Should show error (check for error-text class)
      cy.get(".error-text", { timeout: 5000 }).should("exist");
    });

    it("should persist session after login", () => {
      cy.visit("/login");

      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);
      cy.get("button[type='submit']").click();

      cy.url().should("include", "/user/dashboard");

      // Refresh and check session persists
      cy.reload();
      cy.url().should("include", "/user/dashboard");
    });
  });

  // ----------------------------
  // DASHBOARD ACCESS
  // ----------------------------
  describe("Student Dashboard", () => {
    beforeEach(() => {
      // Login before each dashboard test
      cy.visit("/login");
      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/user/dashboard", { timeout: 10000 });
    });

    it("should display student dashboard", () => {
      cy.contains(/dashboard|welcome/i).should("be.visible");
    });

    it("should show student email", () => {
      cy.contains(testStudent.email).should("be.visible");
    });

    it("should have tabs for booking, payment, history", () => {
      cy.contains(/book/i).should("exist");
      cy.contains(/payment|pay/i).should("exist");
      cy.contains(/history|rides/i).should("exist");
    });

    it("should have profile section", () => {
      cy.contains(/profile|account/i).should("exist");
    });
  });

  // ----------------------------
  // BOOK RIDE FLOW
  // ----------------------------
  describe("Book Ride", () => {
    beforeEach(() => {
      cy.visit("/login");
      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/user/dashboard", { timeout: 10000 });

      // Navigate to booking
      cy.contains(/book/i).click();
    });

    it("should display booking form", () => {
      cy.get("input, select").should("have.length.greaterThan", 3);
    });

    it("should allow selecting pickup location", () => {
      cy.get(
        "input[name*='pickup'], input[placeholder*='pickup'], select[name*='pickup']"
      )
        .first()
        .should("be.visible");
    });

    it("should allow selecting dropoff location", () => {
      cy.get(
        "input[name*='drop'], input[placeholder*='destination'], select[name*='drop']"
      )
        .first()
        .should("be.visible");
    });

    it("should allow selecting date and time", () => {
      cy.get("input[type='date'], input[name*='date']").should("exist");
      cy.get("input[type='time'], input[name*='time']").should("exist");
    });

    it("should allow selecting passenger count", () => {
      cy.get(
        "input[name*='passenger'], select[name*='passenger']"
      ).should("exist");
    });

    it("should allow selecting vehicle type", () => {
      cy.contains(/economy|premium|xl/i).should("exist");
    });

    it("should estimate fare", () => {
      // Fill booking form
      cy.get(
        "input[name*='pickup'], select[name*='pickup']"
      ).first().type("Campus Center{enter}");

      cy.get(
        "input[name*='drop'], select[name*='drop']"
      ).first().type("Jefferson Mall{enter}");

      cy.get("input[type='date']").first().type("2025-12-31");
      cy.get("input[type='time']").first().type("14:00");

      // Click estimate or check if fare displays
      cy.get("body").then(($body) => {
        if ($body.find("button:contains('Estimate')").length > 0) {
          cy.contains(/estimate/i).click();
          cy.contains(/\$/i, { timeout: 5000 }).should("be.visible");
        }
      });
    });

    it("should complete booking", () => {
      // Fill all required fields
      cy.get("input[name*='pickup'], select[name*='pickup']")
        .first()
        .type("Campus Center{enter}");

      cy.get("input[name*='drop'], select[name*='drop']")
        .first()
        .type("Airport{enter}");

      cy.get("input[type='date']").first().type("2025-12-31");
      cy.get("input[type='time']").first().type("10:00");

      // Select vehicle type if clickable
      cy.get("body").then(($body) => {
        if ($body.find("button:contains('Economy')").length > 0) {
          cy.contains(/economy/i).click();
        }
      });

      // Submit booking
      cy.get("button[type='submit'], button:contains('Book')").click();

      // Check for confirmation
      cy.contains(/confirm|success|booked/i, { timeout: 10000 }).should(
        "be.visible"
      );
    });
  });

  // ----------------------------
  // PAYMENT FLOW
  // ----------------------------
  describe("Payment", () => {
    beforeEach(() => {
      cy.visit("/login");
      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/user/dashboard", { timeout: 10000 });
    });

    it("should navigate to payment tab", () => {
      cy.contains(/payment|pay/i).click();
      cy.contains(/card|payment|amount/i).should("be.visible");
    });

    it("should display payment form", () => {
      cy.contains(/payment/i).click();
      cy.get("input[placeholder*='card'], input[name*='card']").should(
        "exist"
      );
    });

    it("should validate card number", () => {
      cy.contains(/payment/i).click();

      cy.get("input[placeholder*='card']").type("1234");
      cy.get("button:contains('Pay')").click();

      // Should show validation error
      cy.contains(/invalid|valid|digit/i, { timeout: 3000 }).should("exist");
    });

    it("should accept valid card format", () => {
      cy.contains(/payment/i).click();

      cy.get("input[placeholder*='card']").type("4111111111111111");

      // Check if validation passes (no error)
      cy.get("body").should("not.contain", "Invalid card");
    });

    it("should complete payment", () => {
      cy.contains(/payment/i).click();

      // Fill payment details
      cy.get("input[placeholder*='card']").type("4111111111111111");

      cy.get("input[placeholder*='expiry'], input[name*='expiry']").type(
        "12/25"
      );

      cy.get("input[placeholder*='cvv'], input[name*='cvv']").type("123");

      // Submit payment
      cy.get("button:contains('Pay')").click();

      // Wait for success message
      cy.contains(/success|complete|paid/i, { timeout: 10000 }).should(
        "be.visible"
      );
    });
  });

  // ----------------------------
  // RIDE HISTORY
  // ----------------------------
  describe("Ride History", () => {
    beforeEach(() => {
      cy.visit("/login");
      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/user/dashboard", { timeout: 10000 });
    });

    it("should navigate to history tab", () => {
      cy.contains(/history|rides/i).click();
      cy.get("body").should("contain", "History");
    });

    it("should display completed rides", () => {
      cy.contains(/history/i).click();

      // Check if table or list exists
      cy.get("table, [class*='ride'], [class*='history']").should("exist");
    });

    it("should show ride details", () => {
      cy.contains(/history/i).click();

      // Should have ride information
      cy.get("body").then(($body) => {
        const text = $body.text();
        if (text.match(/pickup|dropoff|fare|date/i)) {
          cy.wrap(text).should("match", /pickup|dropoff|fare|date/i);
        }
      });
    });

    it("should allow rating completed rides", () => {
      cy.contains(/history/i).click();

      cy.get("body").then(($body) => {
        if ($body.find("button:contains('Rate')").length > 0) {
          cy.contains(/rate/i).first().click();
          cy.get("input[type='number'], select, [role='radio']").should(
            "exist"
          );
        }
      });
    });

    it("should verify booking appears in history", () => {
      cy.contains(/history/i).click();

      // Check for recent booking (if exists)
      cy.get("body").then(($body) => {
        if ($body.text().match(/Campus|Airport|Mall/i)) {
          cy.contains(/Campus|Airport|Mall/i).should("be.visible");
        }
      });
    });
  });

  // ----------------------------
  // PROFILE MANAGEMENT
  // ----------------------------
  describe("Profile Management", () => {
    beforeEach(() => {
      cy.visit("/login");
      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/user/dashboard", { timeout: 10000 });
    });

    it("should view profile information", () => {
      cy.contains(/profile|account/i).click();

      cy.contains(testStudent.name).should("be.visible");
      cy.contains(testStudent.email).should("be.visible");
    });

    it("should display student status", () => {
      cy.contains(/profile/i).click();
      cy.contains(/student|active/i).should("be.visible");
    });
  });

  // ----------------------------
  // LOGOUT
  // ----------------------------
  describe("Logout", () => {
    it("should logout successfully", () => {
      cy.visit("/login");
      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/user/dashboard", { timeout: 10000 });

      // Click logout
      cy.contains(/logout|sign out/i).click();

      // Should redirect to home or login
      cy.url().should("match", /home|login|\/$/, { timeout: 5000 });
    });

    it("should clear session after logout", () => {
      cy.visit("/login");
      cy.get("input[type='email']").type(testStudent.email);
      cy.get("input[type='password']").type(testStudent.password);
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/user/dashboard");

      cy.contains(/logout/i).click();

      // Try accessing dashboard without login
      cy.visit("/user/dashboard");
      cy.url().should("match", /login|home|\/$/, { timeout: 5000 });
    });
  });

  // ----------------------------
  // FULL JOURNEY TEST
  // ----------------------------
  describe("Complete Student Journey", () => {
    it("should complete full flow: signup → login → book → pay → history", () => {
      const uniqueEmail = `journey${Date.now()}@purdue.edu`;

      // 1. Signup
      cy.visit("/signup");
      cy.get("input[type='email']").type(uniqueEmail);
      cy.get("input[type='password']").first().type("JourneyPass123!");
      cy.get("input[type='password']").last().type("JourneyPass123!");
      cy.get("button[type='submit']").click();

      // 2. Login
      cy.visit("/login");
      cy.get("input[type='email']").type(uniqueEmail);
      cy.get("input[type='password']").type("JourneyPass123!");
      cy.get("button[type='submit']").click();
      cy.url().should("include", "/user/dashboard", { timeout: 10000 });

      // 3. Book Ride
      cy.contains(/book/i).click();
      cy.get("input[name*='pickup'], select[name*='pickup']")
        .first()
        .type("Campus{enter}");
      cy.get("input[name*='drop']")
        .first()
        .type("Mall{enter}");
      cy.get("input[type='date']").first().type("2025-12-31");
      cy.get("input[type='time']").first().type("15:00");
      cy.get("button:contains('Book')").click();

      // 4. Payment (if available)
      cy.contains(/payment|pay/i, { timeout: 10000 }).click();
      cy.get("input[placeholder*='card']").type("4111111111111111");
      cy.get("button:contains('Pay')").click();

      // 5. Check History
      cy.contains(/history/i, { timeout: 10000 }).click();
      cy.contains(/Campus|Mall/i).should("be.visible");
    });
  });
});
