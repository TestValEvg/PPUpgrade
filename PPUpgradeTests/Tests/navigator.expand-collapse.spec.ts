import { test, expect } from '@playwright/test';
import { NavigatorExpandCollapse } from '../Pages/navigator.expand-collapse.page';

/**
 * Navigator Expand/Collapse Functionality Tests
 * Tests the Expand All / Collapse All button functionality
 */
test.describe('Navigator Expand/Collapse Tests', () => {
    let navigatorPage: NavigatorExpandCollapse;

    test.beforeEach(async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout
        navigatorPage = new NavigatorExpandCollapse(page);
        
        await navigatorPage.login();
        await navigatorPage.navigateToNavigator();
    });

    test('should expand all content and verify button changes to Collapse All', async () => {
        console.log('\n=== Test: Expand All Functionality ===\n');
        
        // Step 1: Select jurisdiction
        console.log('Step 1: Selecting jurisdiction...');
        await navigatorPage.selectJurisdiction('Argentina');
        
        // Step 2: Select service
        console.log('Step 2: Selecting service...');
        await navigatorPage.selectService('Banking');
        
        // Step 3: Click Search
        console.log('Step 3: Clicking Search button...');
        await navigatorPage.clickSearch();
        
        // Step 4: Wait for results
        console.log('Step 4: Waiting for results...');
        await navigatorPage.waitForResults();
        
        // Step 5: Click Expand All
        console.log('Step 5: Clicking Expand All button...');
        await navigatorPage.clickExpandAll();
        
        // Step 6: Verify button changed to "Collapse All"
        console.log('Step 6: Verifying button changed to "Collapse All"...');
        await navigatorPage.verifyCollapseAllButtonVisible();
        
        // Step 7: Verify content is expanded
        console.log('Step 7: Verifying content is expanded...');
        await navigatorPage.verifyContentExpanded();
        
        console.log('\n✅ Test passed: Expand All functionality works correctly\n');
    });

    test('should collapse all content after expanding and verify button changes to Expand All', async () => {
        console.log('\n=== Test: Expand/Collapse Full Cycle ===\n');
        
        // Setup: Create search and expand content
        console.log('Setup: Creating search...');
        await navigatorPage.selectJurisdiction('Belgium');
        await navigatorPage.selectService('Securities');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Expand first
        console.log('Expanding all content...');
        await navigatorPage.clickExpandAll();
        await navigatorPage.verifyCollapseAllButtonVisible();
        
        // Step 1: Click Collapse All
        console.log('Step 1: Clicking Collapse All button...');
        await navigatorPage.clickCollapseAll();
        
        // Step 2: Verify button changed to "Expand All"
        console.log('Step 2: Verifying button changed back to "Expand All"...');
        await navigatorPage.verifyExpandAllButtonVisible();
        
        // Step 3: Verify content is collapsed
        console.log('Step 3: Verifying content is collapsed...');
        await navigatorPage.verifyContentCollapsed();
        
        console.log('\n✅ Test passed: Collapse All functionality works correctly\n');
    });

    test('should expand and collapse multiple times consistently', async () => {
        console.log('\n=== Test: Multiple Expand/Collapse Cycles ===\n');
        
        // Setup
        console.log('Setup: Creating search...');
        await navigatorPage.selectJurisdiction('Germany');
        await navigatorPage.selectService('Funds');
        await navigatorPage.clickSearch();
        await navigatorPage.waitForResults();
        
        // Cycle 1: Expand
        console.log('Cycle 1: Expanding...');
        await navigatorPage.clickExpandAll();
        await navigatorPage.verifyCollapseAllButtonVisible();
        
        // Cycle 1: Collapse
        console.log('Cycle 1: Collapsing...');
        await navigatorPage.clickCollapseAll();
        await navigatorPage.verifyExpandAllButtonVisible();
        
        // Cycle 2: Expand again
        console.log('Cycle 2: Expanding again...');
        await navigatorPage.clickExpandAll();
        await navigatorPage.verifyCollapseAllButtonVisible();
        
        // Cycle 2: Collapse again
        console.log('Cycle 2: Collapsing again...');
        await navigatorPage.clickCollapseAll();
        await navigatorPage.verifyExpandAllButtonVisible();
        
        console.log('\n✅ Test passed: Multiple expand/collapse cycles work consistently\n');
    });
});
