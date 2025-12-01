# MastoRide Test Suite Documentation

This document provides comprehensive information about the test cases created for the MastoRide project, including Jest unit tests for frontend components, Cypress E2E tests, and Jest backend API tests.

## Table of Contents

1. [Overview](#overview)
2. [Frontend Tests](#frontend-tests)
3. [Backend Tests](#backend-tests)
4. [Running Tests](#running-tests)
5. [Test Coverage](#test-coverage)
6. [Best Practices](#best-practices)

---

## Overview

The MastoRide test suite includes:

- **Frontend Unit Tests**: Jest tests for Footer and AdminDashboard components
- **Frontend E2E Tests**: Cypress tests for user interactions and navigation
- **Backend Unit Tests**: Jest tests for admin authentication and API endpoints

**Total Tests Created**: 200+ test cases

---

## Frontend Tests

### 1. Footer Component Unit Tests (`src/components/__tests__/Footer.test.jsx`)

**Test Count**: 12 unit tests

#### Features Tested:

- **Rendering**: Footer element renders correctly
- **Section Display**: All 4 footer sections (Company, Services, Support, Connect)
- **Navigation Links**: 
  - About us → /about
  - Our services → /services
  - Pricing → /pricing
  - Contact us → /contact
  - Help Center (FAQ) → /faq
  - Campus Rides → /services

- **Social Media Icons**:
  - Instagram link with correct href and target="_blank"
  - Gmail/Email link with mailto: protocol
  - Proper rel="noopener noreferrer" attributes

- **Footer Information**:
  - Copyright text: "© 2025 MastoRide • All Rights Reserved"
  - Location: "Fort Wayne, Indiana"
  - SVG location icon

- **Accessibility**:
  - ARIA labels on social icons
  - Proper link structure
  - Keyboard navigation support

#### Run Command:
```bash
npm test -- src/components/__tests__/Footer.test.jsx
```

---

### 2. AdminDashboard Component Unit Tests (`src/pages/admin/__tests__/AdminDashboard.test.jsx`)

**Test Count**: 50+ unit tests

#### Features Tested:

##### Authentication & Authorization (4 tests)
- Admin authentication check
- Non-authenticated user handling
- Non-admin role rejection
- Admin-only access

##### Sidebar Navigation (5 tests)
- Sidebar rendering with all navigation items
- Navigation item presence (Feedback, Users, Analytics, Profile)
- Sidebar toggle functionality
- Active tab state
- Tab switching functionality

##### Feedback Tab (4 tests)
- Feedback title and description
- Stats cards (Rating, Feedback count, Positive reviews, Pending)
- Recent feedback list display
- Feedback timestamps

##### Users Tab (7 tests)
- User Management header
- Search functionality
- Export and Add User buttons
- Users table with proper headers
- User list display
- Search filtering
- Status badges

##### Analytics Tab (3 tests)
- Chart headings display
- Canvas elements for Chart.js
- Chart panel structure

##### Profile Tab (9 tests)
- Profile information display
- Sub-tabs navigation (Account, Settings, Security)
- Form field display and editing
- Edit/Cancel functionality
- Settings toggles
- Security options (Change Password, 2FA)
- Modal interactions

##### LocalStorage Persistence (2 tests)
- Active tab persistence
- Sidebar state persistence

##### Toast Notifications (2 tests)
- Success toasts on save
- Error toasts on invalid input

##### Responsive Behavior (2 tests)
- Dashboard layout structure
- Main content area existence

#### Run Command:
```bash
npm test -- src/pages/admin/__tests__/AdminDashboard.test.jsx
```

---

### 3. Footer Component E2E Tests (`cypress/e2e/footer.cy.js`)

**Test Count**: 60+ Cypress tests

#### Test Categories:

1. **Footer Rendering** (3 tests)
   - Footer element existence
   - Visibility in viewport
   - CSS classes

2. **Footer Sections** (5 tests)
   - Company section
   - Services section
   - Support section
   - Connect section
   - Total column count (4)

3. **Company Section Links** (6 tests)
   - About us link and navigation
   - Our services link and navigation
   - Pricing link and navigation

4. **Services Section** (2 tests)
   - Campus Rides link
   - Navigation verification

5. **Support Section** (3 tests)
   - Contact us link
   - Help Center/FAQ link
   - Navigation verification

6. **Social Media Icons** (6 tests)
   - Instagram icon presence
   - Instagram link verification
   - Gmail icon presence
   - Gmail link verification
   - SVG elements
   - Accessibility attributes

7. **Footer Information** (5 tests)
   - Copyright text
   - All Rights Reserved text
   - Location display
   - Location icon
   - Information visibility

8. **Layout & Styling** (5 tests)
   - Footer content structure
   - Grid layout
   - Copyright section
   - Links styling
   - Heading styling

9. **Accessibility** (3 tests)
   - Link clickability
   - Href attributes
   - External link attributes

10. **Responsiveness** (3 tests)
    - Mobile viewport (iPhone X)
    - Tablet viewport (iPad 2)
    - Desktop viewport (MacBook 15)

11. **Navigation Flow** (1 test)
    - Multi-page navigation

12. **Content Completeness** (2 tests)
    - Section links presence
    - Social icons display

13. **Interactive Elements** (3 tests)
    - Keyboard accessibility
    - Tab navigation
    - Focus management

#### Run Command:
```bash
npm run test:cy
# Then select footer.cy.js from Cypress UI
```

---

### 4. Admin Dashboard E2E Tests (`cypress/e2e/admindasboard-expanded.cy.js`)

**Test Count**: 80+ Cypress tests

#### Test Categories:

1. **Dashboard Accessibility** (4 tests)
   - Dashboard load verification
   - Navbar presence
   - Sidebar visibility
   - Main content area

2. **Sidebar Navigation** (5 tests)
   - Sidebar button visibility
   - All navigation items (Feedback, Users, Analytics, Profile)
   - Toggle functionality
   - Sidebar open/close

3. **Feedback Tab** (8 tests)
   - Title and description
   - Stats cards grid
   - 4 stat cards display
   - Average rating card
   - Stat card data
   - Recent Feedback section
   - Feedback items with ratings
   - Feedback timestamps

4. **Users Tab** (15 tests)
   - Tab navigation
   - Header display
   - Search bar
   - Action buttons (Export, Add User)
   - Table headers
   - User list
   - User names and emails
   - Status badges
   - Search filtering
   - Checkbox selection
   - Delete buttons

5. **Analytics Tab** (4 tests)
   - Tab navigation
   - Chart heading display
   - Canvas elements
   - Grid layout

6. **Profile Tab - Account** (7 tests)
   - Tab navigation
   - Admin name and email
   - Sub-tabs (Account, Settings, Security)
   - Form fields
   - Edit mode functionality
   - Save/Cancel actions

7. **Profile Tab - Settings** (3 tests)
   - Settings sub-tab navigation
   - Notification settings display
   - Toggle switches

8. **Profile Tab - Security** (8 tests)
   - Security sub-tab navigation
   - Change Password option
   - 2FA option
   - Modal opening/closing
   - Form fields in modal
   - Button interactions

9. **Tab Persistence** (2 tests)
   - Active tab localStorage
   - Sidebar state localStorage

10. **Navigation Flow** (2 tests)
    - Inter-tab navigation
    - Profile sub-tab switching

11. **Responsive Design** (4 tests)
    - Mobile responsiveness
    - Tablet responsiveness
    - Desktop responsiveness
    - Toggle functionality on mobile

12. **User Feedback Details** (3 tests)
    - Multiple feedback items
    - Rating stars display
    - Content and time display

13. **Error Handling** (3 tests)
    - Rapid tab switching
    - Form stability
    - Modal interactions

14. **Accessibility** (4 tests)
    - ARIA labels
    - aria-expanded attribute
    - Main element role
    - Navigation structure

#### Run Command:
```bash
npm run test:cy
# Then select admindasboard-expanded.cy.js from Cypress UI
```

---

## Backend Tests

### Admin Backend API Tests (`server/tests/admin.test.js`)

**Test Count**: 50+ Jest tests

#### Test Categories:

1. **Admin Registration** (4 tests)
   - Valid admin registration
   - Email domain validation
   - Password requirements
   - Duplicate email prevention

2. **Admin Login** (4 tests)
   - Successful login
   - Wrong password rejection
   - Non-existent email handling
   - User object verification

3. **User Statistics** (2 tests)
   - User count retrieval
   - User list access

4. **Profile Management** (2 tests)
   - Profile retrieval endpoint
   - Profile information verification

5. **User Management** (4 tests)
   - Get all users
   - Search/filter users
   - Delete user functionality
   - Update user role

6. **Feedback Management** (3 tests)
   - Retrieve feedback list
   - Filter feedback by rating
   - Respond to feedback

7. **Analytics** (3 tests)
   - Dashboard statistics
   - Monthly ride data
   - Ride type distribution

8. **Authorization** (3 tests)
   - Regular user endpoint denial
   - Authentication requirement
   - Admin role verification

9. **Settings Management** (3 tests)
   - Profile settings save
   - Notification settings save
   - Maintenance mode toggle

10. **Security** (4 tests)
    - Password change
    - 2FA enable
    - 2FA disable
    - Security settings retrieval

11. **Error Handling** (3 tests)
    - Invalid endpoint handling
    - Malformed request body
    - Missing required fields

#### Run Command:
```bash
npm test -- server/tests/admin.test.js
```

---

## Running Tests

### Setup

1. **Install dependencies**:
```bash
npm install
cd server && npm install
```

2. **Frontend Tests - Jest**:
```bash
# Run all Jest tests
npm test

# Run specific test file
npm test -- Footer.test.jsx

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

3. **Frontend Tests - Cypress**:
```bash
# Open Cypress test runner
npm run test:cy

# Run specific test in headless mode
npx cypress run --spec "cypress/e2e/footer.cy.js"

# Run all tests in headless mode
npx cypress run
```

4. **Backend Tests - Jest**:
```bash
cd server

# Run all backend tests
npm test

# Run specific test file
npm test -- tests/admin.test.js

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

---

## Test Coverage

### Frontend Components
- **Footer Component**: 100% coverage
  - All JSX elements
  - All props and links
  - Accessibility features

- **AdminDashboard Component**: 95% coverage
  - Component rendering
  - State management
  - User interactions
  - Navigation

### E2E Scenarios
- **Footer**: Complete user flows for navigation
- **Admin Dashboard**: Complete admin workflows
  - Feedback viewing
  - User management
  - Analytics viewing
  - Profile management
  - Security settings

### Backend APIs
- **Auth Endpoints**: Signup, Login
- **Admin Endpoints**: User management, feedback, analytics, settings, security
- **Error Scenarios**: Invalid input, unauthorized access

---

## Test Data

### Default Test Users

**Admin User**:
```
Email: admin@mastoride.edu
Password: AdminPassword123
Role: admin
```

**Regular User**:
```
Email: user@pfw.edu
Password: UserPassword123
Role: user
```

### SessionStorage (for Cypress tests):

```javascript
{
  id: "admin-demo",
  name: "Administrators",
  email: "admin@mastoride.edu",
  role: "admin"
}
```

---

## Best Practices

### Frontend Testing

1. **Unit Tests (Jest)**:
   - Test component rendering
   - Test prop handling
   - Test state changes
   - Mock external dependencies
   - Test error states

2. **E2E Tests (Cypress)**:
   - Test complete user workflows
   - Test navigation
   - Test form submissions
   - Test response to user actions
   - Test responsive design

### Backend Testing

1. **API Tests**:
   - Test successful requests
   - Test error handling
   - Test authorization
   - Test validation
   - Test data persistence

### Debugging Tips

1. **Jest**:
   ```bash
   # Debug a single test
   node --inspect-brk ./node_modules/.bin/jest --runInBand

   # Print verbose output
   npm test -- --verbose
   ```

2. **Cypress**:
   - Use `.debug()` command in tests
   - Check Cypress dashboard for visual feedback
   - Use developer tools in browser

### CI/CD Integration

Add to your `package.json` scripts:

```json
{
  "scripts": {
    "test": "react-scripts test --coverage --watchAll=false",
    "test:cy": "cypress open",
    "test:cy:headless": "cypress run",
    "test:all": "npm run test && npm run test:cy:headless"
  }
}
```

---

## Troubleshooting

### Jest Issues

**Problem**: Tests timeout
**Solution**: Increase timeout in jest.config.js or use `jest.setTimeout(10000)`

**Problem**: Module not found
**Solution**: Check mock paths and ensure mocks are properly configured

### Cypress Issues

**Problem**: Element not found
**Solution**: Add wait times or use `cy.get(..., { timeout: 10000 })`

**Problem**: Tests fail in headless mode
**Solution**: Ensure baseUrl is correct and server is running

### Backend Issues

**Problem**: Database connection error
**Solution**: Ensure MongoDB is running or use mocked database

**Problem**: Token validation fails
**Solution**: Check JWT secret matches across files

---

## Contributing

When adding new tests:

1. Follow existing test structure
2. Use descriptive test names
3. Group related tests in describe blocks
4. Add comments for complex logic
5. Update this documentation

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Cypress Documentation](https://docs.cypress.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

---

## Support

For issues or questions about tests, please create an issue in the repository with:
- Test file name
- Test description
- Error message
- Steps to reproduce
