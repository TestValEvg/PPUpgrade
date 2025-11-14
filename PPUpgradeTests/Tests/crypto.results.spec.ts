import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoDefinitions } from '../Pages/crypto.definitions';

test.describe('Crypto Results Functional Tests', () => {
  test('User can see Crypto results filtered by Jurisdiction ', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    await loginPage.navigate();
    await loginPage.login();

    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Canada');

  });

  test('Expand All button appears and expands all results on Results and Definitions pages', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoDefinitions = new CryptoDefinitions(page);

    // Step 1: Login
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    // Step 2: Navigate to Crypto and search
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Azerbaijan');

    // Step 3: Verify Expand All button appears on Results page
    await cryptoResults.verifyExpandAllButtonVisible();

    // Step 4: Click Expand All button on Results page
    await cryptoResults.clickExpandAllButton();

    // Step 5: Verify button changes to Collapse All on Results page
    await cryptoResults.verifyCollapseAllButtonVisible();

    // Step 6: Click on Definitions tab
    await cryptoDefinitions.openDefinitionsTab();

    // Step 7: Verify Expand All button is present on Definitions page
    await cryptoResults.verifyExpandAllButtonVisible();

    // Step 8: Click Expand All button on Definitions page
    await cryptoResults.clickExpandAllButton();

    // Step 9: Verify button changes to Collapse All
    await cryptoResults.verifyCollapseAllButtonVisible();

    // Step 10: Click Collapse All button
    await cryptoResults.clickCollapseAllButton();

    // Step 11: Verify button changes back to Expand All
    await cryptoResults.verifyExpandAllButtonVisible();
  });
});

test.describe('Crypto Results Visual Regression Tests', () => {
  test('Results page with filtered jurisdiction should render correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup: Login and navigate
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    // Navigate to results
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Canada');

    // Wait for results to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Mask dynamic content (timestamps, prices, etc.)
    await page.addStyleTag({
      content: `
        .timestamp,
        .last-updated,
        [data-testid="date"],
        .dynamic-price {
          visibility: hidden !important;
        }
      `
    });

    // Capture results page screenshot
    await expect(page).toHaveScreenshot('crypto-results-filtered-jurisdiction.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
      threshold: 0.15
    });
  });

  test.skip('Results page with expanded items should render correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    // Navigate and search
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoResults.searchByJurisdiction('Azerbaijan');

    // Expand all items
    await cryptoResults.clickExpandAllButton();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Mask dynamic content
    await page.addStyleTag({
      content: `
        .timestamp,
        .live-data,
        [data-dynamic="true"] {
          visibility: hidden !important;
        }
      `
    });

    // Capture expanded state
    await expect(page).toHaveScreenshot('crypto-results-expanded.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 100,
      threshold: 0.15
    });
  });

  test.skip('Definitions tab should render correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);
    const cryptoDefinitions = new CryptoDefinitions(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    // Navigate to Definitions
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    await cryptoDefinitions.openDefinitionsTab();

    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Capture Definitions tab screenshot
    await expect(page).toHaveScreenshot('crypto-definitions-tab.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 50,
      threshold: 0.2
    });
  });
});