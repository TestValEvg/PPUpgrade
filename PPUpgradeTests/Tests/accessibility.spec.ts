/**
 * Web Accessibility Testing Suite
 * 
 * Tests Crypto application pages for WCAG 2.1 AA compliance
 * Uses Axe-core for automated accessibility scanning
 * Implements Page Object Model for reusable accessibility testing
 */

import { test, expect } from '@playwright/test';
import { AccessibilityPage } from '../Pages/AccessibilityPage';
import { A11yReporter, A11yReportSummary } from '../Utilits/a11y-reporter';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoDefinitions } from '../Pages/crypto.definitions';
import { CryptoStatus } from '../Pages/CryptoStatus';
import {
  testPages,
  baseURL,
  wcagLevels,
  testConfig
} from '../../config/accessibility-urls';

// Store all test reports for final summary
const allReports: A11yReportSummary[] = [];

test.describe('Web Accessibility Testing - WCAG 2.1 AA Compliance', () => {

  test.beforeEach(async ({ page }) => {
    // Set up reasonable timeout for accessibility checks
    page.setDefaultTimeout(30000);
  });

  test.afterAll(async () => {
    // Generate comprehensive reports after all tests complete
    if (allReports.length > 0) {
      console.log('\n📊 Generating Accessibility Test Reports...\n');
      
      // Create HTML report
      const htmlReport = A11yReporter.createHtmlReport(allReports);
      const fs = require('fs');
      fs.writeFileSync(
        'accessibility-report.html',
        htmlReport,
        { encoding: 'utf-8' }
      );

      // Create Markdown report
      const mdReport = A11yReporter.createMarkdownReport(allReports);
      fs.writeFileSync(
        'ACCESSIBILITY_TEST_REPORT.md',
        mdReport,
        { encoding: 'utf-8' }
      );

      console.log('✅ Reports generated: accessibility-report.html and ACCESSIBILITY_TEST_REPORT.md\n');
    }
  });

  // ========== TEST 1: Dashboard/Home Page ==========
  test('1️⃣ Dashboard - WCAG 2.1 AA Compliance', async ({ page }) => {
    const a11y = new AccessibilityPage(page);

    // Navigate to home page
    await page.goto(baseURL + '/');
    await a11y.waitForPageLoad();
    await page.waitForTimeout(500);

    console.log('\n🔍 Scanning: Dashboard/Home Page');

    // Perform accessibility scan
    const results = await a11y.scanWCAG_AA();

    // Log violations
    const report = A11yReporter.generateReport(results, 'Dashboard/Home Page');
    allReports.push(report);

    // Assert compliance
    if (results.violations.length > 0) {
      console.log(`⚠️  Found ${results.violations.length} accessibility issues`);
    } else {
      console.log('✅ Dashboard is WCAG 2.1 AA compliant');
    }

    expect(results.violations).toEqual([]);
  });

  // ========== TEST 2: Crypto Results Page ==========
  test('2️⃣ Crypto Results Page - WCAG 2.1 AA Compliance', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const a11y = new AccessibilityPage(page);

    // Setup: Login and navigate to results
    await loginPage.navigate();
    await loginPage.login();
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('\n🔍 Scanning: Crypto Results Page');

    // Perform accessibility scan
    const results = await a11y.scanWCAG_AA();

    // Log violations
    const report = A11yReporter.generateReport(results, 'Crypto Results Page');
    allReports.push(report);

    if (results.violations.length > 0) {
      console.log(`⚠️  Found ${results.violations.length} accessibility issues`);
    } else {
      console.log('✅ Crypto Results Page is WCAG 2.1 AA compliant');
    }

    expect(results.violations).toEqual([]);
  });

  // ========== TEST 3: Crypto Results with Filters Applied ==========
  test('3️⃣ Crypto Results with Filters - WCAG 2.1 AA Compliance', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const a11y = new AccessibilityPage(page);

    // Setup: Login, navigate, and apply filters
    await loginPage.navigate();
    await loginPage.login();
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    
    // Apply single jurisdiction filter
    await cryptoResults.searchByJurisdiction('Bahrain');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('\n🔍 Scanning: Crypto Results with Filters (Bahrain)');

    // Perform accessibility scan
    const results = await a11y.scanWCAG_AA();

    // Log violations
    const report = A11yReporter.generateReport(results, 'Crypto Results with Filters');
    allReports.push(report);

    if (results.violations.length > 0) {
      console.log(`⚠️  Found ${results.violations.length} accessibility issues`);
    } else {
      console.log('✅ Filtered Results Page is WCAG 2.1 AA compliant');
    }

    expect(results.violations).toEqual([]);
  });

  // ========== TEST 4: Definitions Tab ==========
  test('4️⃣ Definitions Tab - WCAG 2.1 AA Compliance', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoDefinitions = new CryptoDefinitions(page);
    const a11y = new AccessibilityPage(page);

    // Setup: Login and navigate to definitions
    await loginPage.navigate();
    await loginPage.login();
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoDefinitions.openDefinitionsTab();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('\n🔍 Scanning: Definitions Tab');

    // Perform accessibility scan
    const results = await a11y.scanWCAG_AA();

    // Log violations
    const report = A11yReporter.generateReport(results, 'Definitions Tab');
    allReports.push(report);

    if (results.violations.length > 0) {
      console.log(`⚠️  Found ${results.violations.length} accessibility issues`);
    } else {
      console.log('✅ Definitions Tab is WCAG 2.1 AA compliant');
    }

    expect(results.violations).toEqual([]);
  });

  // ========== TEST 5: Status Tab ==========
  test('5️⃣ Status Tab - WCAG 2.1 AA Compliance', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoStatus = new CryptoStatus(page);
    const a11y = new AccessibilityPage(page);

    // Setup: Login and navigate to status
    await loginPage.navigate();
    await loginPage.login();
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoStatus.openStatusTab();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('\n🔍 Scanning: Status Tab');

    // Perform accessibility scan
    const results = await a11y.scanWCAG_AA();

    // Log violations
    const report = A11yReporter.generateReport(results, 'Status Tab');
    allReports.push(report);

    if (results.violations.length > 0) {
      console.log(`⚠️  Found ${results.violations.length} accessibility issues`);
    } else {
      console.log('✅ Status Tab is WCAG 2.1 AA compliant');
    }

    expect(results.violations).toEqual([]);
  });

  // ========== DETAILED ANALYSIS TESTS ==========

  test.describe('Detailed Accessibility Analysis', () => {

    test('Color Contrast Analysis', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const cryptoResults = new CryptoResults(page);
      const a11y = new AccessibilityPage(page);

      // Setup
      await loginPage.navigate();
      await loginPage.login();
      await cryptoResults.navigateToCrypto();
      await cryptoResults.viewCryptoData();

      console.log('\n🎨 Analyzing: Color Contrast Ratios');

      // Check color contrast
      const contrastResults = await a11y.checkColorContrast();

      console.log(`✅ Color Contrast Passed: ${contrastResults.passes.length}`);
      console.log(`⚠️  Color Contrast Issues: ${contrastResults.violations.length}`);

      expect(contrastResults.violations).toEqual([]);
    });

    test('ARIA Labels and Roles Analysis', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const cryptoResults = new CryptoResults(page);
      const a11y = new AccessibilityPage(page);

      // Setup
      await loginPage.navigate();
      await loginPage.login();
      await cryptoResults.navigateToCrypto();
      await cryptoResults.viewCryptoData();

      console.log('\n♿ Analyzing: ARIA Labels and Roles');

      // Check ARIA labels
      const ariaResults = await a11y.checkAriaLabels();

      console.log(`✅ ARIA Labels Passed: ${ariaResults.passes.length}`);
      console.log(`⚠️  ARIA Issues: ${ariaResults.violations.length}`);

      expect(ariaResults.violations).toEqual([]);
    });

    test('Keyboard Navigation Check', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const cryptoResults = new CryptoResults(page);
      const a11y = new AccessibilityPage(page);

      // Setup
      await loginPage.navigate();
      await loginPage.login();
      await cryptoResults.navigateToCrypto();
      await cryptoResults.viewCryptoData();

      console.log('\n⌨️  Analyzing: Keyboard Navigation');

      // Check keyboard navigation
      const keyboardResults = await a11y.checkKeyboardNavigation();

      console.log(`ℹ️  Focusable Elements Found: ${keyboardResults.totalFocusable}`);
      console.log(`${keyboardResults.hasVisibleFocus ? '✅' : '⚠️'} Focus Indicators: ${keyboardResults.hasVisibleFocus ? 'PRESENT' : 'MISSING'}`);

      expect(keyboardResults.hasVisibleFocus).toBeTruthy();
    });

    test('WCAG Level A Compliance Check', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const cryptoResults = new CryptoResults(page);
      const a11y = new AccessibilityPage(page);

      // Setup
      await loginPage.navigate();
      await loginPage.login();
      await cryptoResults.navigateToCrypto();
      await cryptoResults.viewCryptoData();

      console.log('\n📋 Checking: WCAG 2.1 Level A Compliance');

      // Scan for Level A compliance
      const levelAResults = await a11y.scanWCAG_A();

      const summary = a11y.getViolationSummary(levelAResults);
      console.log(`WCAG Level A Violations - Critical: ${summary.critical}, Serious: ${summary.serious}`);

      // Level A should have zero violations
      expect(levelAResults.violations).toEqual([]);
    });
  });

  // ========== COMPONENT-LEVEL ACCESSIBILITY TESTS ==========

  test.describe('Component-Level Accessibility', () => {

    test('Header Section Accessibility', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const a11y = new AccessibilityPage(page);

      // Setup
      await loginPage.navigate();

      console.log('\n🔍 Scanning: Header Component');

      // Scan header only
      const headerResults = await a11y.scanComponent('header', {
        tags: ['wcag2a', 'wcag2aa']
      });

      console.log(`Header Violations: ${headerResults.violations.length}`);

      expect(headerResults.violations).toEqual([]);
    });

    test('Navigation Menu Accessibility', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const cryptoResults = new CryptoResults(page);
      const a11y = new AccessibilityPage(page);

      // Setup
      await loginPage.navigate();
      await loginPage.login();
      await cryptoResults.navigateToCrypto();
      await cryptoResults.viewCryptoData();

      console.log('\n🔍 Scanning: Navigation Menu');

      // Scan nav element
      const navResults = await a11y.scanComponent('nav', {
        tags: ['wcag2a', 'wcag2aa']
      });

      console.log(`Navigation Violations: ${navResults.violations.length}`);

      expect(navResults.violations).toEqual([]);
    });

    test('Main Content Area Accessibility', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const cryptoResults = new CryptoResults(page);
      const a11y = new AccessibilityPage(page);

      // Setup
      await loginPage.navigate();
      await loginPage.login();
      await cryptoResults.navigateToCrypto();
      await cryptoResults.viewCryptoData();

      console.log('\n🔍 Scanning: Main Content Area');

      // Scan main content
      const mainResults = await a11y.scanComponent('main', {
        tags: ['wcag2a', 'wcag2aa']
      });

      console.log(`Main Content Violations: ${mainResults.violations.length}`);

      expect(mainResults.violations).toEqual([]);
    });
  });
});
