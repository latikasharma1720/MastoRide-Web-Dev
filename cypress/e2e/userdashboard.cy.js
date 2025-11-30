/// <reference types="cypress" />
/* eslint-env cypress */

// This must match src/utils/session.js
const STORAGE_KEY = "mastoride_user";

// Fake test user object – only needs email + role for the guard
const TEST_USER = {
  email: "user72@pfw.edu",
  name: "user72",
  role: "user",
};

function loginBySession() {
  // First load any page so Cypress has a window object
  cy.visit("/");

  // Put the fake user in sessionStorage (same key used by getUser())
  cy.window().then((win) => {
    win.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(TEST_USER));
  });

  // Now go to the dashboard – guard should see the user and allow it
  cy.visit("/user/dashboard");
  cy.url().should("include", "/user/dashboard");
}

describe("User Dashboard – Profile, Book Ride, Rewards, History", () => {
  // Make sure we are “logged in” and on /user/dashboard before each test
  beforeEach(() => {
    loginBySession();
  });

  it("shows the Account profile view with main fields", () => {
    // We land on the Profile tab by default – no need to click it

    // Inner tabs
    cy.contains("Account").should("exist");
    cy.contains("Settings").should("exist");
    cy.contains("Support").should("exist");

    // Some key fields in the Account form
    cy.contains("Personal Info").should("exist");
    cy.get('input[name="name"]').should("exist");
    cy.get('input[name="studentId"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="phone"]').should("exist");

    // Actions
    cy.contains("button", "Edit").should("exist");
  });

  it("shows Book a Ride section with form and map", () => {
    // Sidebar -> Book Ride
    cy.contains("Book Ride").click();

    cy.contains("Book a Ride").should("exist");

    // Pickup & Dropoff fields (match placeholder fragments from JSX)
    cy.get('input[placeholder*="Walb"]').should("exist");
    cy.get('input[placeholder*="Coliseum"]').should("exist");

    // Date, Time, Passengers, Vehicle Type
    cy.get('input[type="date"]').should("exist");
    cy.get('input[type="time"]').should("exist");
    cy.contains(/Passengers/i).should("exist");
    cy.contains(/Vehicle Type/i).should("exist");

    // Estimate fare button
    cy.contains("button", "Estimate Fare").should("exist");

    // Proceed to Payment button
    cy.contains("button", "Proceed to Payment").should("exist");
  });

  it("shows Rewards & Badges view with points and badges", () => {
    // Sidebar -> Rewards
    cy.contains("Rewards").click();

    cy.contains("Rewards & Badges").should("exist");
    cy.contains("250 Points").should("exist");
    cy.contains("Redeem Points").should("exist");

    // Available / Used badges sections
    cy.contains("Available Badges").should("exist");
    cy.contains("Used Badges").should("exist");

    // At least one badge card text that matches your JSX defaults
    cy.contains("10 Rides Completed").should("exist");
  });

  it("shows Ride History view with filters and ride cards", () => {
    // Sidebar -> History
    cy.contains("History").click();

    // Filter bar
    cy.contains(/Filter/i).should("exist");
    cy.contains(/Status/i).should("exist");
    cy.contains(/Sort by/i).should("exist");

    // Summary stats
    cy.contains("TOTAL RIDES").should("exist");
    cy.contains("TOTAL SPENT").should("exist");

    // One or more ride cards – labels match JSX
    cy.contains(/PICKUP/i).should("exist");
    cy.contains(/DROP-OFF/i).should("exist");
    cy.contains(/TOTAL FARE/i).should("exist");
  });

  it("shows sidebar navigation and top-right controls", () => {
    // Sidebar items
    cy.contains("Profile").should("exist");
    cy.contains("Book Ride").should("exist");
    cy.contains("Payment").should("exist");
    cy.contains("Rewards").should("exist");
    cy.contains("History").should("exist");

    // Top-right navbar controls for logged-in user
    cy.contains("My Profile").should("exist");
    cy.contains("Sign out").should("exist");
  });
});
