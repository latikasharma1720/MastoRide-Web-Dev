/* eslint-disable no-undef */

describe("Book Ride access (unauthenticated)", () => {
  it("redirects unauthenticated users to login when visiting /user/dashboard", () => {
    cy.visit("/user/dashboard");

    // If the route is protected, you should see login screen instead
    cy.url().should("include", "/login");
  });
});
