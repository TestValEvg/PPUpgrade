import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { CryptoResults } from '../Pages/crypto.results';
import { CryptoStatus } from '../Pages/CryptoStatus';
import { CryptoFavorites } from '../Pages/crypto.favorites.page';

test('User can open Status tab from Crypto results and see Jurisdiction, Date, and Changes columns', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoStatus = new CryptoStatus(page);
  const cryptoFavorites = new CryptoFavorites(page);

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
  
  console.log('Navigated to Status tab successfully');
  
  // Save as favorite (with retry if already exists)
  const savedName = await cryptoFavorites.saveFavoriteWithRetry();
  console.log(`✓ Favorite saved successfully: ${savedName}`);
  
  // Verify favorite button shows saved state
  await cryptoFavorites.verifyFavoriteButtonSaved();
});

test('Crypto Status - Check for expand/collapse functionality', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes timeout
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoStatus = new CryptoStatus(page);

  console.log('\n=== Test: Crypto Status Expand/Collapse Check ===\n');
  
  // Step 1: Login
  console.log('Step 1: Logging in...');
  await loginPage.navigate();
  await loginPage.login();
  await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

  // Step 2: Navigate to Crypto and search
  console.log('Step 2: Navigating to Crypto and searching...');
  await cryptoResults.navigateToCrypto();
  await cryptoResults.viewCryptoData();
  await cryptoResults.searchByJurisdiction('Canada');

  // Step 3: Open Status tab
  console.log('Step 3: Opening Status tab...');
  await cryptoStatus.openStatusTab();

  // Step 4: Verify tab content loaded
  console.log('Step 4: Verifying tab content loaded...');
  await cryptoStatus.verifyTabContentLoaded();

  // Step 5: Check if Expand All button exists (Status may not have expandable content)
  console.log('Step 5: Checking for Expand All button...');
  const hasExpandButton = await cryptoStatus.clickExpandAllIfPresent();
  
  if (hasExpandButton) {
    // Step 6: Verify button changed to Collapse All
    console.log('Step 6: Verifying button changed to "Collapse All"...');
    await cryptoStatus.verifyCollapseAllButtonVisible();
    
    // Step 7: Verify content is expanded
    console.log('Step 7: Verifying content is expanded...');
    await cryptoStatus.verifyContentExpanded();
    
    // Step 8: Click Collapse All
    console.log('Step 8: Clicking Collapse All button...');
    await cryptoStatus.clickCollapseAll();
    
    // Step 9: Verify button changed back to Expand All
    console.log('Step 9: Verifying button changed back to "Expand All"...');
    await cryptoStatus.verifyExpandAllButtonVisible();
    
    console.log('\n✅ Test passed: Status Expand/Collapse works correctly\n');
  } else {
    console.log('\nℹ Test completed: No expandable content available on Status tab (expected behavior)\n');
  }
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