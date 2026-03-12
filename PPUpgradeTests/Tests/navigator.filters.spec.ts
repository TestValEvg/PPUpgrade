import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { NavigatorFilters } from '../Pages/navigator.filters';

test.describe('Navigator Filters - Validation Rules', () => {

    test('Search button is disabled when filters are empty', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator Compare Licensing page
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        
        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Get the Search button
        const searchButton = page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });

        // Verify Search button is disabled when no selections are made
        await expect(searchButton).toBeDisabled();
    });

    test('Search button is enabled only when Jurisdiction and Service have selections', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator Compare Licensing page
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        
        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const searchButton = page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });

        // Initially should be disabled
        await expect(searchButton).toBeDisabled();

        // Select only Jurisdiction - button should still be disabled
        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Austria');
        await page.getByRole('button', { name: 'Austria Austria' }).click();
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Verify button is still disabled (need Service too)
        await expect(searchButton).toBeDisabled();

        // Now select Service - button should become enabled
        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Banking');
        await page.getByRole('button', { name: 'Banking' }).click();
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Verify button is now enabled
        await expect(searchButton).toBeEnabled();
    });

    test('Product-Service relationship test - verify correct products for each service', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator Compare Licensing page
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        
        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Create NavigatorFilters instance for product verification
        const navigatorFilters = new NavigatorFilters(page);

        // Test each service and verify its products
        // Note: Corporate Finance and Funds skipped - not consistently available across test jurisdictions
        const services = ['Banking', 'Derivatives & FX', 'Lending', 'Securities'];
        const jurisdictions = ['Austria', 'Belgium', 'Canada', 'Germany', 'France', 'UK'];
        
        for (const service of services) {
            console.log(`\n========== Testing Service: ${service} ==========`);
            
            // Ensure clean state before starting new service
            await page.keyboard.press('Escape');
            await page.waitForTimeout(300);
            
            // Try jurisdictions until we find one that has this service
            let serviceSelected = false;
            for (const jurisdiction of jurisdictions) {
                console.log(`Trying jurisdiction: ${jurisdiction}`);
                
                // Select jurisdiction
                await page.getByText('Jurisdiction', { exact: true }).click();
                await page.waitForTimeout(300);
                
                const searchInput = page.getByPlaceholder('Search items');
                await searchInput.clear();
                await searchInput.fill(jurisdiction);
                await page.waitForTimeout(500);
                
                const jurisdictionButton = page.locator(`li [role="button"]:has-text("${jurisdiction}")`).first();
                const jurisdictionCount = await jurisdictionButton.count();
                
                if (jurisdictionCount > 0) {
                    await jurisdictionButton.click();
                    await page.keyboard.press('Escape');
                    
                    // Wait for network requests to complete after jurisdiction selection
                    await page.waitForLoadState('networkidle');
                    await page.waitForTimeout(1000);
                    
                    // Check if service is available for this jurisdiction
                    const serviceAvailable = await navigatorFilters.isServiceAvailable(service);
                    
                    if (serviceAvailable) {
                        // Select the service using the method
                        await navigatorFilters.selectService(service);
                        
                        serviceSelected = true;
                        console.log(`✓ Service ${service} selected for ${jurisdiction}`);
                        break;
                    } else {
                        console.log(`Service ${service} not available for ${jurisdiction}, clearing and trying next...`);
                        await navigatorFilters.clearAllFilters();
                        await page.waitForLoadState('networkidle');
                        await page.waitForTimeout(1500);
                        // Close any open dropdowns
                        await page.keyboard.press('Escape');
                        await page.waitForTimeout(500);
                    }
                }
            }
            
            if (!serviceSelected) {
                throw new Error(`Could not find a jurisdiction with service: ${service}`);
            }
            
            // Verify products match expected list
            await navigatorFilters.verifyProductOptionsForService(service);
            
            // Clear filters before next service
            await navigatorFilters.clearAllFilters();
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);
        }
        
        console.log('\n✓ All Service-Product relationships verified successfully');
    });

    // NOTE: Activity dropdown requires Product to be selected first
    // Test removed - Activity options only appear after Jurisdiction → Service → Product selection

    test('Activity-Product relationship test - verify Banking service products and activities randomly selecting products', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator Compare Licensing page
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        
        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Create NavigatorFilters instance
        const navigatorFilters = new NavigatorFilters(page);

        console.log('\n========== Testing Product-Activity relationship ==========');
        
        // Select a jurisdiction
        const jurisdiction = 'Austria';
        console.log(`Selecting jurisdiction: ${jurisdiction}`);
        await navigatorFilters.selectJurisdiction(jurisdiction);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);

        // Select Banking service
        const service = 'Banking';
        await navigatorFilters.selectService(service);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);

        // Test Product-Activity relationships for Banking products
        // NOTE: By default, ALL products are selected when you select a Service
        // To test a specific product, we need to UNSELECT all OTHER products
        // RANDOM SELECTION: Test ONE random product each time
        const productTests = [
            { product: 'Deposits', expectedActivity: 'Deposit Taking' },
            { product: 'FX', expectedActivity: 'Foreign Exchange Trading' },
            { product: 'Guarantees and Commitments', expectedActivity: 'Guarantees and Commitments' },
            { product: 'Payments', expectedActivity: 'Payments' }
        ];
        
        // Pick a random product to test
        const randomIndex = Math.floor(Math.random() * productTests.length);
        const test = productTests[randomIndex];
        
        console.log(`\n========== RANDOMLY SELECTED: Testing Product "${test.product}" ==========\n`);
        
        // Unselect all products EXCEPT the one we want to test
        // This leaves only the target product selected
        await navigatorFilters.unselectAllProductsExcept(test.product);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000); // Wait for Activity dropdown to populate
        
        console.log(`Only ${test.product} selected, waiting for activities to load...`);

        // Click Activity dropdown to see what's available/selected
        console.log('Clicking Activity dropdown to see activities...');
        await navigatorFilters.clickActivityDropdown();
        await page.waitForTimeout(2000);
        
        // Get all available activities
        const availableActivities = await page.locator('li [role="button"]').allTextContents();
        console.log(`Available activities for ${test.product}:`, availableActivities);
        
        // Check if expected activity is present
        const hasExpectedActivity = availableActivities.some(act => 
            act.toLowerCase().includes(test.expectedActivity.toLowerCase())
        );
        
        if (hasExpectedActivity) {
            console.log(`\n✓ PASS: Expected activity "${test.expectedActivity}" found for product "${test.product}"`);
        } else {
            console.log(`\n✗ FAIL: Expected activity "${test.expectedActivity}" NOT found for product "${test.product}"`);
            console.log(`Available: ${availableActivities.slice(0, 10).join(', ')}`);
            throw new Error(`Activity "${test.expectedActivity}" not found for product "${test.product}"`);
        }
        
        await navigatorFilters.clickOutside();
        
        console.log('\n✓ Product-Activity relationship verified successfully');
    });});