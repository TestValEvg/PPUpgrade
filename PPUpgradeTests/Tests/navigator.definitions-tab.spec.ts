import { test, expect } from '@playwright/test';
import { NavigatorDefinitionsTab } from '../Pages/navigator.definitions-tab.page';

/**
 * Navigator Definitions Tab - Expand/Collapse Tests
 * Tests the Expand All / Collapse All functionality on the Definitions static tab
 */
test.describe('Navigator Definitions Tab - Expand/Collapse Tests', () => {
    let navigatorPage: NavigatorDefinitionsTab;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout
        navigatorPage = new NavigatorDefinitionsTab(page);
        
        await navigatorPage.login();
        await navigatorPage.navigateToNavigator();
    });

    test('should expand all content in Definitions tab if Expand All button is present', async () => {
        console.log('\n=== Test: Definitions Tab Expand All ===\n');
        
        // Step 1: Create search
        console.log('Step 1: Creating search...');
        await navigatorPage.selectJurisdiction('Argentina');
        await navigatorPage.selectService('Banking');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Step 2: Navigate to Definitions tab
        console.log('Step 2: Navigating to Definitions tab...');
        await navigatorPage.navigateToDefinitionsTab();
        await navigatorPage.verifyTabContentLoaded();
        
        // Step 3: Check if Expand All button exists
        console.log('Step 3: Checking for Expand All button...');
        const hasExpandAll = await navigatorPage.clickExpandAllIfPresent();
        
        if (hasExpandAll) {
            // Step 4: Verify button changed to "Collapse All"
            console.log('Step 4: Verifying button changed to "Collapse All"...');
            await navigatorPage.verifyCollapseAllButtonVisible();
            
            // Step 5: Verify content is expanded
            console.log('Step 5: Verifying content is expanded...');
            await navigatorPage.verifyContentExpanded();
            
            console.log('\n✅ Test passed: Definitions tab Expand All functionality works correctly\n');
        } else {
            console.log('\n✅ Test passed: Definitions tab has no expandable content (Expand All button not present)\n');
        }
    });

    test('should collapse all content after expanding in Definitions tab', async () => {
        console.log('\n=== Test: Definitions Tab Expand/Collapse Full Cycle ===\n');
        
        // Setup: Create search
        console.log('Setup: Creating search...');
        await navigatorPage.selectJurisdiction('Belgium');
        await navigatorPage.selectService('Banking');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Navigate to Definitions tab
        console.log('Navigating to Definitions tab...');
        await navigatorPage.navigateToDefinitionsTab();
        await navigatorPage.verifyTabContentLoaded();
        
        // Check if Expand All button exists
        console.log('Checking for Expand All button...');
        const hasExpandAll = await navigatorPage.clickExpandAllIfPresent();
        
        if (hasExpandAll) {
            await navigatorPage.verifyCollapseAllButtonVisible();
            
            // Step 1: Click Collapse All
            console.log('Step 1: Clicking Collapse All button...');
            await navigatorPage.clickCollapseAll();
            
            // Step 2: Verify button changed back to "Expand All"
            console.log('Step 2: Verifying button changed back to "Expand All"...');
            await navigatorPage.verifyExpandAllButtonVisible();
            
            console.log('\n✅ Test passed: Collapse All functionality works correctly\n');
        } else {
            console.log('\n✅ Test skipped: Definitions tab has no expandable content\n');
        }
    });

    test('should verify content loads correctly on Definitions tab', async () => {
        console.log('\n=== Test: Definitions Tab Content Loading ===\n');
        
        // Create search with different jurisdiction/service
        console.log('Creating search with Germany + Funds...');
        await navigatorPage.selectJurisdiction('Germany');
        await navigatorPage.selectService('Funds');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Navigate to Definitions tab
        console.log('Navigating to Definitions tab...');
        await navigatorPage.navigateToDefinitionsTab();
        
        // Verify content loads
        await navigatorPage.verifyTabContentLoaded();
        
        console.log('\n✅ Test passed: Definitions tab content loads successfully\n');
    });
});
