import { test, expect } from '@playwright/test';
import { CryptoFavorites } from '../Pages/crypto.favorites.page';

/**
 * Crypto Favorites Tests
 * Tests saving and loading favorites in Crypto Reviewer
 * Tests are excluded from CI/CD (see playwright-tests.yml)
 */

test.describe('Crypto Favorites Tests', () => {

    test('User can search with random jurisdiction and token type selection', async ({ page }) => {
        test.setTimeout(1800000); // 30 minutes timeout

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
        test.setTimeout(1800000); // 30 minutes timeout

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
});
