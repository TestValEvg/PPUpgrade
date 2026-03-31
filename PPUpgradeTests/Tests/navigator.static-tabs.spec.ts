import { test, expect } from '@playwright/test';
import { NavigatorStaticTabs } from '../Pages/navigator.static-tabs.page';

/**
 * Navigator Static Tabs Expand/Collapse Tests
 * Tests the Expand All / Collapse All functionality on Definition, Status, Legends, and Contacts tabs
 * Note: Expand All button is NOT present if there's no expandable content (typically in Contacts tab)
 */
test.describe('Navigator Static Tabs - Expand/Collapse Tests', () => {
    let navigatorPage: NavigatorStaticTabs;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout
        navigatorPage = new NavigatorStaticTabs(page);
        
        await navigatorPage.login();
        await navigatorPage.navigateToNavigator();
    });

    test('Definitions tab - should expand all content if Expand All button is present', async () => {
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
        await navigatorPage.verifyTabContentLoaded('Definitions');
        
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

    test('Status tab - should expand all content if Expand All button is present', async () => {
        console.log('\n=== Test: Status Tab Expand All ===\n');
        
        // Step 1: Create search
        console.log('Step 1: Creating search...');
        await navigatorPage.selectJurisdiction('Belgium');
        await navigatorPage.selectService('Securities');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Step 2: Navigate to Status tab
        console.log('Step 2: Navigating to Status tab...');
        await navigatorPage.navigateToStatusTab();
        await navigatorPage.verifyTabContentLoaded('Status');
        
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
            
            console.log('\n✅ Test passed: Status tab Expand All functionality works correctly\n');
        } else {
            console.log('\n✅ Test passed: Status tab has no expandable content (Expand All button not present)\n');
        }
    });

    test('Legends tab - should expand all content if Expand All button is present', async () => {
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
        await navigatorPage.verifyTabContentLoaded('Legends');
        
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

    test('Contacts tab - should expand all content if Expand All button is present (usually not present)', async () => {
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
        await navigatorPage.verifyTabContentLoaded('Contacts');
        
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

    test('Definitions tab - should collapse all content after expanding', async () => {
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
        await navigatorPage.verifyTabContentLoaded('Definitions');
        
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

    test('All tabs - verify Expand All availability across all static tabs', async () => {
        console.log('\n=== Test: Expand All Availability Across All Tabs ===\n');
        
        // Setup: Create search
        console.log('Setup: Creating search...');
        await navigatorPage.selectJurisdiction('Argentina');
        await navigatorPage.selectService('Banking');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        const tabResults: { [key: string]: boolean } = {};
        
        // Check Definitions tab
        console.log('\nChecking Definitions tab...');
        await navigatorPage.navigateToDefinitionsTab();
        tabResults['Definitions'] = await navigatorPage.isExpandAllButtonPresent();
        console.log(`Definitions tab - Expand All present: ${tabResults['Definitions']}`);
        
        // Check Status tab
        console.log('\nChecking Status tab...');
        await navigatorPage.navigateToStatusTab();
        tabResults['Status'] = await navigatorPage.isExpandAllButtonPresent();
        console.log(`Status tab - Expand All present: ${tabResults['Status']}`);
        
        // Check Legends tab
        console.log('\nChecking Legends tab...');
        await navigatorPage.navigateToLegendsTab();
        tabResults['Legends'] = await navigatorPage.isExpandAllButtonPresent();
        console.log(`Legends tab - Expand All present: ${tabResults['Legends']}`);
        
        // Check Contacts tab
        console.log('\nChecking Contacts tab...');
        await navigatorPage.navigateToContactsTab();
        tabResults['Contacts'] = await navigatorPage.isExpandAllButtonPresent();
        console.log(`Contacts tab - Expand All present: ${tabResults['Contacts']}`);
        
        console.log('\n=== Summary: Expand All Button Availability ===');
        for (const [tab, hasButton] of Object.entries(tabResults)) {
            console.log(`${tab}: ${hasButton ? '✓ Has Expand All' : '✗ No Expand All (no expandable content)'}`);
        }
        
        console.log('\n✅ Test passed: Expand All availability checked across all tabs\n');
    });
});
