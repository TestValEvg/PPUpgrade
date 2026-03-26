import { test } from '@playwright/test';
import { NavigatorStructure } from '../Pages/navigator.structure.page';

/**
 * Navigator Jurisdiction Analysis Structure Tests
 * Tests verify the sidebar structure when searching with multiple jurisdictions
 */

test.describe('Navigator Jurisdiction Analysis Structure', () => {
    let structurePage: NavigatorStructure;

    test.beforeEach(async ({ page }, testInfo) => {
        test.setTimeout(1800000); // 30 minutes timeout for complex searches
        
        console.log(`\n=== Starting test: ${testInfo.title} ===`);
        structurePage = new NavigatorStructure(page);
        await structurePage.login();
        await structurePage.navigateToNavigator();
    });

    test('User can search with 5 jurisdictions and verify sidebar structure', async () => {
        console.log('Test: Verify sidebar structure with 5 jurisdictions search');
        
        // Select 5 jurisdictions: Portugal, Austria, Belgium, Germany, UK
        const jurisdictions = ['Portugal', 'Austria', 'Belgium', 'Germany', 'UK'];
        await structurePage.selectJurisdictions(jurisdictions);
        
        // Keep All services selected (default)
        await structurePage.selectAllServices();
        
        // Click Search
        await structurePage.clickSearch();
        
        // Wait for results to load
        await structurePage.waitForResults();
        
        // Verify complete sidebar structure
        await structurePage.verifyCompleteStructure();
        
        console.log('✓ Test completed successfully');
    });

    test('User can verify Licensing section is expanded with Restrictions active', async () => {
        console.log('Test: Verify Licensing section expanded state');
        
        // Select 5 jurisdictions: Portugal, Austria, Belgium, Germany, UK
        const jurisdictions = ['Portugal', 'Austria', 'Belgium', 'Germany', 'UK'];
        await structurePage.selectJurisdictions(jurisdictions);
        
        // Keep All services selected (default)
        await structurePage.selectAllServices();
        
        // Click Search
        await structurePage.clickSearch();
        
        // Wait for results to load
        await structurePage.waitForResults();
        
        // Verify Licensing section is expanded and Restrictions is active
        await structurePage.verifyLicensingExpanded();
        
        console.log('✓ Test completed successfully');
    });

    test('User can verify all sidebar sections are present', async () => {
        console.log('Test: Verify all sidebar sections exist');
        
        // Select 5 jurisdictions: Portugal, Austria, Belgium, Germany, UK
        const jurisdictions = ['Portugal', 'Austria', 'Belgium', 'Germany', 'UK'];
        await structurePage.selectJurisdictions(jurisdictions);
        
        // Keep All services selected (default)
        await structurePage.selectAllServices();
        
        // Click Search
        await structurePage.clickSearch();
        
        // Wait for results to load
        await structurePage.waitForResults();
        
        // Verify sidebar structure contains all sections
        await structurePage.verifySidebarStructure();
        
        console.log('✓ Test completed successfully');
    });
});
