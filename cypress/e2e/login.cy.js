/* eslint-disable no-undef */

describe("Login Page", () => {
  it("loads the login page with form and button", () => {
    cy.visit("/login");

    // Just check that the form and Log in button exist
    cy.get("form").should("exist");
    cy.contains("Log in").should("exist");
  });
});
