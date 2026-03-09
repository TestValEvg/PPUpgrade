import { test, expect } from '@playwright/test';
import { CryptoFavorites } from '../Pages/crypto.favorites.page';

/**
 * Crypto Favorites Tests
 * Tests saving and loading favorites in Crypto Reviewer
 * Tests are excluded from CI/CD (see playwright-tests.yml)
 */

test.describe('Crypto Favorites Tests', () => {

    test('User can search with random jurisdiction and token type selection', async ({ page }) => {
        test.setTimeout(600000); // 10 minutes timeout

        const cryptoFavorites = new CryptoFavorites(page);

        // Step 1: Login
        await cryptoFavorites.login();
        
        // Step 2: Navigate to Crypto
        await cryptoFavorites.navigateToCrypto();
        
        // Step 3: Select random jurisdiction
        const randomJurisdiction = cryptoFavorites.getRandomJurisdiction();
        console.log(`Random jurisdiction selected: ${randomJurisdiction}`);
        await cryptoFavorites.selectJurisdiction(randomJurisdiction);
        
        // Step 4: Select random token type
        const randomTokenType = cryptoFavorites.getRandomTokenType();
        console.log(`Random token type selected: ${randomTokenType}`);
        await cryptoFavorites.selectTokenType(randomTokenType);
        
        // Step 5: Click Search
        await cryptoFavorites.clickSearch();
        
        // Step 6: Wait for results
        await cryptoFavorites.waitForResults();
        
        console.log(`Search completed successfully with: ${randomJurisdiction} - ${randomTokenType}`);        
        
        // Step 7: Save as favorite (with retry if already exists)
        const savedName = await cryptoFavorites.saveFavoriteWithRetry();
        console.log(`Favorite saved with name: ${savedName}`);
        
        // Step 8: Reload page and verify favorite was saved correctly
        await cryptoFavorites.loadFavoriteAndVerify(savedName);
        console.log(`✓ Favorite verification complete: ${savedName}`);
    });

    test('User can delete a saved favorite', async ({ page }) => {
        test.setTimeout(600000); // 10 minutes timeout

        const cryptoFavorites = new CryptoFavorites(page);

        // Step 1: Login
        await cryptoFavorites.login();
        
        // Step 2: Navigate to Crypto
        await cryptoFavorites.navigateToCrypto();
        
        // Step 3: Select random jurisdiction
        const randomJurisdiction = cryptoFavorites.getRandomJurisdiction();
        console.log(`Random jurisdiction selected: ${randomJurisdiction}`);
        await cryptoFavorites.selectJurisdiction(randomJurisdiction);
        
        // Step 4: Select random token type
        const randomTokenType = cryptoFavorites.getRandomTokenType();
        console.log(`Random token type selected: ${randomTokenType}`);
        await cryptoFavorites.selectTokenType(randomTokenType);
        
        // Step 5: Click Search
        await cryptoFavorites.clickSearch();
        
        // Step 6: Wait for results
        await cryptoFavorites.waitForResults();
        
        console.log(`Search completed successfully with: ${randomJurisdiction} - ${randomTokenType}`);        
        
        // Step 7: Save as favorite (with retry if already exists)
        const savedName = await cryptoFavorites.saveFavoriteWithRetry();
        console.log(`Favorite saved with name: ${savedName}`);
        
        // Step 8: Reload page and delete the favorite
        await cryptoFavorites.deleteFavoriteWorkflow(savedName);
        console.log(`✓ Favorite deletion complete: ${savedName}`);
    });

    test('User can navigate to Definitions view after search', async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout

        const cryptoFavorites = new CryptoFavorites(page);

        await cryptoFavorites.login();
        await cryptoFavorites.navigateToCrypto();

        // Select a jurisdiction and token type
        const jurisdiction = cryptoFavorites.getRandomJurisdiction();
        const tokenType = cryptoFavorites.getRandomTokenType();
        
        await cryptoFavorites.selectJurisdiction(jurisdiction);
        await cryptoFavorites.selectTokenType(tokenType);
        await cryptoFavorites.clickSearch();
        await cryptoFavorites.waitForResults();

        // Navigate to Definitions tab
        const definitionsTab = page.locator('span.s-tab__title:has-text("Definitions")');
        await definitionsTab.waitFor({ state: 'visible' });
        await definitionsTab.click();
        
        // Verify Definitions view is loaded
        await expect(page.locator('span.s-table__header-label:has-text("Term")')).toBeVisible();
        console.log('✓ Definitions view loaded successfully');
    });

    test('User can navigate to Status view after search', async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout

        const cryptoFavorites = new CryptoFavorites(page);

        await cryptoFavorites.login();
        await cryptoFavorites.navigateToCrypto();

        // Select a jurisdiction and token type
        const jurisdiction = cryptoFavorites.getRandomJurisdiction();
        const tokenType = cryptoFavorites.getRandomTokenType();
        
        await cryptoFavorites.selectJurisdiction(jurisdiction);
        await cryptoFavorites.selectTokenType(tokenType);
        await cryptoFavorites.clickSearch();
        await cryptoFavorites.waitForResults();

        // Navigate to Status tab
        const statusTab = page.locator('span.s-tab__title:has-text("Status")');
        await statusTab.waitFor({ state: 'visible' });
        await statusTab.click();
        
        // Verify Status view is loaded
        await expect(page.locator('th.s-table__header--flag-label span.s-table__header-label:has-text("Jurisdiction")')).toBeVisible();
        console.log('✓ Status view loaded successfully');
    });

    test('User can navigate to Contacts view after search', async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout

        const cryptoFavorites = new CryptoFavorites(page);

        await cryptoFavorites.login();
        await cryptoFavorites.navigateToCrypto();

        // Select a jurisdiction and token type
        const jurisdiction = cryptoFavorites.getRandomJurisdiction();
        const tokenType = cryptoFavorites.getRandomTokenType();
        
        await cryptoFavorites.selectJurisdiction(jurisdiction);
        await cryptoFavorites.selectTokenType(tokenType);
        await cryptoFavorites.clickSearch();
        await cryptoFavorites.waitForResults();

        // Navigate to Contacts tab
        const contactsTab = page.locator('span.s-tab__title:has-text("Contacts")');
        await contactsTab.waitFor({ state: 'visible' });
        await contactsTab.click();
        
        // Verify Contacts view is loaded
        await expect(page.locator('span.s-table__header-label:has-text("Jurisdiction")')).toBeVisible();
        console.log('✓ Contacts view loaded successfully');
    });
});
