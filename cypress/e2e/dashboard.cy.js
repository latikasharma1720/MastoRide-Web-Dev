/* eslint-disable no-undef */

describe("Navigation from Home to Login", () => {
  it("goes to login page when clicking Log in", () => {
    cy.visit("/");

    cy.contains("Log in").click();

    cy.url().should("include", "/login");
    cy.contains("Log in").should("exist");
  });
});
