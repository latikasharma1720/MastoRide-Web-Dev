/* eslint-env cypress */
/* global cy */
/* eslint-disable no-undef */

/// <reference types="cypress" />

// Helper function to login as admin without UI form
function loginAsAdminWithoutUI() {
  cy.visit('/admin', {
    onBeforeLoad(win) {
      win.sessionStorage.setItem(
        'mastoride_user',
        JSON.stringify({
          id: 'admin-demo',
          name: 'Administrators',
          email: 'admin@mastoride.edu',
          role: 'admin',
        })
      );
    },
  });
  cy.url().should('include', '/admin');
}

describe('Admin Dashboard - Comprehensive E2E Tests', () => {
  beforeEach(() => {
    loginAsAdminWithoutUI();
  });

  describe('Admin Dashboard - Accessibility & Page Load', () => {
    it('loads admin dashboard without errors', () => {
      cy.url().should('include', '/admin');
      cy.get('.dashboard-layout').should('exist');
    });

    it('displays navbar component', () => {
      cy.get('[data-testid="navbar"]').should('exist');
    });

    it('displays sidebar navigation', () => {
      cy.get('.sidebar-nav').should('be.visible');
    });

    it('displays main content area', () => {
      cy.get('.dashboard-main').should('be.visible');
    });

    it('page title and layout are rendered', () => {
      cy.get('.dashboard-layout').should('have.class', 'sidebar-open');
    });
  });

  describe('Sidebar Navigation - Feedback Tab', () => {
    it('Feedback tab is active by default', () => {
      cy.get('.sidebar-nav').within(() => {
        cy.contains('button', 'Feedback')
          .should('have.class', 'active');
      });
    });

    it('clicking Feedback tab keeps on Feedback view', () => {
      cy.contains('h1', 'User Feedback 💬').should('exist');
    });

    it('sidebar toggle button is visible', () => {
      cy.get('.sidebar-toggle').should('be.visible');
    });

    it('clicking sidebar toggle closes/opens sidebar', () => {
      // Initial state: open
      cy.get('.dashboard-layout').should('have.class', 'sidebar-open');

      // Click toggle
      cy.get('.sidebar-toggle').click();

      // Should now be closed
      cy.get('.dashboard-layout').should('have.class', 'sidebar-closed');

      // Click again to open
      cy.get('.sidebar-toggle').click();
      cy.get('.dashboard-layout').should('have.class', 'sidebar-open');
    });

    it('all navigation items are visible in sidebar', () => {
      cy.get('.sidebar-nav').within(() => {
        cy.contains('button', 'Feedback').should('exist');
        cy.contains('button', 'Users').should('exist');
        cy.contains('button', 'Analytics').should('exist');
        cy.contains('button', 'Profile').should('exist');
      });
    });
  });

  describe('Feedback Tab - Overview', () => {
    it('displays Feedback title and description', () => {
      cy.contains('h1', 'User Feedback 💬').should('exist');
      cy.contains('View and manage customer reviews and feedback').should('exist');
    });

    it('displays stats cards grid', () => {
      cy.get('.stats-grid').should('be.visible');
    });

    it('displays 4 stat cards', () => {
      cy.get('.stat-card').should('have.length', 4);
    });

    it('first stat card shows Average Rating', () => {
      cy.get('.stat-card').first().within(() => {
        cy.contains('Average Rating').should('exist');
        cy.contains('4.8').should('exist');
      });
    });

    it('displays all stat card data correctly', () => {
      cy.get('.stat-card').within(() => {
        cy.get('.stat-value').each(($value) => {
          expect($value.text()).to.not.be.empty;
        });
      });
    });

    it('displays Recent Feedback section', () => {
      cy.contains('h2', 'Recent Feedback').should('exist');
    });

    it('displays feedback items with ratings', () => {
      cy.get('.activity-item').should('have.length.at.least', 3);
    });

    it('feedback items contain timestamps', () => {
      cy.get('.activity-time').should('have.length.at.least', 1);
      cy.contains('hours ago').should('exist');
      cy.contains('days ago').or.contains('hours ago').should('exist');
    });

    it('displays feedback content and author', () => {
      cy.contains('Excellent Service').should('exist');
      cy.contains('Sarah Johnson').should('exist');
    });
  });

  describe('Users Tab - Management', () => {
    beforeEach(() => {
      cy.get('.sidebar-nav').within(() => {
        cy.contains('button', 'Users').click();
      });
    });

    it('navigates to Users tab', () => {
      cy.contains('h1', 'User Management').should('exist');
    });

    it('displays User Management header with description', () => {
      cy.contains('Manage all users in one place').should('exist');
    });

    it('displays search bar', () => {
      cy.get('input[placeholder*="Search users"]').should('be.visible');
    });

    it('displays action buttons', () => {
      cy.contains('button', 'Export').should('exist');
      cy.contains('button', 'Add User').should('exist');
    });

    it('displays users table with headers', () => {
      cy.get('table').should('exist');
      cy.get('thead').within(() => {
        cy.contains('Full Name').should('exist');
        cy.contains('Email').should('exist');
        cy.contains('Joined Date').should('exist');
        cy.contains('Status').should('exist');
        cy.contains('Actions').should('exist');
      });
    });

    it('displays user list', () => {
      cy.get('tbody tr').should('have.length.at.least', 1);
    });

    it('displays user names in table', () => {
      cy.contains('td', 'John Doe').should('exist');
      cy.contains('td', 'Sarah Smith').should('exist');
    });

    it('displays user emails', () => {
      cy.contains('td', 'john@pfw.edu').should('exist');
      cy.contains('td', 'sarah@pfw.edu').should('exist');
    });

    it('displays user status badges', () => {
      cy.contains('span', 'Active').should('exist');
      cy.contains('span', 'Inactive').should('exist');
    });

    it('search functionality filters users', () => {
      cy.get('input[placeholder*="Search users"]').type('John');
      cy.contains('John Doe').should('exist');
      cy.contains('Sarah Smith').should('not.exist');
    });

    it('clears search and shows all users again', () => {
      cy.get('input[placeholder*="Search users"]').type('John');
      cy.get('input[placeholder*="Search users"]').clear();
      cy.contains('Sarah Smith').should('exist');
    });

    it('checkbox for selecting users exists', () => {
      cy.get('table').within(() => {
        cy.get('input[type="checkbox"]').should('have.length.at.least', 1);
      });
    });

    it('can select individual users', () => {
      cy.get('tbody tr').first().within(() => {
        cy.get('input[type="checkbox"]').check({ force: true });
      });
    });

    it('delete button appears for each user', () => {
      cy.get('button[title="Delete User"]').should('have.length.at.least', 1);
    });

    it('Export button is clickable', () => {
      cy.contains('button', 'Export').click();
    });

    it('Add User button is clickable', () => {
      cy.contains('button', 'Add User').click();
    });
  });

  describe('Analytics Tab - Charts', () => {
    beforeEach(() => {
      cy.get('.sidebar-nav').within(() => {
        cy.contains('button', 'Analytics').click();
      });
    });

    it('navigates to Analytics tab', () => {
      cy.contains('h3', 'Monthly Ride Bookings').should('exist');
    });

    it('displays chart headings', () => {
      cy.contains('Monthly Ride Bookings').should('exist');
      cy.contains('Ride Type Distribution').should('exist');
    });

    it('displays canvas elements for charts', () => {
      // Charts are rendered as canvas elements
      cy.get('canvas').should('have.length.at.least', 2);
    });

    it('chart panels are visible', () => {
      cy.get('.chart-panel').should('have.length.at.least', 2);
    });

    it('chart containers exist', () => {
      cy.get('.chart-container').should('have.length.at.least', 2);
    });

    it('analytics grid layout is present', () => {
      cy.get('.analytics-grid').should('be.visible');
    });
  });

  describe('Profile Tab - Account Information', () => {
    beforeEach(() => {
      cy.get('.sidebar-nav').within(() => {
        cy.contains('button', 'Profile').click();
      });
    });

    it('navigates to Profile tab', () => {
      cy.contains('Administrators').should('exist');
    });

    it('displays admin profile name', () => {
      cy.contains('h2', 'Administrators').should('exist');
    });

    it('displays admin email', () => {
      cy.contains('admin@mastoride.edu').should('exist');
    });

    it('displays profile sub-tabs', () => {
      cy.contains('button', 'Account').should('exist');
      cy.contains('button', 'Settings').should('exist');
      cy.contains('button', 'Security').should('exist');
    });

    it('Account tab shows form fields', () => {
      cy.contains('Basic Information').should('exist');
      cy.contains('Professional Details').should('exist');
    });

    it('displays name field', () => {
      cy.get('input[name="name"]').should('exist');
      cy.get('input[name="name"]').should('have.value', 'Administrator');
    });

    it('displays email field', () => {
      cy.get('input[name="email"]').should('exist');
      cy.get('input[name="email"]').should('have.value', 'admin@mastoride.edu');
    });

    it('displays phone field', () => {
      cy.get('input[name="phone"]').should('exist');
    });

    it('displays Edit Profile button', () => {
      cy.contains('button', 'Edit Profile').should('exist');
    });

    it('clicking Edit Profile enables editing', () => {
      cy.contains('button', 'Edit Profile').click();
      cy.contains('button', 'Save Changes').should('exist');
      cy.contains('button', 'Cancel').should('exist');
    });

    it('can modify profile fields when in edit mode', () => {
      cy.contains('button', 'Edit Profile').click();
      cy.get('input[name="name"]').clear().type('New Admin Name');
      cy.get('input[name="name"]').should('have.value', 'New Admin Name');
    });

    it('Cancel button exits edit mode', () => {
      cy.contains('button', 'Edit Profile').click();
      cy.contains('button', 'Cancel').click();
      cy.contains('button', 'Edit Profile').should('exist');
    });

    it('Save Changes button appears in edit mode', () => {
      cy.contains('button', 'Edit Profile').click();
      cy.contains('button', 'Save Changes').should('exist');
    });
  });

  describe('Profile Tab - Settings', () => {
    beforeEach(() => {
      cy.get('.sidebar-nav').within(() => {
        cy.contains('button', 'Profile').click();
      });
    });

    it('can navigate to Settings sub-tab', () => {
      cy.contains('button', 'Settings').click();
      cy.contains('Email Notifications').should('exist');
    });

    it('displays notification settings', () => {
      cy.contains('button', 'Settings').click();
      cy.contains('Email Notifications').should('exist');
      cy.contains('SMS Alerts').should('exist');
      cy.contains('System Alerts').should('exist');
      cy.contains('Maintenance Mode').should('exist');
    });

    it('displays toggle switches for settings', () => {
      cy.contains('button', 'Settings').click();
      cy.get('input[type="checkbox"]').should('have.length.at.least', 4);
    });

    it('Save Settings button is visible', () => {
      cy.contains('button', 'Settings').click();
      cy.contains('button', 'Save Settings').should('exist');
    });
  });

  describe('Profile Tab - Security', () => {
    beforeEach(() => {
      cy.get('.sidebar-nav').within(() => {
        cy.contains('button', 'Profile').click();
      });
    });

    it('can navigate to Security sub-tab', () => {
      cy.contains('button', 'Security').click();
      cy.contains('Change Password').should('exist');
    });

    it('displays Change Password option', () => {
      cy.contains('button', 'Security').click();
      cy.contains('Change Password').should('exist');
    });

    it('displays 2FA option', () => {
      cy.contains('button', 'Security').click();
      cy.contains('Two-Factor Authentication').should('exist');
    });

    it('Change Password button opens modal', () => {
      cy.contains('button', 'Security').click();
      cy.get('.security-section')
        .contains('button', 'Change Password')
        .click();
      cy.get('.payment-confirmed-card').should('exist');
    });

    it('Change Password modal displays form fields', () => {
      cy.contains('button', 'Security').click();
      cy.get('.security-section')
        .contains('button', 'Change Password')
        .click();
      cy.get('.payment-confirmed-card').within(() => {
        cy.contains('Current Password').should('exist');
        cy.contains('New Password').should('exist');
        cy.contains('Confirm New Password').should('exist');
      });
    });

    it('can close Change Password modal', () => {
      cy.contains('button', 'Security').click();
      cy.get('.security-section')
        .contains('button', 'Change Password')
        .click();
      cy.get('.payment-confirmed-card').within(() => {
        cy.contains('button', 'Cancel').click();
      });
      cy.get('.payment-confirmed-card').should('not.exist');
    });

    it('Enable 2FA button is clickable', () => {
      cy.contains('button', 'Security').click();
      cy.get('.security-section')
        .contains('button', 'Enable 2FA')
        .click();
    });

    it('2FA modal displays confirmation message', () => {
      cy.contains('button', 'Security').click();
      cy.get('.security-section')
        .contains('button', 'Enable 2FA')
        .click();
      cy.get('.payment-confirmed-card').should('contain', '🛡️');
      cy.get('.payment-confirmed-card').should('contain', 'Enable Two-Factor Authentication');
    });
  });

  describe('Tab Persistence', () => {
    it('active tab is saved to localStorage', () => {
      cy.get('.sidebar-nav').within(() => {
        cy.contains('button', 'Users').click();
      });
      cy.window().then((win) => {
        const activeTab = win.localStorage.getItem('admin_active_tab');
        expect(activeTab).to.equal('users');
      });
    });

    it('sidebar state is saved to localStorage', () => {
      cy.get('.sidebar-toggle').click();
      cy.window().then((win) => {
        const sidebarState = win.localStorage.getItem('admin_sidebar_open');
        expect(sidebarState).to.equal('false');
      });
    });
  });

  describe('Navigation Flow', () => {
    it('can navigate between all tabs', () => {
      // Start at Feedback
      cy.contains('h1', 'User Feedback 💬').should('exist');

      // Navigate to Users
      cy.get('.sidebar-nav').contains('button', 'Users').click();
      cy.contains('User Management').should('exist');

      // Navigate to Analytics
      cy.get('.sidebar-nav').contains('button', 'Analytics').click();
      cy.contains('Monthly Ride Bookings').should('exist');

      // Navigate to Profile
      cy.get('.sidebar-nav').contains('button', 'Profile').click();
      cy.contains('Administrators').should('exist');

      // Back to Feedback
      cy.get('.sidebar-nav').contains('button', 'Feedback').click();
      cy.contains('h1', 'User Feedback 💬').should('exist');
    });

    it('can switch between profile sub-tabs', () => {
      cy.get('.sidebar-nav').contains('button', 'Profile').click();

      // Account tab (default)
      cy.contains('Basic Information').should('exist');

      // Settings tab
      cy.contains('button', 'Settings').click();
      cy.contains('Email Notifications').should('exist');

      // Security tab
      cy.contains('button', 'Security').click();
      cy.contains('Change Password').should('exist');

      // Back to Account
      cy.contains('button', 'Account').click();
      cy.contains('Basic Information').should('exist');
    });
  });

  describe('Responsive Design', () => {
    it('dashboard is responsive on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('.dashboard-layout').should('be.visible');
    });

    it('sidebar can be toggled on mobile', () => {
      cy.viewport('iphone-x');
      cy.get('.sidebar-toggle').should('be.visible');
      cy.get('.sidebar-toggle').click();
      cy.get('.dashboard-layout').should('have.class', 'sidebar-closed');
    });

    it('dashboard displays on tablet', () => {
      cy.viewport('ipad-2');
      cy.get('.dashboard-main').should('be.visible');
    });

    it('dashboard displays on desktop', () => {
      cy.viewport('macbook-15');
      cy.get('.dashboard-layout').should('be.visible');
    });
  });

  describe('User Feedback - Detailed Tests', () => {
    it('feedback list contains multiple items', () => {
      cy.get('.activity-list').within(() => {
        cy.get('.activity-item').should('have.length.at.least', 3);
      });
    });

    it('feedback items display rating stars', () => {
      cy.get('.activity-item').first().within(() => {
        cy.get('.activity-icon').should('contain', '⭐');
      });
    });

    it('feedback items display content and time', () => {
      cy.get('.activity-item').first().within(() => {
        cy.get('.activity-content').should('exist');
        cy.get('.activity-time').should('exist');
      });
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('page remains stable when navigating between tabs', () => {
      for (let i = 0; i < 5; i++) {
        cy.get('.sidebar-nav').contains('button', 'Users').click();
        cy.get('.sidebar-nav').contains('button', 'Feedback').click();
      }
      cy.get('.dashboard-layout').should('exist');
    });

    it('forms remain accessible after multiple interactions', () => {
      cy.get('.sidebar-nav').contains('button', 'Profile').click();
      cy.contains('button', 'Edit Profile').click();
      cy.contains('button', 'Cancel').click();
      cy.contains('button', 'Edit Profile').click();
      cy.contains('button', 'Cancel').click();
      cy.contains('button', 'Edit Profile').should('exist');
    });

    it('modals can be opened and closed multiple times', () => {
      cy.get('.sidebar-nav').contains('button', 'Profile').click();
      cy.contains('button', 'Security').click();

      // Open and close Change Password modal 3 times
      for (let i = 0; i < 3; i++) {
        cy.get('.security-section')
          .contains('button', 'Change Password')
          .click();
        cy.get('.payment-confirmed-card').within(() => {
          cy.contains('button', 'Cancel').click();
        });
      }

      cy.get('.payment-confirmed-card').should('not.exist');
    });
  });

  describe('Accessibility', () => {
    it('sidebar buttons have aria-labels or roles', () => {
      cy.get('.sidebar-btn').each(($btn) => {
        cy.wrap($btn).should('have.attr', 'aria-label').or.have.role('button');
      });
    });

    it('sidebar toggle button has aria-expanded', () => {
      cy.get('.sidebar-toggle').should('have.attr', 'aria-expanded');
    });

    it('main element has proper role', () => {
      cy.get('main.dashboard-main').should('exist');
    });

    it('navigation is properly structured', () => {
      cy.get('nav.sidebar-tabs').should('exist');
    });
  });
});
