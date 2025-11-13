# PPUpgrade - Crypto Reviewer Test Automation Framework

## Overview

This is a professional test automation framework for the **Crypto Reviewer** platform built with **Playwright**, **TypeScript**, and **BDD (Behavior-Driven Development)** principles. The framework follows industry best practices for maintainability, scalability, and clear communication between QA teams and business stakeholders.

**GitHub Repository:** [TestValEvg](https://github.com/TestValEvg)

## Project Objectives

- ✅ Automate critical user workflows for the Crypto Reviewer platform
- ✅ Implement BDD scenarios for business-readable test cases
- ✅ Achieve 100% test pass rate with comprehensive coverage
- ✅ Create maintainable, scalable test automation framework
- ✅ Document best practices and framework architecture

## Project Structure

```
PPUpgrade/
├── PPUpgradeTests/
│   ├── Pages/                    # Page Objects
│   │   ├── login.page.ts
│   │   ├── crypto.results.ts
│   │   ├── crypto.definitions.ts
│   │   ├── crypto.contacts.ts
│   │   ├── CryptoStatus.ts
│   │   └── crypto.filters.ts
│   ├── Tests/                    # Test Specifications (8 tests)
│   │   ├── auth.spec.ts
│   │   ├── crypto.results.spec.ts
│   │   ├── crypto.definitions.spec.ts
│   │   ├── cryptoStatus.spec.ts
│   │   └── crypto.contacts.spec.ts
│   └── Utilits/                  # Test Utilities
│       ├── credentials.ts
│       ├── helpers.ts
│       └── selectors.ts
├── features/                     # BDD Feature Files (5 scenarios)
│   ├── authentication.feature
│   ├── crypto-results.feature
│   ├── crypto-tabs.feature
│   ├── crypto-status.feature
│   └── crypto-search.feature
├── playwright.config.ts
├── package.json
└── README.md
```

## Framework Architecture

### Page Object Model (POM)
- Centralized element selectors in `Utilits/selectors.ts`
- Reusable page methods for common actions
- Easy maintenance and updates
- Clear separation of concerns

### BDD Integration
- Feature files in Gherkin language for business readability
- Scenarios describe "what" not "how"
- Living documentation for stakeholders
- Easy to understand by non-technical members

### Test Structure (AAA Pattern)
```typescript
// Arrange: Setup test data and prerequisites
// Act: Perform actions
// Assert: Verify expected outcomes
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/TestValEvg/PPUpgrade.git
cd PPUpgrade

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials
```

### Configuration

Create `.env` file:
```env
ADMIN_USER=your_email@example.com
ADMIN_PASS=your_password
BASE_URL=https://platform.test-simmons.com
TEST_ENV=staging
```

## Build and Test

### Run All Tests
```bash
npx playwright test
```

### Run Tests in Headed Mode (Watch Browser)
```bash
npx playwright test --headed --workers=1
```

### Run Specific Test File
```bash
npx playwright test crypto.results.spec.ts
```

### Run Tests with Filter
```bash
npx playwright test -g "User can log in"
```

### Debug Mode
```bash
npx playwright test --debug
```

### View Test Report
```bash
npx playwright show-report
```

## Test Results

### Latest Execution: ✅ ALL PASSING
- **Total Tests:** 8
- **Passed:** 8 ✅
- **Failed:** 0
- **Duration:** 31.4 seconds
- **Date:** November 13, 2025

### Test Coverage

| Test Category | Tests | Status |
|---------------|-------|--------|
| Authentication | 1 | ✅ PASS |
| Crypto Results | 3 | ✅ PASS |
| Crypto Tabs | 1 | ✅ PASS |
| Crypto Status | 2 | ✅ PASS |
| Search & Filter | 1 | ✅ PASS |
| **TOTAL** | **8** | **✅ PASS** |

## BDD Scenarios (5 Feature Files)

### 1. authentication.feature
- Login with valid credentials
- Login with invalid credentials

### 2. crypto-results.feature
- View results filtered by jurisdiction
- Expand/collapse all functionality

### 3. crypto-tabs.feature
- Navigate to Definitions tab
- Navigate to Contacts tab
- Navigate to Status tab

### 4. crypto-status.feature
- Single jurisdiction status view
- Multiple jurisdiction status redirect
- Status table structure

### 5. crypto-search.feature
- Search by jurisdiction
- Results consistency
- Search button state

## Key Features

✅ **Page Object Model** - Maintainable selector management
✅ **BDD Integration** - Business-readable scenarios
✅ **Best Practices** - Single responsibility, independence, clear naming
✅ **Comprehensive Reporting** - HTML reports with screenshots
✅ **Error Handling** - Meaningful error messages and assertions
✅ **Utilities** - Helper functions and credential management
✅ **CI/CD Ready** - Easy GitHub Actions integration

## Contribute

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-test`)
3. Commit changes (`git commit -m 'feat: Add new test'`)
4. Push to branch (`git push origin feature/new-test`)
5. Open a Pull Request

### Commit Message Convention
```
feat: Add new feature test
fix: Fix failing selector
refactor: Improve page object
docs: Update documentation
```

### Code Guidelines
- Follow TypeScript best practices
- Use descriptive variable names
- Keep methods focused and small
- Add comments for complex logic
- Write tests independently

## Best Practices Implemented

✅ **Test Design Principles**
- Single responsibility per test
- Independent test execution
- Proper setup and teardown
- Clear, descriptive test names

✅ **AAA Pattern**
- Arrange: Setup
- Act: Execute
- Assert: Verify

✅ **Error Handling**
- Custom error messages
- Proper assertions
- Meaningful failures

✅ **Performance**
- Average: ~23 seconds per test
- Total suite: ~31 seconds
- 100% pass rate

## Performance Metrics

- **Test Execution Time:** 31.4 seconds (all 8 tests)
- **Average Per Test:** ~23 seconds
- **Pass Rate:** 100%
- **Platform:** Crypto Reviewer
- **Browser:** Chromium (Playwright default)

## Troubleshooting

### Tests timeout
```bash
# Increase timeout in playwright.config.ts
timeout: 30000
```

### Element not found
- Check selectors in `Utilits/selectors.ts`
- Use `--debug` mode to inspect elements
- Ensure proper waits with `waitFor()`

### Parallel execution issues
- Run with `--workers=1` for sequential execution
- Ensure test data isolation
- Clean up after each test

## Resources

- [Playwright Documentation](https://playwright.dev)
- [BDD with Cucumber](https://cucumber.io)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Testing Practices](https://www.browserstack.com/guide/bdd-testing)

## Contact & Support

- **GitHub:** [TestValEvg](https://github.com/TestValEvg)
- **Issues:** Create an issue in the repository
- **Documentation:** See feature files in `/features`

---

**Framework Version:** 1.0.0  
**Last Updated:** November 13, 2025  
**Status:** ✅ Production Ready  
**All Tests Passing:** 8/8