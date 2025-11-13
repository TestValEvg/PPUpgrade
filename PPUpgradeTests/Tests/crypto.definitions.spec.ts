import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoDefinitions } from '../Pages/crypto.definitions';

test('User can open Definitions tab from Crypto results and see Term header', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoDefinitions = new CryptoDefinitions(page);

  await loginPage.navigate();
  await loginPage.login();

  await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

  await cryptoResults.navigateToCrypto();
  await cryptoResults.viewCryptoData();
  await cryptoResults.searchByJurisdiction('Canada');

  // Step 3: Switch to Definitions and verify Term header
  await cryptoDefinitions.openDefinitionsTab();
});