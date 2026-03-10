import { test, expect } from '@playwright/test';
import { NavigatorFavorites } from '../Pages/navigator.favorites.page';

/**
 * Navigator Favorites Tests
 * Tests the favorites functionality for Navigator Jurisdiction Analysis and Static Views
 */

test.describe('Navigator Favorites Tests', () => {
    
    test.beforeEach(async ({ page }) => {
        // Set longer timeout for each test
        test.setTimeout(600000); // 10 minutes
    });

    test('User can save a favorite with random jurisdiction and service', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Step 1: Login
        await navigatorFavorites.login();

        // Step 2: Navigate to Navigator
        await navigatorFavorites.navigateToNavigator();

        // Step 3: Randomly select a jurisdiction
        const randomJurisdiction = navigatorFavorites.getRandomJurisdiction();
        console.log(`Random jurisdiction selected: ${randomJurisdiction}`);
        await navigatorFavorites.selectJurisdiction(randomJurisdiction);

        // Step 4: Randomly select a service
        const randomService = navigatorFavorites.getRandomService();
        console.log(`Random service selected: ${randomService}`);
        await navigatorFavorites.selectService(randomService);

        // Step 5: Click search button
        await navigatorFavorites.clickSearch();

        // Step 6: Wait for results to appear
        await navigatorFavorites.waitForResults();

        // Verify that results are displayed
        await expect(page.getByText('JURISDICTION ANALYSIS')).toBeVisible();
        
        console.log(`Search completed successfully with: ${randomJurisdiction} - ${randomService}`);
        
        // Step 7: Save as favorite (with retry if already exists)
        const savedName = await navigatorFavorites.saveFavoriteWithRetry();
        console.log(`✓ Favorite saved successfully: ${savedName}`);
        
        // Verify favorite button shows saved state
        await navigatorFavorites.verifyFavoriteButtonSaved();
    });

    test('User can load and verify a saved favorite', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Step 1: Login
        await navigatorFavorites.login();

        // Step 2: Navigate to Navigator
        await navigatorFavorites.navigateToNavigator();

        // Step 3: Select random jurisdiction and service to create a favorite
        const randomJurisdiction = navigatorFavorites.getRandomJurisdiction();
        await navigatorFavorites.selectJurisdiction(randomJurisdiction);
        
        const randomService = navigatorFavorites.getRandomService();
        await navigatorFavorites.selectService(randomService);
        
        await navigatorFavorites.clickSearch();
        await navigatorFavorites.waitForResults();
        
        // Step 4: Save the favorite
        const savedName = await navigatorFavorites.saveFavoriteWithRetry();
        console.log(`Favorite created for verification: ${savedName}`);
        
        // Step 5: Reload page and verify favorite was saved and can be loaded
        await navigatorFavorites.loadFavoriteAndVerify(savedName);
        console.log(`✓ Favorite loaded and verified successfully: ${savedName}`);
    });

    test('User can delete a saved favorite', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Step 1: Login
        await navigatorFavorites.login();

        // Step 2: Navigate to Navigator
        await navigatorFavorites.navigateToNavigator();

        // Step 3: Randomly select a jurisdiction
        const randomJurisdiction = navigatorFavorites.getRandomJurisdiction();
        console.log(`Random jurisdiction selected: ${randomJurisdiction}`);
        await navigatorFavorites.selectJurisdiction(randomJurisdiction);

        // Step 4: Randomly select a service
        const randomService = navigatorFavorites.getRandomService();
        console.log(`Random service selected: ${randomService}`);
        await navigatorFavorites.selectService(randomService);

        // Step 5: Click search button
        await navigatorFavorites.clickSearch();

        // Step 6: Wait for results to appear
        await navigatorFavorites.waitForResults();

        // Verify that results are displayed
        await expect(page.getByText('JURISDICTION ANALYSIS')).toBeVisible();
        
        console.log(`Search completed successfully with: ${randomJurisdiction} - ${randomService}`);
        
        // Step 7: Save as favorite (with retry if already exists)
        const savedName = await navigatorFavorites.saveFavoriteWithRetry();
        console.log(`Favorite saved with name: ${savedName}`);
        
        // Step 8: Reload page and delete the favorite
        await navigatorFavorites.deleteFavoriteWorkflow(savedName);
        console.log(`✓ Favorite deletion complete: ${savedName}`);
    });

    test('User can navigate to Definitions static view after search', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Login and perform search
        await navigatorFavorites.login();
        await navigatorFavorites.navigateToNavigator();
        
        const randomJurisdiction = navigatorFavorites.getRandomJurisdiction();
        await navigatorFavorites.selectJurisdiction(randomJurisdiction);
        
        const randomService = navigatorFavorites.getRandomService();
        await navigatorFavorites.selectService(randomService);
        
        await navigatorFavorites.clickSearch();
        await navigatorFavorites.waitForResults();

        // Navigate to Definitions tab
        await navigatorFavorites.navigateToDefinitions();
        
        console.log('Navigated to Definitions tab successfully');
        
        // Save as favorite (with retry if already exists)
        const savedName = await navigatorFavorites.saveFavoriteWithRetry();
        console.log(`✓ Favorite saved successfully: ${savedName}`);
        
        // Verify favorite button shows saved state
        await navigatorFavorites.verifyFavoriteButtonSaved();
    });

    test('User can navigate to Status static view after search', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Login and perform search
        await navigatorFavorites.login();
        await navigatorFavorites.navigateToNavigator();
        
        const randomJurisdiction = navigatorFavorites.getRandomJurisdiction();
        await navigatorFavorites.selectJurisdiction(randomJurisdiction);
        
        const randomService = navigatorFavorites.getRandomService();
        await navigatorFavorites.selectService(randomService);
        
        await navigatorFavorites.clickSearch();
        await navigatorFavorites.waitForResults();

        // Navigate to Status tab
        await navigatorFavorites.navigateToStatus();

        // Verify Status tab is active
        const statusTab = page.locator('button.static-tab-button', { hasText: 'Status' });
        await expect(statusTab).toHaveClass(/active/);
        
        console.log('Navigated to Status tab successfully');
        
        // Save as favorite (with retry if already exists)
        const savedName = await navigatorFavorites.saveFavoriteWithRetry();
        console.log(`✓ Favorite saved successfully: ${savedName}`);
        
        // Verify favorite button shows saved state
        await navigatorFavorites.verifyFavoriteButtonSaved();
    });

    test('User can navigate to Legends static view after search', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Login and perform search
        await navigatorFavorites.login();
        await navigatorFavorites.navigateToNavigator();
        
        const randomJurisdiction = navigatorFavorites.getRandomJurisdiction();
        await navigatorFavorites.selectJurisdiction(randomJurisdiction);
        
        const randomService = navigatorFavorites.getRandomService();
        await navigatorFavorites.selectService(randomService);
        
        await navigatorFavorites.clickSearch();
        await navigatorFavorites.waitForResults();

        // Navigate to Legends tab
        await navigatorFavorites.navigateToLegends();

        // Verify Legends tab is active
        const legendsTab = page.locator('button.static-tab-button', { hasText: 'Legends' });
        await expect(legendsTab).toHaveClass(/active/);
        
        console.log('Navigated to Legends tab successfully');
    });

    test('User can navigate to Contacts static view after search', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Login and perform search
        await navigatorFavorites.login();
        await navigatorFavorites.navigateToNavigator();
        
        const randomJurisdiction = navigatorFavorites.getRandomJurisdiction();
        await navigatorFavorites.selectJurisdiction(randomJurisdiction);
        
        const randomService = navigatorFavorites.getRandomService();
        await navigatorFavorites.selectService(randomService);
        
        await navigatorFavorites.clickSearch();
        await navigatorFavorites.waitForResults();

        // Navigate to Contacts tab
        await navigatorFavorites.navigateToContacts();

        // Verify Contacts tab is active
        const contactsTab = page.locator('button.static-tab-button', { hasText: 'Contacts' });
        await expect(contactsTab).toHaveClass(/active/);
        
        console.log('Navigated to Contacts tab successfully');
        
        // Save as favorite (with retry if already exists)
        const savedName = await navigatorFavorites.saveFavoriteWithRetry();
        console.log(`✓ Favorite saved successfully: ${savedName}`);
        
        // Verify favorite button shows saved state
        await navigatorFavorites.verifyFavoriteButtonSaved();
    });

    test('Product-Service relationship test', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Login and navigate to Navigator
        await navigatorFavorites.login();
        await navigatorFavorites.navigateToNavigator();

        // Select a jurisdiction (required for service options to load)
        const jurisdiction = navigatorFavorites.getRandomJurisdiction();
        console.log(`Selected jurisdiction: ${jurisdiction}`);
        await navigatorFavorites.selectJurisdiction(jurisdiction);

        // Test each service and verify its products
        const services = ['Banking', 'Corporate Finance', 'Derivatives & FX', 'Funds', 'Lending', 'Securities'];
        
        for (const service of services) {
            console.log(`\n========== Testing Service: ${service} ==========`);
            
            // Select the service
            await navigatorFavorites.selectService(service);
            
            // Open Product dropdown
            await navigatorFavorites.clickProductDropdown();
            
            // Verify products match expected list
            const isCorrect = await navigatorFavorites.verifyProductsForService(service);
            
            // Assert that products match
            expect(isCorrect).toBe(true);
            
            // Close dropdown before next iteration
            await navigatorFavorites.clickOutside();
            await page.waitForTimeout(1000);
        }
        
        console.log('\n✓ All Service-Product relationships verified successfully');
    });

    test('Favorite with product - save and verify product selection persists', async ({ page }) => {
        const navigatorFavorites = new NavigatorFavorites(page);

        // Step 1: Login
        await navigatorFavorites.login();

        // Step 2: Navigate to Navigator
        await navigatorFavorites.navigateToNavigator();

        // Step 3: Randomly select a jurisdiction
        const randomJurisdiction = navigatorFavorites.getRandomJurisdiction();
        console.log(`Random jurisdiction selected: ${randomJurisdiction}`);
        await navigatorFavorites.selectJurisdiction(randomJurisdiction);

        // Step 4: Randomly select a service that has products
        const randomService = navigatorFavorites.getRandomServiceWithProducts();
        console.log(`Random service with products selected: ${randomService}`);
        await navigatorFavorites.selectService(randomService);

        // Step 5: Get all available products for this service
        const availableProducts = navigatorFavorites.getAvailableProductsForService(randomService);
        console.log(`Available products for ${randomService}:`, availableProducts);
        
        // Pick ONE random product to KEEP selected (using existing method)
        const productToKeep = navigatorFavorites.getRandomProduct(randomService);
        console.log(`Product to keep selected: ${productToKeep}`);
        navigatorFavorites.selectedProduct = productToKeep;
        
        // Get all OTHER products that need to be unselected
        const productsToUnselect = availableProducts.filter(p => p !== productToKeep);
        console.log(`Products to unselect (by clicking them):`, productsToUnselect);
        
        // Step 6: Unselect all other products (click to unselect - "All" is default)
        if (productsToUnselect.length > 0) {
            await navigatorFavorites.unselectProducts(productsToUnselect);
        }

        // Step 7: Click search button
        await navigatorFavorites.clickSearch();

        // Step 8: Wait for results to appear
        await navigatorFavorites.waitForResults();

        // Verify that results are displayed
        await expect(page.getByText('JURISDICTION ANALYSIS')).toBeVisible();
        
        console.log(`Search completed successfully with: ${randomJurisdiction} - ${randomService} - ${productToKeep}`);
        
        // Step 9: Save as favorite (with retry if already exists, handling products)
        const savedName = await navigatorFavorites.saveFavoriteWithRetry(undefined, 3, true);
        console.log(`Favorite saved with name: ${savedName}`);
        
        // Step 10: Reload page
        await navigatorFavorites.reloadPage();
        
        // Step 11: Navigate back to Navigator
        await navigatorFavorites.navigateToNavigator();
        
        // Step 12: Open favorites dropdown
        await navigatorFavorites.clickFavoritesDropdownButton();
        await navigatorFavorites.waitForFavoritesDropdown();
        
        // Step 13: Verify favorite exists
        const favoriteExists = await navigatorFavorites.verifyFavoriteInDropdown(savedName);
        expect(favoriteExists).toBe(true);
        console.log(`✓ Favorite found in dropdown: ${savedName}`);
        
        // Step 14: Click on favorite and search
        await navigatorFavorites.clickFavoriteInDropdown(savedName, true);
        
        // Step 15: Wait for search results
        await navigatorFavorites.waitForResults();
        
        // Step 16: Verify jurisdiction, service, and product selections are correct
        // Use the ACTUAL saved selections from page object (in case saveFavoriteWithRetry changed them)
        const actualJurisdiction = navigatorFavorites.selectedJurisdiction;
        const actualService = navigatorFavorites.selectedService;
        const actualProduct = navigatorFavorites.selectedProduct;
        
        console.log(`Verifying saved selections...`);
        console.log(`  Expected: ${actualJurisdiction} - ${actualService} - ${actualProduct}`);
        
        // Verify jurisdiction in results grid
        const jurisdictionInGrid = page.locator('div.s-grid__item').filter({ hasText: actualJurisdiction }).first();
        await expect(jurisdictionInGrid).toBeVisible();
        console.log(`✓ Jurisdiction verified in results: ${actualJurisdiction}`);
        
        // Verify service in results grid
        const serviceInGrid = page.locator('div.s-grid__item').filter({ hasText: actualService }).first();
        await expect(serviceInGrid).toBeVisible();
        console.log(`✓ Service verified in results: ${actualService}`);
        
        // Verify product selection persists
        const productVerified = await navigatorFavorites.verifyProductSelection(actualProduct);
        expect(productVerified).toBe(true);
        console.log(`✓ Product verified: ${actualProduct}`);
        
        console.log(`\n✓ Favorite with product fully verified: ${savedName}`);
        console.log(`  Jurisdiction: ${actualJurisdiction}`);
        console.log(`  Service: ${actualService}`);
        console.log(`  Product: ${actualProduct}`);
    });
});
