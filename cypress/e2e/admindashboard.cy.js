/* eslint-env cypress */
/* global cy */
/* eslint-disable no-undef */

/// <reference types="cypress" />

// Log in ADMIN by seeding sessionStorage (no UI form)
function loginAsAdminWithoutUI() {
  cy.visit("/admin", {
    onBeforeLoad(win) {
      // This key MUST match your session.js: "mastoride_user"
      win.sessionStorage.setItem(
        "mastoride_user",
        JSON.stringify({
          id: "admin-demo",
          name: "Administrators",
          email: "admin@mastoride.edu",
          role: "admin",
        })
      );
    },
  });

  // Protected route should allow us in
  cy.url().should("include", "/admin");
}

describe("Admin Dashboard – Feedback, Users, Analytics, Profile", () => {
  beforeEach(() => {
    loginAsAdminWithoutUI();
  });

  it("shows Feedback overview with stats and recent feedback list", () => {
    // Default tab is Feedback
    cy.contains("User Feedback").should("exist");
    cy.contains("Average Rating").should("exist");
    cy.contains("Total Feedback").should("exist");
    cy.contains("Positive Reviews").should("exist");
    cy.contains("Pending Reviews").should("exist");

    cy.contains("Recent Feedback").should("exist");
    cy.contains("Excellent Service").should("exist");
    cy.contains("Needs Improvement").should("exist");
  });

  it("shows Users management view with search, table, and selection", () => {
    // Sidebar -> Users (scope to sidebar so we don't hit top navbar)
    cy.get(".sidebar-nav").contains("Users").click();

    // Header card
    cy.contains("User Management").should("exist");

    // Search + action buttons
    cy.get('input[placeholder*="Search users"]').should("exist");
    cy.contains("button", "Export").should("exist");
    cy.contains("button", "Add User").should("exist");

    // Table + headers
    cy.get("table").should("exist");
    cy.get("thead").within(() => {
      cy.contains("Full Name").should("exist");
      cy.contains("Email").should("exist");
      cy.contains("Joined Date").should("exist");
      cy.contains("Status").should("exist");
      cy.contains("Actions").should("exist");
    });

    // At least one row of users
    cy.get("tbody tr").should("have.length.at.least", 1);

    // Select the first user row
    cy.get("tbody tr")
      .first()
      .within(() => {
        cy.get('input[type="checkbox"]').check({ force: true });
      });

    // Bulk delete button should appear
    cy.contains("Delete Selected").should("exist");
  });

  it("shows Analytics tab with both charts", () => {
    // Sidebar -> Analytics
    cy.get(".sidebar-nav").contains("Analytics").click();

    cy.contains("Monthly Ride Bookings").should("exist");
    cy.contains("Ride Type Distribution").should("exist");

    // Line + pie chart canvases (Chart.js) – allow script time to load
    cy.get("canvas", { timeout: 10000 }).should("have.length.at.least", 2);
  });

  it("shows Profile Account tab with admin fields and Edit Profile flow", () => {
    // Sidebar -> Profile (scope to sidebar!)
    cy.get(".sidebar-nav").contains("Profile").click();

    // Hero info
    cy.contains("Administrators").should("exist");
    cy.contains("admin@mastoride.edu").should("exist");

    // Profile sub-tabs
    cy.get(".profile-tabs").within(() => {
      cy.contains("Account").should("exist");
      cy.contains("Settings").should("exist");
      cy.contains("Security").should("exist");
    });

    // Basic account fields
    cy.contains("Basic Information").should("exist");
    cy.get('input[name="name"]').should("exist");
    cy.get('input[name="employeeId"]').should("exist");
    cy.get('input[name="email"]').should("exist");
    cy.get('input[name="phone"]').should("exist");

    // Edit Profile flow
    cy.contains("button", "Edit Profile")
      .scrollIntoView()
      .click();

    cy.contains("button", "Save Changes").should("exist");
    cy.contains("button", "Cancel").should("exist");

    // Cancel back to view mode
    cy.contains("button", "Cancel").click();
    cy.contains("button", "Edit Profile").should("exist");
  });

  it("shows Settings & Security actions (password + 2FA modals)", () => {
    // Sidebar -> Profile
    cy.get(".sidebar-nav").contains("Profile").click();

    // SETTINGS SUB-TAB
    cy.get(".profile-tabs").contains("Settings").click();

    cy.contains("Email Notifications").should("exist");
    cy.contains("System Alerts").should("exist");
    cy.contains("Maintenance Mode").should("exist");
    cy.contains("Save Settings").should("exist");

    // SECURITY SUB-TAB
    cy.get(".profile-tabs").contains("Security").click();

    // Security cards
    cy.get(".security-section").within(() => {
      cy.contains("Change Password").should("exist");
      cy.contains("Two-Factor Authentication").should("exist");
    });

    // ----- Change Password modal -----
    cy.get(".security-section")
      .contains("button", "Change Password")
      .scrollIntoView()
      .click();

    cy.get(".payment-confirmed-card").within(() => {
      cy.contains("Change Password").should("exist");
      cy.contains("Current Password").should("exist");
      cy.contains("New Password").should("exist");
      cy.contains("Confirm New Password").should("exist");
      cy.contains("button", "Cancel").click(); // close this modal
    });

    // ----- 2FA modal -----
    cy.get(".security-section")
      .contains("button", "Enable 2FA")
      .scrollIntoView()
      .click();

    cy.get(".payment-confirmed-card").within(() => {
      cy.contains("Enable Two-Factor Authentication").should("exist");
      cy.contains("button", "Cancel").click(); // close again
    });
  });
});
