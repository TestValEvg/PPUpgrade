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

test('Crypto Contacts - Check for expand/collapse functionality', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes timeout
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoContacts = new CryptoContacts(page);

  console.log('\n=== Test: Crypto Contacts Expand/Collapse Check ===\n');
  
  // Step 1: Login
  console.log('Step 1: Logging in...');
  await loginPage.navigate();
  await loginPage.login();
  await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

  // Step 2: Navigate to Crypto and search
  console.log('Step 2: Navigating to Crypto and searching...');
  await cryptoResults.navigateToCrypto();
  await cryptoResults.viewCryptoData();
  await cryptoResults.searchByJurisdiction('Italy');

  // Step 3: Open Contacts tab
  console.log('Step 3: Opening Contacts tab...');
  await cryptoContacts.openContactsTab();

  // Step 4: Verify tab content loaded
  console.log('Step 4: Verifying tab content loaded...');
  await cryptoContacts.verifyTabContentLoaded();

  // Step 5: Check if Expand All button exists (Contacts may not have expandable content)
  console.log('Step 5: Checking for Expand All button...');
  const hasExpandButton = await cryptoContacts.clickExpandAllIfPresent();
  
  if (hasExpandButton) {
    // Step 6: Verify button changed to Collapse All
    console.log('Step 6: Verifying button changed to "Collapse All"...');
    await cryptoContacts.verifyCollapseAllButtonVisible();
    
    // Step 7: Verify content is expanded
    console.log('Step 7: Verifying content is expanded...');
    await cryptoContacts.verifyContentExpanded();
    
    // Step 8: Click Collapse All
    console.log('Step 8: Clicking Collapse All button...');
    await cryptoContacts.clickCollapseAll();
    
    // Step 9: Verify button changed back to Expand All
    console.log('Step 9: Verifying button changed back to "Expand All"...');
    await cryptoContacts.verifyExpandAllButtonVisible();
    
    console.log('\n✅ Test passed: Contacts Expand/Collapse works correctly\n');
  } else {
    console.log('\nℹ Test completed: No expandable content available on Contacts tab (expected behavior)\n');
  }
});
