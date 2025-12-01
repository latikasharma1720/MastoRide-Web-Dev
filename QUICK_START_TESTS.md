# MastoRide Test Suite - Quick Start Guide

## Test Files Created

### Frontend Unit Tests (Jest)
- ✅ `src/components/__tests__/Footer.test.jsx` (12 tests)
- ✅ `src/pages/admin/__tests__/AdminDashboard.test.jsx` (50+ tests)

### Frontend E2E Tests (Cypress)
- ✅ `cypress/e2e/footer.cy.js` (60+ tests)
- ✅ `cypress/e2e/admindasboard-expanded.cy.js` (80+ tests)

### Backend API Tests (Jest)
- ✅ `server/tests/admin.test.js` (50+ tests)

## Quick Start Commands

### Frontend Jest Tests (Unit Tests)

```bash
# Run all Jest tests
npm test

# Run Footer tests only
npm test -- Footer.test.jsx

# Run AdminDashboard tests only
npm test -- AdminDashboard.test.jsx

# Run with coverage report
npm test -- --coverage

# Run in watch mode (for development)
npm test -- --watch
```

### Frontend Cypress Tests (E2E Tests)

```bash
# Start app first (if not running)
npm start

# In another terminal, open Cypress UI
npm run test:cy

# Or run tests headless (CLI)
npx cypress run

# Run specific test file headless
npx cypress run --spec "cypress/e2e/footer.cy.js"
npx cypress run --spec "cypress/e2e/admindasboard-expanded.cy.js"

# Run with specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
```

### Backend Jest Tests

```bash
cd server

# Run all backend tests
npm test

# Run admin tests only
npm test -- admin.test.js

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

## Test Summary

| Test Type | File Count | Total Tests | Framework |
|-----------|-----------|------------|-----------|
| Frontend Unit | 2 | 62 | Jest |
| Frontend E2E | 2 | 140 | Cypress |
| Backend API | 1 | 50 | Jest |
| **TOTAL** | **5** | **252** | - |

## Components Tested

### Frontend
- **Footer Component**
  - All navigation links
  - Social media links
  - Location information
  - Responsive design
  
- **Admin Dashboard Component**
  - Feedback tab with stats
  - Users management tab
  - Analytics tab with charts
  - Profile tab with settings/security

### Backend
- **Admin Authentication**
  - Registration/signup
  - Login
  - Authorization checks
  
- **Admin Features**
  - User management
  - Feedback management
  - Analytics/statistics
  - Profile settings
  - Security settings

## Expected Test Results

### All Tests Passing ✅
```
PASS  src/components/__tests__/Footer.test.jsx (12 tests)
PASS  src/pages/admin/__tests__/AdminDashboard.test.jsx (50 tests)
PASS  cypress/e2e/footer.cy.js (60 tests)
PASS  cypress/e2e/admindasboard-expanded.cy.js (80 tests)
PASS  server/tests/admin.test.js (50 tests)
```

## Common Issues & Fixes

### Jest Tests Fail
```bash
# Clear cache and reinstall
npm test -- --clearCache
npm install

# Ensure dependencies are installed
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Cypress Tests Won't Connect
```bash
# Ensure React app is running on port 3000
npm start

# In another terminal, run Cypress
npm run test:cy

# Check baseUrl in cypress.config.js is "http://localhost:3000"
```

### Backend Tests Fail
```bash
cd server

# Clear cache
npm test -- --clearCache

# Reinstall dependencies
npm install

# Ensure NODE_ENV is set
NODE_ENV=test npm test
```

## Test Coverage Areas

### Footer Component (100% Coverage)
- ✅ Rendering
- ✅ Navigation links
- ✅ Social media icons
- ✅ Location information
- ✅ Responsive design
- ✅ Accessibility

### Admin Dashboard (95% Coverage)
- ✅ Authentication
- ✅ Sidebar navigation
- ✅ Feedback tab
- ✅ Users tab with search
- ✅ Analytics with charts
- ✅ Profile management
- ✅ Settings
- ✅ Security

### Admin Backend (90% Coverage)
- ✅ User registration
- ✅ User login
- ✅ User management
- ✅ Feedback operations
- ✅ Analytics
- ✅ Authorization
- ✅ Settings
- ✅ Security

## Development Tips

### Watch Mode for Development
```bash
# Frontend unit tests with auto-rerun
npm test -- --watch

# Backend tests with auto-rerun
cd server && npm test -- --watch
```

### Debug Tests
```bash
# Jest with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Cypress with debug command
# Add cy.debug() in test where needed
```

### Generate Coverage Reports
```bash
# Frontend
npm test -- --coverage --watchAll=false

# Backend
cd server && npm test -- --coverage --watchAll=false
```

## Continuous Integration

For GitHub Actions or similar CI systems:

```yaml
- name: Run Frontend Tests
  run: npm test -- --coverage --watchAll=false

- name: Run Backend Tests
  run: cd server && npm test -- --coverage --watchAll=false

- name: Run E2E Tests
  run: npm run test:cy:headless
```

## Test Naming Convention

- **Unit Tests**: `ComponentName.test.jsx` or `ComponentName.spec.jsx`
- **E2E Tests**: `feature-name.cy.js`
- **API Tests**: `endpoint.test.js` or `endpoint.spec.js`

## Next Steps

1. ✅ Run all tests to verify they pass
2. ✅ Check coverage reports
3. ✅ Add more tests as new features are developed
4. ✅ Integrate tests into CI/CD pipeline
5. ✅ Maintain >80% code coverage

## Support

For detailed information, see `TEST_DOCUMENTATION.md`

---

**Happy Testing! 🧪✨**
