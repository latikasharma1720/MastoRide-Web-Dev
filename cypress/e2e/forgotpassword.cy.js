/* eslint-disable no-undef */

describe("Forgot / Reset Password Page", () => {
  it("loads the reset password page correctly", () => {
    cy.visit("/forgot-password");

    // Page heading
    cy.contains("Reset Password").should("exist");

    // Instruction text
    cy.contains("Enter your PFW email").should("exist");

    // Email field
    cy.get('input[type="email"], input[placeholder*="pfw"]').should("exist");

    // Button
    cy.contains("Send reset link").should("exist");

    // Back to login link
    cy.contains("Back to login").should("exist");
  });
});
