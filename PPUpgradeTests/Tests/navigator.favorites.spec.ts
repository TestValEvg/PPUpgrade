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

    test('User can search with random jurisdiction and service selection', async ({ page }) => {
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

        // Step 5: Wait for results to appear
        await navigatorFavorites.waitForResults();

        // Verify that results are displayed
        await expect(page.getByText('JURISDICTION ANALYSIS')).toBeVisible();
        
        console.log(`Search completed successfully with: ${randomJurisdiction} - ${randomService}`);        
        // Step 7: Save as favorite (with retry if already exists)
        const savedName = await navigatorFavorites.saveFavoriteWithRetry();
        console.log(`Favorite saved with name: ${savedName}`);
        
        // Step 8: Reload page and verify favorite was saved correctly
        await navigatorFavorites.loadFavoriteAndVerify(savedName);
        console.log(`✓ Favorite verification complete: ${savedName}`);
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

        // Verify Definitions tab is active
        const definitionsTab = page.getByRole('tab', { name: 'Definitions' });
        await expect(definitionsTab).toHaveAttribute('aria-selected', 'true');
        
        console.log('Navigated to Definitions tab successfully');
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
        const statusTab = page.getByRole('tab', { name: 'Status' });
        await expect(statusTab).toHaveAttribute('aria-selected', 'true');
        
        console.log('Navigated to Status tab successfully');
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
        const legendsTab = page.getByRole('tab', { name: 'Legends' });
        await expect(legendsTab).toHaveAttribute('aria-selected', 'true');
        
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
        const contactsTab = page.getByRole('tab', { name: 'Contacts' });
        await expect(contactsTab).toHaveAttribute('aria-selected', 'true');
        
        console.log('Navigated to Contacts tab successfully');
    });
});
