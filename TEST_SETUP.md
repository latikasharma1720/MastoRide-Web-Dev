# Test Configuration Setup

This guide helps you verify and configure all testing tools for the MastoRide project.

## Prerequisites

Ensure you have the following installed:

```bash
node --version    # Should be v14 or higher
npm --version     # Should be v6 or higher
```

## Frontend Setup

### 1. Jest Configuration

Jest is already configured through `create-react-app`. Verify setup:

```bash
# Check jest is installed
npm list jest

# View jest config (should show in package.json)
cat package.json | grep -A 5 "jest"
```

### 2. Required Frontend Dependencies

```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest
```

### 3. Cypress Configuration

Verify `cypress.config.js` exists:

```javascript
// Should contain
export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
  },
});
```

Install Cypress if needed:

```bash
npm install --save-dev cypress
```

## Backend Setup

### 1. Backend Dependencies

```bash
cd server

npm install --save-dev \
  jest \
  supertest \
  cross-env
```

### 2. Backend Jest Configuration

Create `server/jest.config.js`:

```javascript
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**'
  ],
};
```

### 3. Update package.json

Backend `package.json` should have:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "cross-env NODE_ENV=test jest --runInBand"
  },
  "jest": {
    "testEnvironment": "node",
    "verbose": true
  }
}
```

## Environment Configuration

### Frontend Environment

Create `.env` file (if needed):

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

### Backend Environment

Create `server/.env.test`:

```
NODE_ENV=test
MONGO_URI=mongodb://localhost:27017/mastoride-test
JWT_SECRET=test-secret-key
PORT=5000
```

## Database Setup for Tests

### MongoDB

Option 1: Use MongoDB locally

```bash
# Install MongoDB Community Edition
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify running
mongo --version
```

Option 2: Use MongoDB Atlas (Cloud)

```bash
# Update MONGO_URI in .env.test
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/mastoride-test
```

## Directory Structure

Verify your project structure:

```
MastoRide-Web-Dev/Masto test/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   └── Footer.test.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   └── admin/
│   │       ├── __tests__/
│   │       │   └── AdminDashboard.test.jsx
│   │       └── AdminDashboard.jsx
│   └── ...
├── cypress/
│   ├── e2e/
│   │   ├── footer.cy.js
│   │   └── admindasboard-expanded.cy.js
│   ├── support/
│   └── cypress.config.js
├── server/
│   ├── tests/
│   │   ├── auth.test.js (existing)
│   │   └── admin.test.js (new)
│   ├── models/
│   ├── routes/
│   └── server.js
├── package.json
├── TEST_DOCUMENTATION.md (new)
└── QUICK_START_TESTS.md (new)
```

## Verification Checklist

Run these commands to verify setup:

### Frontend

```bash
# ✅ Check Jest works
npm test -- --listTests

# ✅ Check Cypress works
npx cypress --version

# ✅ Check React is installed
npm list react react-dom

# ✅ Check testing libraries
npm list @testing-library/react @testing-library/jest-dom
```

### Backend

```bash
cd server

# ✅ Check Node modules
npm list jest supertest

# ✅ Verify MongoDB connection
node -e "const mongoose = require('mongoose'); console.log(mongoose.version)"
```

## Running Tests - Full Workflow

### Step 1: Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
cd ..
```

### Step 2: Start Application

```bash
# Terminal 1: Start React app
npm start

# Terminal 2: Start backend server
cd server && npm run dev
```

### Step 3: Run Tests

```bash
# Terminal 3: Run Jest tests
npm test

# Terminal 4: Run Cypress tests
npm run test:cy

# Terminal 5: Run backend tests
cd server && npm test
```

## Troubleshooting

### Jest Configuration Issues

**Problem**: `Cannot find module '@testing-library/react'`

**Solution**:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm cache clean --force
npm install
```

### Cypress Connection Issues

**Problem**: `Cypress cannot connect to localhost:3000`

**Solution**:
```bash
# Make sure React app is running
npm start

# Verify in another terminal
curl http://localhost:3000

# Check cypress.config.js baseUrl
cat cypress.config.js
```

### MongoDB Connection Issues

**Problem**: `MongoError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**:
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
# macOS
brew services start mongodb-community

# Or run in foreground
mongod

# Test connection
mongo
```

### Port Conflicts

**Problem**: `Port 3000 already in use` or `Port 5000 already in use`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 16.x]

    steps:
      - uses: actions/checkout@v2

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install dependencies
        run: npm install && cd server && npm install

      - name: Run frontend tests
        run: npm test -- --coverage --watchAll=false

      - name: Run backend tests
        run: cd server && npm test -- --coverage --watchAll=false

      - name: Run Cypress tests
        run: npm run test:cy:headless
```

## Performance Optimization

### Speed Up Jest Tests

```bash
# Run tests in parallel (default)
npm test -- --maxWorkers=4

# Run with less output
npm test -- --silent

# Skip tests in watch mode
npm test -- --bail
```

### Speed Up Cypress Tests

```bash
# Run multiple tests in parallel
npx cypress run --parallel

# Run with specific browser
npx cypress run --browser chrome
```

## Advanced Configuration

### Custom Jest Configuration

Create `jest.config.js` in root:

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/**/*.test.{js,jsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Custom Cypress Configuration

Update `cypress.config.js`:

```javascript
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 5000,
    requestTimeout: 5000,
    responseTimeout: 5000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
```

## Documentation

- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Cypress Docs](https://docs.cypress.io/guides/overview/why-cypress)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- [Supertest](https://github.com/visionmedia/supertest)

---

**Configuration Complete! Ready to test! 🚀**
