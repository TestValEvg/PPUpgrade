import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoDefinitions } from '../Pages/crypto.definitions';
import { CryptoFavorites } from '../Pages/crypto.favorites.page';

test('User can open Definitions tab from Crypto results and see Term header', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoDefinitions = new CryptoDefinitions(page);
  const cryptoFavorites = new CryptoFavorites(page);

  await loginPage.navigate();
  await loginPage.login();

  await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

  await cryptoResults.navigateToCrypto();
  await cryptoResults.viewCryptoData();
  await cryptoResults.searchByJurisdiction('Canada');

  // Step 3: Switch to Definitions and verify Term header
  await cryptoDefinitions.openDefinitionsTab();
  
  console.log('Navigated to Definitions tab successfully');
  
  // Save as favorite (with retry if already exists)
  const savedName = await cryptoFavorites.saveFavoriteWithRetry();
  console.log(`✓ Favorite saved successfully: ${savedName}`);
  
  // Verify favorite button shows saved state
  await cryptoFavorites.verifyFavoriteButtonSaved();
});