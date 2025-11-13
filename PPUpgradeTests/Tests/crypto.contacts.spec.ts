import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoContacts } from '../Pages/crypto.contacts';

test('User can open Contacts tab and verify selected jurisdiction is present', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoContacts = new CryptoContacts(page);

  await loginPage.navigate();
  await loginPage.login();

  await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

  await cryptoResults.navigateToCrypto();
  await cryptoResults.viewCryptoData();
  await cryptoResults.searchByJurisdiction('Canada');

  // Open Contacts tab and verify jurisdiction
  await cryptoContacts.openContactsTab();
  await cryptoContacts.verifyJurisdictionOnContactsPage('Canada');
});
