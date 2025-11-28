/* eslint-disable no-undef */

describe("Admin Login Page", () => {
  it("loads the admin login page with form and controls", () => {
    cy.visit("/admin/login");

    // Heading
    cy.contains("Login to connect to the dashboard").should("exist");

    // Form + fields
    cy.get("form").should("exist");
    cy.contains("Email").should("exist");
    cy.contains("Password").should("exist");

    // Remember me checkbox
    cy.contains("Remember me").should("exist");

    // Continue button
    cy.contains("Continue").should("exist");
  });
});
