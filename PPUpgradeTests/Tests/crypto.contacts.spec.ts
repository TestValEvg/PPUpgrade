import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoContacts } from '../Pages/crypto.contacts';
import { CryptoFavorites } from '../Pages/crypto.favorites.page';

test('User can open Contacts tab and verify selected jurisdiction is present', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoContacts = new CryptoContacts(page);
  const cryptoFavorites = new CryptoFavorites(page);

  await loginPage.navigate();
  await loginPage.login();

  await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

  await cryptoResults.navigateToCrypto();
  await cryptoResults.viewCryptoData();
  await cryptoResults.searchByJurisdiction('Canada');

  // Open Contacts tab and verify jurisdiction
  await cryptoContacts.openContactsTab();
  await cryptoContacts.verifyJurisdictionOnContactsPage('Canada');
  
  console.log('Navigated to Contacts tab successfully');
  
  // Save as favorite (with retry if already exists)
  const savedName = await cryptoFavorites.saveFavoriteWithRetry();
  console.log(`✓ Favorite saved successfully: ${savedName}`);
  
  // Verify favorite button shows saved state
  await cryptoFavorites.verifyFavoriteButtonSaved();
});
