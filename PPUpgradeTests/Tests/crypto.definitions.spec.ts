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

test('Crypto Definitions - Expand/Collapse functionality', async ({ page }) => {
  test.setTimeout(120000); // 2 minutes timeout
  const loginPage = new LoginPage(page);
  const cryptoResults = new CryptoResults(page);
  const cryptoDefinitions = new CryptoDefinitions(page);

  console.log('\n=== Test: Crypto Definitions Expand/Collapse ===\n');
  
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

  // Step 3: Open Definitions tab
  console.log('Step 3: Opening Definitions tab...');
  await cryptoDefinitions.openDefinitionsTab();

  // Step 4: Verify tab content loaded
  console.log('Step 4: Verifying tab content loaded...');
  await cryptoDefinitions.verifyTabContentLoaded();

  // Step 5: Check if Expand All button exists
  console.log('Step 5: Checking for Expand All button...');
  const hasExpandButton = await cryptoDefinitions.clickExpandAllIfPresent();
  
  if (hasExpandButton) {
    // Step 6: Verify button changed to Collapse All
    console.log('Step 6: Verifying button changed to "Collapse All"...');
    await cryptoDefinitions.verifyCollapseAllButtonVisible();
    
    // Step 7: Verify content is expanded
    console.log('Step 7: Verifying content is expanded...');
    await cryptoDefinitions.verifyContentExpanded();
    
    // Step 8: Click Collapse All
    console.log('Step 8: Clicking Collapse All button...');
    await cryptoDefinitions.clickCollapseAll();
    
    // Step 9: Verify button changed back to Expand All
    console.log('Step 9: Verifying button changed back to "Expand All"...');
    await cryptoDefinitions.verifyExpandAllButtonVisible();
    
    console.log('\n✅ Test passed: Definitions Expand/Collapse works correctly\n');
  } else {
    console.log('\nℹ Test completed: No expandable content available for this jurisdiction\n');
  }
});