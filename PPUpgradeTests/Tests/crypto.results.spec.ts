import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoDefinitions } from '../Pages/crypto.definitions';

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