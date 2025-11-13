import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoDefinitions } from '../Pages/crypto.definitions';
import { CryptoStatus } from '../Pages/CryptoStatus';

/**
 * Visual Regression Tests
 * 
 * These tests capture and compare visual snapshots of the application's UI.
 * On first run, baseline screenshots are created.
 * On subsequent runs, new screenshots are compared pixel-by-pixel to baselines.
 * 
 * To update baselines after intentional UI changes:
 * npx playwright test --project=chromium -u visual.spec.ts
 */

test.describe('Visual Regression Tests', () => {
  
  test('Login page screenshot', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Navigate to login page
    await loginPage.navigate();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Capture login page
    await expect(page).toHaveScreenshot('01-login-page.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });

  test('Results page after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    
    // Navigate to results
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();

    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Capture page screenshot
    await expect(page).toHaveScreenshot('02-results-page-loaded.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });

  test('Results page with single jurisdiction filter', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    
    // Apply single jurisdiction filter
    await cryptoResults.searchByJurisdiction('Bahrain');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Capture filtered results
    await expect(page).toHaveScreenshot('03-results-filtered-single.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });

  test('Results page with multiple jurisdiction filters', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const cryptoResults = new CryptoResults(page);

    // Setup
    await loginPage.navigate();
    await loginPage.login();
    await cryptoResults.navigateToCrypto();
    await cryptoResults.viewCryptoData();
    
    // Apply multiple jurisdiction filters
    await cryptoResults.searchByMultipleJurisdictions(['Azerbaijan', 'Bahrain']);

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Capture multi-filtered results
    await expect(page).toHaveScreenshot('04-results-filtered-multiple.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });



  test('Dashboard after logout', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Setup and login
    await loginPage.navigate();
    await loginPage.login();

    // Navigate away and back
    await page.goto('https://crypto-demo.testvaluation.com/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Capture dashboard
    await expect(page).toHaveScreenshot('07-dashboard-page.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });
});
