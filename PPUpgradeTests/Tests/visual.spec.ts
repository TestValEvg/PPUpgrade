import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoDefinitions } from '../Pages/crypto.definitions';
import { CryptoContacts } from '../Pages/crypto.contacts';
import { CryptoStatus } from '../Pages/CryptoStatus';

/**
 * Visual Regression Tests
 * 
 * These tests capture and compare visual snapshots of the application's UI.
 * On first run, baseline screenshots are created.
 * On subsequent runs, new screenshots are compared pixel-by-pixel to baselines.
 * 
 * Key Features:
 * - fullPage: captures entire scrollable page
 * - animations: disabled to prevent timing-related differences
 * - maxDiffPixels: allows small pixel differences
 * - threshold: % of pixels that can differ
 * - mask: hides dynamic content (timestamps, user data, etc.)
 * 
 * Update baselines when intentional UI changes are made:
 * npx playwright test --project=chromium -u visual.spec.ts
 */

test.describe('Visual Regression - Full Page Screenshots', () => {
  
  test('Full crypto results page with single jurisdiction', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    // Navigate and load results
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Bahrain');

    // Wait for stabilization
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Mask dynamic elements
    await page.addStyleTag({
      content: `
        [data-testid="user-info"],
        .timestamp,
        .notification-badge,
        .live-price,
        .last-sync-time {
          visibility: hidden !important;
        }
      `
    });

    // Capture full page
    await expect(page).toHaveScreenshot('visual-results-page-bahrain.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 150,
      threshold: 0.2
    });
  });

  test('Full crypto results page with multiple jurisdictions', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup and multi-jurisdiction search
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByMultipleJurisdictions(['Azerbaijan', 'Bahrain']);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Mask dynamic content
    await page.addStyleTag({
      content: `
        .timestamp,
        .user-profile,
        .notification-count {
          visibility: hidden !important;
        }
      `
    });

    // Capture multi-jurisdiction view
    await expect(page).toHaveScreenshot('visual-results-page-multi-jurisdiction.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 150,
      threshold: 0.2
    });
  });

  test('Definitions tab full page view', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoDefinitions = new CryptoDefinitions(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoDefinitions.openDefinitionsTab();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Capture Definitions page
    await expect(page).toHaveScreenshot('visual-definitions-page.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 80,
      threshold: 0.15
    });
  });

  test('Contacts tab full page view', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoContacts = new CryptoContacts(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Bahrain');
    await cryptoContacts.openContactsTab();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Capture Contacts page
    await expect(page).toHaveScreenshot('visual-contacts-page.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 80,
      threshold: 0.15
    });
  });

  test('Status tab full page view', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoStatus = new CryptoStatus(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Azerbaijan');
    await cryptoStatus.openStatusTab();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Capture Status page
    await expect(page).toHaveScreenshot('visual-status-page.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
      threshold: 0.2
    });
  });
});

test.describe('Visual Regression - Component-Level Screenshots', () => {
  
  test('Navigation and filter panel', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();

    // Capture just the filter/navigation area
    const filterPanel = page.locator('.filter-panel, [class*="filter"], nav');
    await page.waitForLoadState('networkidle');

    await expect(filterPanel).toHaveScreenshot('visual-filter-panel.png', {
      animations: 'disabled',
      maxDiffPixels: 50,
      threshold: 0.1
    });
  });

  test('Results table header and first rows', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Canada');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Mask dynamic data in table
    await page.addStyleTag({
      content: `
        td:last-child,
        .date-column,
        .price-column {
          visibility: hidden !important;
        }
      `
    });

    // Capture results table
    const resultsTable = page.locator('table, [role="grid"], [class*="results"]').first();
    await expect(resultsTable).toHaveScreenshot('visual-results-table.png', {
      animations: 'disabled',
      maxDiffPixels: 80,
      threshold: 0.15
    });
  });

  test('Expanded result item details', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Bahrain');

    // Expand first result
    const firstExpandButton = page.locator('button:has(svg[class*="icon-plus"])').first();
    await firstExpandButton.click();

    await page.waitForTimeout(500);

    // Mask dynamic content
    await page.addStyleTag({
      content: `
        .updated-date,
        .change-indicator {
          visibility: hidden !important;
        }
      `
    });

    // Capture expanded item
    const expandedItem = page.locator('[class*="expanded"], [aria-expanded="true"]').first();
    await expect(expandedItem).toHaveScreenshot('visual-expanded-result-item.png', {
      animations: 'disabled',
      maxDiffPixels: 60,
      threshold: 0.12
    });
  });

  test('Status table with all columns', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoStatus = new CryptoStatus(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Azerbaijan');
    await cryptoStatus.openStatusTab();

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Mask time-sensitive data
    await page.addStyleTag({
      content: `
        [class*="date"],
        [class*="time"],
        .last-update {
          visibility: hidden !important;
        }
      `
    });

    // Capture status table
    const statusTable = page.locator('table').first();
    await expect(statusTable).toHaveScreenshot('visual-status-table.png', {
      animations: 'disabled',
      maxDiffPixels: 100,
      threshold: 0.2
    });
  });
});

test.describe('Visual Regression - UI State Changes', () => {
  
  test('Button states - Expand All vs Collapse All', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Canada');

    // Capture Expand All button
    const expandButton = page.locator('button:has-text("Expand All")').first();
    await expect(expandButton).toHaveScreenshot('visual-expand-all-button.png', {
      animations: 'disabled'
    });

    // Click to expand
    await cryptoResults.clickExpandAllButton();
    await page.waitForTimeout(500);

    // Capture Collapse All button
    const collapseButton = page.locator('button:has-text("Collapse All")').first();
    await expect(collapseButton).toHaveScreenshot('visual-collapse-all-button.png', {
      animations: 'disabled'
    });
  });

  test('Tab navigation - Active vs inactive tabs', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoDefinitions = new CryptoDefinitions(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();

    // Capture tabs container
    const tabsContainer = page.locator('[class*="tabs"], [role="tablist"]').first();
    await expect(tabsContainer).toHaveScreenshot('visual-tabs-results-active.png', {
      animations: 'disabled'
    });

    // Switch to Definitions tab
    await cryptoDefinitions.openDefinitionsTab();
    await page.waitForTimeout(500);

    // Capture with Definitions tab active
    await expect(tabsContainer).toHaveScreenshot('visual-tabs-definitions-active.png', {
      animations: 'disabled'
    });
  });
});
