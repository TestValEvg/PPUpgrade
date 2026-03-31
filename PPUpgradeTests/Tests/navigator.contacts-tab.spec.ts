import { test, expect } from '@playwright/test';
import { NavigatorContactsTab } from '../Pages/navigator.contacts-tab.page';

/**
 * Navigator Contacts Tab - Expand/Collapse Tests
 * Tests the Expand All / Collapse All functionality on the Contacts static tab
 * Note: Contacts tab typically does NOT have expandable content (no Expand All button)
 */
test.describe('Navigator Contacts Tab - Expand/Collapse Tests', () => {
    let navigatorPage: NavigatorContactsTab;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout
        navigatorPage = new NavigatorContactsTab(page);
        
        await navigatorPage.login();
        await navigatorPage.navigateToNavigator();
    });

    test('should handle Contacts tab with or without Expand All button', async () => {
        console.log('\n=== Test: Contacts Tab Expand All ===\n');
        
        // Step 1: Create search
        console.log('Step 1: Creating search...');
        await navigatorPage.selectJurisdiction('Austria');
        await navigatorPage.selectService('Derivatives & FX');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Step 2: Navigate to Contacts tab
        console.log('Step 2: Navigating to Contacts tab...');
        await navigatorPage.navigateToContactsTab();
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
            
            console.log('\n✅ Test passed: Contacts tab Expand All functionality works correctly\n');
        } else {
            console.log('\n✅ Test passed: Contacts tab has no expandable content (Expand All button not present) - this is expected behavior\n');
        }
    });

    test('should verify content loads correctly on Contacts tab', async () => {
        console.log('\n=== Test: Contacts Tab Content Loading ===\n');
        
        // Create search
        console.log('Creating search with Argentina + Banking...');
        await navigatorPage.selectJurisdiction('Argentina');
        await navigatorPage.selectService('Banking');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Navigate to Contacts tab
        console.log('Navigating to Contacts tab...');
        await navigatorPage.navigateToContactsTab();
        
        // Verify content loads
        await navigatorPage.verifyTabContentLoaded();
        
        console.log('\n✅ Test passed: Contacts tab content loads successfully\n');
    });

    test('should handle Contacts tab across different jurisdictions', async () => {
        console.log('\n=== Test: Contacts Tab - Multiple Jurisdictions ===\n');
        
        const jurisdictions = ['Belgium', 'Germany', 'France'];
        
        for (const jurisdiction of jurisdictions) {
            console.log(`\nTesting Contacts tab for ${jurisdiction}...`);
            
            await navigatorPage.selectJurisdiction(jurisdiction);
            await navigatorPage.selectService('Securities');
            await navigatorPage.clickSearch();
            await navigatorPage.waitForResults();
            
            await navigatorPage.navigateToContactsTab();
            await navigatorPage.verifyTabContentLoaded();
            
            // Check if Expand All exists (typically won't)
            const hasExpandAll = await navigatorPage.isExpandAllButtonPresent();
            console.log(`${jurisdiction} - Expand All present: ${hasExpandAll}`);
            
            // Reload page for next iteration
            if (jurisdiction !== jurisdictions[jurisdictions.length - 1]) {
                await navigatorPage.navigateToNavigator();
            }
        }
        
        console.log('\n✅ Test passed: Contacts tab verified across multiple jurisdictions\n');
    });
});
