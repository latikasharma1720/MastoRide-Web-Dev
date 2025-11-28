/* eslint-disable no-undef */

describe("Home Page", () => {
  it("loads the home page and shows navbar links", () => {
    cy.visit("/");

    cy.contains("Home").should("exist");
    cy.contains("About").should("exist");
    cy.contains("Services").should("exist");
    cy.contains("Pricing").should("exist");
    cy.contains("Contact us").should("exist");

    // Buttons on the right
    cy.contains("Log in").should("exist");
    cy.contains("Sign up").should("exist");
    cy.contains("Log in as Admin").should("exist");
  });
});
