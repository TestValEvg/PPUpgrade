import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoStatus } from '../Pages/CryptoStatus';

test('User can open Status tab from Crypto results and see Jurisdiction, Date, and Changes columns', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoStatus = new CryptoStatus(page);

  // Step 1: Login
  await loginPage.navigate();
  await loginPage.login();
  await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

  // Step 2: Go to Crypto and perform jurisdiction search
  await cryptoResults.navigateToCrypto();
  await cryptoResults.viewCryptoData();
  await cryptoResults.searchByJurisdiction('Canada');

  // Step 3: Open the Status tab and check headers
  await cryptoStatus.openStatusTab();

  // Step 4: Verify that the table contains data rows
  await cryptoStatus.verifyStatusDataVisible();
});

test.skip('Search with 2 jurisdictions shows Status view message and redirects to Status page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoStatus = new CryptoStatus(page);

  // Step 1: Login
  await loginPage.navigate();
  await loginPage.login();
  await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

  // Step 2: Go to Crypto and search with 2 jurisdictions
  await cryptoResults.navigateToCrypto();
  await cryptoResults.viewCryptoData();
  await cryptoResults.searchByMultipleJurisdictions(['Azerbaijan', 'Bahrain']);

  // Step 3: Verify message about Status view
  await cryptoResults.verifyMultiJurisdictionStatusMessage();

  // Step 4: Click Status view link
  await cryptoResults.clickStatusViewLink();

  // Step 5: Wait longer and verify redirects to Status tab and Status page is visible
  await page.waitForTimeout(2000);
  await cryptoStatus.verifyStatusTabIsVisible();
});