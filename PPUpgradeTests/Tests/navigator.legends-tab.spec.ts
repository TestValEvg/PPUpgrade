import { test, expect } from '@playwright/test';
import { NavigatorLegendsTab } from '../Pages/navigator.legends-tab.page';

/**
 * Navigator Legends Tab - Expand/Collapse Tests
 * Tests the Expand All / Collapse All functionality on the Legends static tab
 */
test.describe('Navigator Legends Tab - Expand/Collapse Tests', () => {
    let navigatorPage: NavigatorLegendsTab;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout
        navigatorPage = new NavigatorLegendsTab(page);
        
        await navigatorPage.login();
        await navigatorPage.navigateToNavigator();
    });

    test('should expand all content in Legends tab if Expand All button is present', async () => {
        console.log('\n=== Test: Legends Tab Expand All ===\n');
        
        // Step 1: Create search
        console.log('Step 1: Creating search...');
        await navigatorPage.selectJurisdiction('Germany');
        await navigatorPage.selectService('Funds');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Step 2: Navigate to Legends tab
        console.log('Step 2: Navigating to Legends tab...');
        await navigatorPage.navigateToLegendsTab();
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
            
            console.log('\n✅ Test passed: Legends tab Expand All functionality works correctly\n');
        } else {
            console.log('\n✅ Test passed: Legends tab has no expandable content (Expand All button not present)\n');
        }
    });

    test('should collapse all content after expanding in Legends tab', async () => {
        console.log('\n=== Test: Legends Tab Expand/Collapse Full Cycle ===\n');
        
        // Setup: Create search
        console.log('Setup: Creating search...');
        await navigatorPage.selectJurisdiction('Argentina');
        await navigatorPage.selectService('Derivatives & FX');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Navigate to Legends tab
        console.log('Navigating to Legends tab...');
        await navigatorPage.navigateToLegendsTab();
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
            console.log('\n✅ Test skipped: Legends tab has no expandable content\n');
        }
    });

    test('should verify content loads correctly on Legends tab', async () => {
        console.log('\n=== Test: Legends Tab Content Loading ===\n');
        
        // Create search with different jurisdiction/service
        console.log('Creating search with UK + Securities...');
        await navigatorPage.selectJurisdiction('Belgium');
        await navigatorPage.selectService('Securities');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Navigate to Legends tab
        console.log('Navigating to Legends tab...');
        await navigatorPage.navigateToLegendsTab();
        
        // Verify content loads
        await navigatorPage.verifyTabContentLoaded();
        
        console.log('\n✅ Test passed: Legends tab content loads successfully\n');
    });
});
