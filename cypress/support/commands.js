// cypress/support/commands.js

Cypress.Commands.add("loginAsFrontendUser", () => {
  // Fake user object - doesn't need to be real, just look like your app's user
  const fakeUser = {
    email: "user71@pfw.edu",
    name: "user71",
    role: "user",
  };

  // 👉 REPLACE this with the exact key from:
  //    Object.keys(localStorage)  OR  Object.keys(sessionStorage)
  const USER_KEY = "mr_user";          // e.g. "mr_user" or "mastoride_user"

  // 👉 If your key came from Object.keys(localStorage) use "localStorage"
  //    If it came from Object.keys(sessionStorage) use "sessionStorage"
  const STORAGE_TYPE = "localStorage"; // or "sessionStorage"

  // Must be on your app's origin first
  cy.visit("/");

  cy.window().then((win) => {
    win[STORAGE_TYPE].setItem(USER_KEY, JSON.stringify(fakeUser));
  });
});
