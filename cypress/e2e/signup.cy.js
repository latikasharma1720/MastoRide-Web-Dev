/* eslint-disable no-undef */

describe("Signup Page", () => {
  it("loads the signup page with form and button", () => {
    cy.visit("/signup");

    // Just check form + Sign up button are visible
    cy.get("form").should("exist");
    cy.contains("Sign up").should("exist");
  });
});
