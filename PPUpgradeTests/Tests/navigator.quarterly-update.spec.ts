import { test, expect } from '@playwright/test';
import { NavigatorQuarterlyUpdate } from '../Pages/navigator.quarterly-update.page';

/**
 * Navigator Quarterly Update Tests
 * Using DEV environment: https://platform.dev-simmons.com
 * NOTE: Will be switched to test environment in future
 */

test.describe('Navigator Quarterly Update - Access and Navigation', () => {
    
    test('User can access Quarterly Update reporting page', async ({ page }) => {
        test.setTimeout(120000); // 2 minutes timeout
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Access Quarterly Update Page ===\n');

        // Step 1: Login to dev environment
        console.log('Step 1: Logging in to dev environment...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to Navigator page first
        console.log('Step 2: Navigating to Navigator page...');
        await page.goto(`https://platform.dev-simmons.com/navigator/`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        console.log('✓ On Navigator page');

        // Step 3: Click Quarterly Update link and verify it opens in new tab
        console.log('Step 3: Clicking Quarterly Update link...');
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const originalPage = pages.originalPage;
        const newPage = pages.newPage;
        
        console.log('✓ Quarterly Update opened in new tab');
        
        // Step 4: Verify original Navigator page is still open
        console.log('Step 4: Verifying original Navigator page still open...');
        expect(originalPage.url()).toContain('navigator');
        console.log('✓ Original Navigator page remains open');

        // Step 5: Verify new tab has Quarterly Update page
        console.log('Step 5: Verifying Quarterly Update page loaded in new tab...');
        await newPage.waitForLoadState('networkidle');
        const url = newPage.url();
        console.log(`Current URL: ${url}`);
        expect(url).toContain('quarterly-update');
        console.log('✓ Quarterly Update page loaded successfully in new tab');
        console.log('✓ Test completed successfully');
    });

    test('User can navigate back to content search from Quarterly Update page', async ({ page }) => {
        test.setTimeout(120000);
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Navigate Back to Content Search ===\n');

        // Step 1: Login to dev environment
        console.log('Step 1: Logging in to dev environment...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to Navigator page
        console.log('Step 2: Navigating to Navigator page...');
        await page.goto(`https://platform.dev-simmons.com/navigator/`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        console.log('✓ On Navigator page');

        // Step 3: Click Quarterly Update link and get new tab
        console.log('Step 3: Clicking Quarterly Update link...');
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        console.log('✓ Quarterly Update opened in new tab');

        // Step 4: Verify on Quarterly Update page
        console.log('Step 4: Verifying on Quarterly Update page...');
        await newPage.waitForLoadState('networkidle');
        expect(newPage.url()).toContain('quarterly-update');
        console.log('✓ On Quarterly Update page');

        // Step 5: Click Navigator link from Quarterly Update page
        console.log('Step 5: Clicking Navigator icon from Quarterly Update page...');
        await quarterlyUpdate.clickNavigatorLinkOnNewTab(newPage);
        console.log('✓ Clicked Navigator icon');
        
        // Step 6: Verify navigated back to Navigator page with filters visible
        console.log('Step 6: Verifying navigated back to Navigator page...');
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        
        const currentUrl = newPage.url();
        console.log(`Current URL: ${currentUrl}`);
        expect(currentUrl).toContain('navigator');
        expect(currentUrl).not.toContain('quarterly-update');
        console.log('✓ Back on Navigator page');
        
        // Step 7: Verify Navigator filters are visible (confirming page loaded correctly)
        console.log('Step 7: Verifying Navigator filters are visible...');
        const searchButton = newPage.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });
        await expect(searchButton).toBeVisible();
        console.log('✓ Search button visible');
        
        const jurisdictionFilter = newPage.getByText('Jurisdiction', { exact: true }).first();
        await expect(jurisdictionFilter).toBeVisible();
        console.log('✓ Jurisdiction filter visible');
        
        const serviceFilter = newPage.getByText('Service', { exact: true }).first();
        await expect(serviceFilter).toBeVisible();
        console.log('✓ Service filter visible');
        
        console.log('✓ Navigator filters loaded successfully');
        console.log('✓ Test completed successfully');
    });
});

test.describe('Navigator Quarterly Update - Dashboard Metrics', () => {
    
    test('Dashboard displays calculated metrics', async ({ page }) => {
        test.setTimeout(120000);
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Dashboard Calculations ===\n');

        // Step 1: Login to dev environment
        console.log('Step 1: Logging in to dev environment...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to Navigator page
        console.log('Step 2: Navigating to Navigator page...');
        await page.goto(`https://platform.dev-simmons.com/navigator/`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Step 3: Click Quarterly Update link and get new tab
        console.log('Step 3: Clicking Quarterly Update link...');
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        console.log('✓ Quarterly Update opened in new tab');

        // Step 4: Verify dashboard stats container visible
        console.log('Step 4: Verifying dashboard stats container...');
        const statsContainer = newPage.locator('div.quarterly-update__stats');
        await statsContainer.waitFor({ state: 'visible', timeout: 15000 });
        await expect(statsContainer).toBeVisible();
        console.log('✓ Dashboard stats container visible');

        // Step 5: Verify all 4 metrics are displayed
        console.log('Step 5: Verifying all metrics...');
        
        // Changes Published
        const changesPublished = newPage.locator('span.s-stat__label:has-text("Changes published")');
        await expect(changesPublished).toBeVisible();
        const changesValue = newPage.locator('div.s-stat:has-text("Changes published") span.s-stat__value');
        await expect(changesValue).toBeVisible();
        console.log('✓ Changes Published metric visible');
        
        // Updates in Progress
        const updatesInProgress = newPage.locator('span.s-stat__label:has-text("Updates in progress")');
        await expect(updatesInProgress).toBeVisible();
        const updatesValue = newPage.locator('div.s-stat:has-text("Updates in progress") span.s-stat__value');
        await expect(updatesValue).toBeVisible();
        console.log('✓ Updates in Progress metric visible');
        
        // Jurisdictions Affected
        const jurisdictionsAffected = newPage.locator('span.s-stat__label:has-text("Jurisdictions affected")');
        await expect(jurisdictionsAffected).toBeVisible();
        const jurisdictionsValue = newPage.locator('div.s-stat:has-text("Jurisdictions affected") span.s-stat__value');
        await expect(jurisdictionsValue).toBeVisible();
        console.log('✓ Jurisdictions Affected metric visible');
        
        // Services
        const services = newPage.locator('span.s-stat__label:has-text("Services")');
        await expect(services).toBeVisible();
        const servicesValue = newPage.locator('div.s-stat:has-text("Services") span.s-stat__value');
        await expect(servicesValue).toBeVisible();
        console.log('✓ Services metric visible');
        
        console.log('✓ All dashboard metrics verified successfully');
        console.log('✓ Test completed successfully');
    });
});

test.describe('Navigator Quarterly Update - Custom Report Builder', () => {
    
    test('Build custom report button navigates to report builder', async ({ page }) => {
        test.setTimeout(120000);
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Build Custom Report Navigation ===\n');

        // Step 1: Login to dev environment
        console.log('Step 1: Logging in to dev environment...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to Navigator page
        console.log('Step 2: Navigating to Navigator page...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Step 3: Click Quarterly Update link and get new tab
        console.log('Step 3: Clicking Quarterly Update link...');
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        console.log('✓ Quarterly Update opened in new tab');

        // Step 4: Verify on Quarterly Update page
        console.log('Step 4: Verifying on Quarterly Update page...');
        await newPage.waitForLoadState('networkidle');
        expect(newPage.url()).toContain('quarterly-update');
        console.log('✓ On Quarterly Update page');

        // Step 5: Click "Build a custom report" button using span.button-text parent button
        console.log('Step 5: Clicking Build Custom Report button...');
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await expect(buildReportButton).toBeVisible();
        await expect(buildReportButton).toBeEnabled();
        await buildReportButton.click();
        console.log('✓ Build Custom Report button clicked');

        // Step 6: Verify navigation to report-builder in same tab
        console.log('Step 6: Verifying navigation to report-builder...');
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        const currentUrl = newPage.url();
        console.log(`Current URL: ${currentUrl}`);
        expect(currentUrl).toBe('https://platform.dev-simmons.com/navigator/quarterly-update/report-builder');
        console.log('✓ Navigated to report-builder in same tab');
        console.log('✓ Test completed successfully');
    });

    test('Generate report button is disabled by default', async ({ page }) => {
        test.setTimeout(120000);
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Generate Report Button Default State ===\n');

        // Step 1: Login to dev environment
        console.log('Step 1: Logging in to dev environment...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate directly to report-builder page
        console.log('Step 2: Navigating to report-builder page...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Step 3: Click Quarterly Update link
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        await newPage.waitForLoadState('networkidle');
        
        // Step 4: Click Build Custom Report button
        console.log('Step 3: Clicking Build Custom Report button...');
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toContain('report-builder');
        console.log('✓ On report-builder page');

        // Step 5: Verify Generate Report button exists and is disabled
        console.log('Step 4: Verifying Generate Report button state...');
        const generateButton = newPage.locator('button:has(span.button-text:has-text("Generate report"))');
        await generateButton.waitFor({ state: 'visible', timeout: 15000 });
        await expect(generateButton).toBeVisible();
        await expect(generateButton).toBeDisabled();
        console.log('✓ Generate Report button is disabled (no filters selected)');
        console.log('✓ Test completed successfully');
    });

    test('Services checkbox functionality', async ({ page }) => {
        test.setTimeout(120000);
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Services Checkbox Functionality ===\n');

        // Step 1: Login
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to report-builder
        console.log('Step 2: Navigating to report-builder...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        await newPage.waitForLoadState('networkidle');
        
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toContain('report-builder');
        console.log('✓ On report-builder page');

        // Step 3: Select 2 individual services
        console.log('Step 3: Selecting 2 services (Corporate Finance, Funds)...');
        const corporateFinanceCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Corporate Finance"))');
        const fundsCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Funds"))');
        
        await corporateFinanceCard.click();
        await newPage.waitForTimeout(500);
        await expect(corporateFinanceCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ Corporate Finance selected');
        
        await fundsCard.click();
        await newPage.waitForTimeout(500);
        await expect(fundsCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ Funds selected');

        // Step 4: Click "Select all"
        console.log('Step 4: Clicking Select all for services...');
        const servicesSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').first();
        await servicesSelectAllButton.click();
        await newPage.waitForTimeout(1000);
        
        await expect(corporateFinanceCard).toHaveClass(/s-option-card--selected/);
        await expect(fundsCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ All services selected');
        
        // Verify button text changed to "Deselect all"
        const servicesDeselectAllButton = newPage.locator('button.s-button.ghost:has-text("Deselect all")').first();
        await expect(servicesDeselectAllButton).toBeVisible();
        console.log('✓ Button text changed to "Deselect all"');

        // Step 5: Deselect one service
        console.log('Step 5: Deselecting Funds...');
        await fundsCard.click();
        await newPage.waitForTimeout(500);
        await expect(fundsCard).not.toHaveClass(/s-option-card--selected/);
        console.log('✓ Funds deselected');
        console.log('  (Button should now show "Select all" since not all services are selected)');

        // Step 6: Click "Select all" again to select everything, then "Deselect all"
        console.log('Step 6: Clicking Select all to reselect everything...');
        const servicesSelectAllButton2 = newPage.locator('button.s-button.ghost:has-text("Select all")').first();
        await servicesSelectAllButton2.click();
        await newPage.waitForTimeout(1000);
        await expect(corporateFinanceCard).toHaveClass(/s-option-card--selected/);
        await expect(fundsCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ All services selected again');

        // Step 7: Now click "Deselect all" to deselect everything
        console.log('Step 7: Clicking Deselect all for services...');
        const servicesDeselectAllButton2 = newPage.locator('button.s-button.ghost:has-text("Deselect all")').first();
        await servicesDeselectAllButton2.click();
        await newPage.waitForTimeout(1000);
        
        await expect(corporateFinanceCard).not.toHaveClass(/s-option-card--selected/);
        await expect(fundsCard).not.toHaveClass(/s-option-card--selected/);
        console.log('✓ All services deselected');
        console.log('✓ Test completed successfully');
    });

    test('Regions checkbox functionality', async ({ page }) => {
        test.setTimeout(120000);
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Regions Checkbox Functionality ===\n');

        // Step 1: Login
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to report-builder
        console.log('Step 2: Navigating to report-builder...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        await newPage.waitForLoadState('networkidle');
        
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toContain('report-builder');
        console.log('✓ On report-builder page');

        // Pre-requisite: Select ALL services to enable all regions (including Europe)
        console.log('Selecting all services to enable all regions...');
        const servicesSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').first();
        await servicesSelectAllButton.click();
        await newPage.waitForTimeout(1500);
        console.log('✓ All services selected, all regions now available');

        // Step 3: Select 2 regions
        console.log('Step 3: Selecting 2 regions (Americas, Europe)...');
        const americasCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Americas"))');
        const europeCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Europe"))');
        
        await americasCard.scrollIntoViewIfNeeded();
        await americasCard.click();
        await newPage.waitForTimeout(500);
        await expect(americasCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ Americas selected');
        
        await europeCard.click();
        await newPage.waitForTimeout(500);
        await expect(europeCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ Europe selected');

        // Step 4: Click "Select all"
        console.log('Step 4: Clicking Select all for regions...');
        const regionsSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').nth(1);
        await regionsSelectAllButton.scrollIntoViewIfNeeded();
        await regionsSelectAllButton.click();
        await newPage.waitForTimeout(1000);
        
        await expect(americasCard).toHaveClass(/s-option-card--selected/);
        await expect(europeCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ All regions selected');

        // Step 5: Deselect one region
        console.log('Step 5: Deselecting Europe...');
        await europeCard.click();
        await newPage.waitForTimeout(500);
        await expect(europeCard).not.toHaveClass(/s-option-card--selected/);
        console.log('✓ Europe deselected');
        console.log('  (Button should now show "Select all" since not all regions are selected)');

        // Step 6: Click "Select all" again to reselect everything, then "Deselect all"
        console.log('Step 6: Clicking Select all to reselect everything...');
        const regionsSelectAllButton2 = newPage.locator('button.s-button.ghost:has-text("Select all")').nth(1);
        await regionsSelectAllButton2.click();
        await newPage.waitForTimeout(1000);
        await expect(americasCard).toHaveClass(/s-option-card--selected/);
        await expect(europeCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ All regions selected again');

        // Step 7: Now click "Deselect all" to deselect everything
        console.log('Step 7: Clicking Deselect all for regions...');
        const regionsDeselectAllButton2 = newPage.locator('button.s-button.ghost:has-text("Deselect all")').nth(1);
        await regionsDeselectAllButton2.click();
        await newPage.waitForTimeout(1000);
        await expect(americasCard).not.toHaveClass(/s-option-card--selected/);
        console.log('✓ All regions deselected');
        console.log('✓ Test completed successfully');
    });

    test('Jurisdictions checkbox functionality', async ({ page }) => {
        test.setTimeout(120000);
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Jurisdictions Checkbox Functionality ===\n');

        // Step 1: Login
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to report-builder
        console.log('Step 2: Navigating to report-builder...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        await newPage.waitForLoadState('networkidle');
        
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toContain('report-builder');
        console.log('✓ On report-builder page');

        // Pre-requisites: Select service and region
        console.log('Setting up: Selecting service and region...');
        const corporateFinanceCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Corporate Finance"))');
        await corporateFinanceCard.click();
        await newPage.waitForTimeout(500);
        
        const americasCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Americas"))');
        await americasCard.scrollIntoViewIfNeeded();
        await americasCard.click();
        await newPage.waitForTimeout(1000);
        console.log('✓ Service and region selected');

        // Step 3: Open jurisdictions dropdown
        console.log('Step 3: Opening jurisdictions dropdown...');
        const jurisdictionsDropdown = newPage.locator('span.s-checkbox-select-dropdown__label:has-text("Select jurisdictions")');
        await jurisdictionsDropdown.scrollIntoViewIfNeeded();
        await jurisdictionsDropdown.click();
        await newPage.waitForTimeout(1000);
        console.log('✓ Jurisdictions dropdown opened');

        // Step 4: Select one jurisdiction
        console.log('Step 4: Selecting one jurisdiction...');
        const firstJurisdiction = newPage.locator('span.s-checkbox-select-dropdown__option-label').filter({ hasNotText: 'Select all' }).filter({ hasNotText: 'Deselect all' }).first();
        const jurisdictionName = await firstJurisdiction.textContent();
        await firstJurisdiction.click();
        await newPage.waitForTimeout(500);
        console.log(`✓ Selected jurisdiction: ${jurisdictionName}`);

        // Step 5: Click "Select all" inside dropdown
        console.log('Step 5: Clicking Select all in dropdown...');
        const jurisdictionsSelectAll = newPage.locator('span.s-checkbox-select-dropdown__option-label:has-text("Select all")');
        await jurisdictionsSelectAll.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All jurisdictions selected');
        
        // Verify button text changed to "Deselect all"
        const jurisdictionsDeselectAll = newPage.locator('span.s-checkbox-select-dropdown__option-label:has-text("Deselect all")');
        await expect(jurisdictionsDeselectAll).toBeVisible();
        console.log('✓ Button text changed to "Deselect all"');

        // Step 6: Click "Deselect all"
        console.log('Step 6: Clicking Deselect all in dropdown...');
        await jurisdictionsDeselectAll.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All jurisdictions deselected');
        console.log('✓ Test completed successfully');
    });

    test('Change type checkbox functionality', async ({ page }) => {
        test.setTimeout(120000);
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Change Type Checkbox Functionality ===\n');

        // Step 1: Login
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to report-builder
        console.log('Step 2: Navigating to report-builder...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        await newPage.waitForLoadState('networkidle');
        
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toContain('report-builder');
        console.log('✓ On report-builder page');

        // Pre-requisites: Select service, region, and jurisdiction
        console.log('Setting up: Selecting service, region, and jurisdiction...');
        const corporateFinanceCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Corporate Finance"))');
        await corporateFinanceCard.click();
        await newPage.waitForTimeout(500);
        
        const americasCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Americas"))');
        await americasCard.scrollIntoViewIfNeeded();
        await americasCard.click();
        await newPage.waitForTimeout(500);
        
        const jurisdictionsDropdown = newPage.locator('span.s-checkbox-select-dropdown__label:has-text("Select jurisdictions")');
        await jurisdictionsDropdown.scrollIntoViewIfNeeded();
        await jurisdictionsDropdown.click();
        await newPage.waitForTimeout(500);
        
        const firstJurisdiction = newPage.locator('span.s-checkbox-select-dropdown__option-label').filter({ hasNotText: 'Select all' }).filter({ hasNotText: 'Deselect all' }).first();
        await firstJurisdiction.click();
        await newPage.waitForTimeout(500);
        
        // Close dropdown by clicking outside (not on h2 which might not be clickable)
        await newPage.keyboard.press('Escape');
        await newPage.waitForTimeout(1000);
        console.log('✓ Service, region, and jurisdiction selected, dropdown closed');

        // Step 3: Select one change type
        console.log('Step 3: Selecting Changes...');
        const changesCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Changes"))').last();
        await changesCard.scrollIntoViewIfNeeded();
        await changesCard.click();
        await newPage.waitForTimeout(500);
        await expect(changesCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ Changes selected');

        // Step 4: Click "Select all"
        console.log('Step 4: Clicking Select all for change types...');
        const changeTypeSelectAll = newPage.locator('button.s-button.ghost:has-text("Select all")').last();
        await changeTypeSelectAll.scrollIntoViewIfNeeded();
        await changeTypeSelectAll.click();
        await newPage.waitForTimeout(1000);
        
        const forthcomingChangesCard = newPage.locator('div.s-option-card:has(span.s-option-card__label:has-text("Forthcoming Changes"))').last();
        await expect(changesCard).toHaveClass(/s-option-card--selected/);
        await expect(forthcomingChangesCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ All change types selected');

        // Step 5: Deselect one change type
        console.log('Step 5: Deselecting Forthcoming Changes...');
        await forthcomingChangesCard.click();
        await newPage.waitForTimeout(500);
        await expect(forthcomingChangesCard).not.toHaveClass(/s-option-card--selected/);
        console.log('✓ Forthcoming Changes deselected');
        console.log('  (Button should now show "Select all" since not all change types are selected)');

        // Step 6: Click "Select all" again to reselect everything, then "Deselect all"
        console.log('Step 6: Clicking Select all to reselect everything...');
        const changeTypeSelectAll2 = newPage.locator('button.s-button.ghost:has-text("Select all")').last();
        await changeTypeSelectAll2.scrollIntoViewIfNeeded();
        await changeTypeSelectAll2.click();
        await newPage.waitForTimeout(1000);
        await expect(changesCard).toHaveClass(/s-option-card--selected/);
        await expect(forthcomingChangesCard).toHaveClass(/s-option-card--selected/);
        console.log('✓ All change types selected again');

        // Step 7: Now click "Deselect all" to deselect everything
        console.log('Step 7: Clicking Deselect all for change types...');
        const changeTypeDeselectAll2 = newPage.locator('button.s-button.ghost:has-text("Deselect all")').last();
        await changeTypeDeselectAll2.click();
        await newPage.waitForTimeout(1000);
        await expect(changesCard).not.toHaveClass(/s-option-card--selected/);
        console.log('✓ All change types deselected');
        console.log('✓ Test completed successfully');
    });

    test('Generate report with all filters selected', async ({ page }) => {
        test.setTimeout(180000); // 3 minutes timeout for report generation
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Generate Report with All Filters ===\n');

        // Step 1: Login
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to report-builder
        console.log('Step 2: Navigating to report-builder...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        await newPage.waitForLoadState('networkidle');
        
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toContain('report-builder');
        console.log('✓ On report-builder page');

        // Step 3: Select all services
        console.log('Step 3: Selecting all services...');
        const servicesSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').first();
        await servicesSelectAllButton.click();
        await newPage.waitForTimeout(1000);
        console.log('✓ All services selected');

        // Step 4: Select all regions
        console.log('Step 4: Selecting all regions...');
        const regionsSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').nth(1);
        await regionsSelectAllButton.scrollIntoViewIfNeeded();
        await regionsSelectAllButton.click();
        await newPage.waitForTimeout(1000);
        console.log('✓ All regions selected');

        // Step 5: Select all jurisdictions
        console.log('Step 5: Selecting all jurisdictions...');
        const jurisdictionsDropdown = newPage.locator('span.s-checkbox-select-dropdown__label:has-text("Select jurisdictions")');
        await jurisdictionsDropdown.scrollIntoViewIfNeeded();
        await jurisdictionsDropdown.click();
        await newPage.waitForTimeout(1000);
        
        const jurisdictionsSelectAll = newPage.locator('span.s-checkbox-select-dropdown__option-label:has-text("Select all")');
        await jurisdictionsSelectAll.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All jurisdictions selected');
        
        // Close dropdown
        await newPage.keyboard.press('Escape');
        await newPage.waitForTimeout(500);

        // Step 6: Select all change types
        console.log('Step 6: Selecting all change types...');
        const changeTypeSelectAll = newPage.locator('button.s-button.ghost:has-text("Select all")').last();
        await changeTypeSelectAll.scrollIntoViewIfNeeded();
        await changeTypeSelectAll.click();
        await newPage.waitForTimeout(1000);
        console.log('✓ All change types selected');

        // Step 7: Click February 2026 timeframe
        console.log('Step 7: Selecting February 2026 timeframe...');
        const februaryPill = newPage.locator('button.report-builder-timeframe__pill:has-text("February 2026")');
        await februaryPill.scrollIntoViewIfNeeded();
        await februaryPill.click();
        await newPage.waitForTimeout(1000);
        await expect(februaryPill).toHaveClass(/report-builder-timeframe__pill--active/);
        console.log('✓ February 2026 selected');

        // Step 8: Verify Generate report button is enabled
        console.log('Step 8: Verifying Generate report button is enabled...');
        const generateButton = newPage.locator('button:has(span.button-text:has-text("Generate report"))');
        await generateButton.scrollIntoViewIfNeeded();
        await expect(generateButton).toBeEnabled();
        console.log('✓ Generate report button is enabled');

        // Step 9: Click Generate report
        console.log('Step 9: Clicking Generate report...');
        await generateButton.click();
        await newPage.waitForTimeout(2000);

        // Step 10: Verify report generation progress appears
        console.log('Step 10: Verifying report generation progress...');
        const progressHeading = newPage.locator('h2.report-generating-progress__heading:has-text("Generating your report")');
        await expect(progressHeading).toBeVisible({ timeout: 10000 });
        console.log('✓ Report generation started');

        // Step 11: Verify progress steps
        console.log('Step 11: Verifying progress steps...');
        const progressSteps = newPage.locator('div.s-progress-steps');
        await expect(progressSteps).toBeVisible();
        
        // Check for specific progress steps
        const validatingScope = newPage.locator('span.s-progress-steps__label:has-text("Validating scope")');
        await expect(validatingScope).toBeVisible();
        console.log('  ✓ Validating scope step visible');
        
        const queryingKnowledge = newPage.locator('span.s-progress-steps__label:has-text("Querying knowledge base")');
        await expect(queryingKnowledge).toBeVisible();
        console.log('  ✓ Querying knowledge base step visible');
        
        const gatheringChanges = newPage.locator('span.s-progress-steps__label:has-text("Gathering changes")');
        await expect(gatheringChanges).toBeVisible();
        console.log('  ✓ Gathering changes step visible');
        
        const crossReferencing = newPage.locator('span.s-progress-steps__label:has-text("Cross-referencing jurisdictions")');
        await expect(crossReferencing).toBeVisible();
        console.log('  ✓ Cross-referencing jurisdictions step visible');
        
        const draftingNarrative = newPage.locator('span.s-progress-steps__label:has-text("Drafting narrative")');
        await expect(draftingNarrative).toBeVisible();
        console.log('  ✓ Drafting narrative step visible');
        
        const finalisingReport = newPage.locator('span.s-progress-steps__label:has-text("Finalising report")');
        await expect(finalisingReport).toBeVisible();
        console.log('  ✓ Finalising report step visible');

        console.log('✓ All progress steps verified successfully');

        // Step 12: Wait for all steps to complete (turn green)
        console.log('Step 12: Waiting for all steps to complete...');
        
        // Wait for Validating scope to be done
        const validatingScopeDone = newPage.locator('div.s-progress-steps__step--done:has(span.s-progress-steps__label:has-text("Validating scope"))');
        await expect(validatingScopeDone).toBeVisible({ timeout: 30000 });
        console.log('  ✓ Validating scope completed');
        
        // Wait for Querying knowledge base to be done
        const queryingKnowledgeDone = newPage.locator('div.s-progress-steps__step--done:has(span.s-progress-steps__label:has-text("Querying knowledge base"))');
        await expect(queryingKnowledgeDone).toBeVisible({ timeout: 30000 });
        console.log('  ✓ Querying knowledge base completed');
        
        // Wait for Gathering changes to be done
        const gatheringChangesDone = newPage.locator('div.s-progress-steps__step--done:has(span.s-progress-steps__label:has-text("Gathering changes"))');
        await expect(gatheringChangesDone).toBeVisible({ timeout: 30000 });
        console.log('  ✓ Gathering changes completed');
        
        // Wait for Cross-referencing jurisdictions to be done
        const crossReferencingDone = newPage.locator('div.s-progress-steps__step--done:has(span.s-progress-steps__label:has-text("Cross-referencing jurisdictions"))');
        await expect(crossReferencingDone).toBeVisible({ timeout: 30000 });
        console.log('  ✓ Cross-referencing jurisdictions completed');
        
        // Wait for Drafting narrative to be done
        const draftingNarrativeDone = newPage.locator('div.s-progress-steps__step--done:has(span.s-progress-steps__label:has-text("Drafting narrative"))');
        await expect(draftingNarrativeDone).toBeVisible({ timeout: 60000 });
        console.log('  ✓ Drafting narrative completed');
        
        // Wait for Finalising report to be done
        const finalisingReportDone = newPage.locator('div.s-progress-steps__step--done:has(span.s-progress-steps__label:has-text("Finalising report"))');
        await expect(finalisingReportDone).toBeVisible({ timeout: 30000 });
        console.log('  ✓ Finalising report completed');
        
        console.log('✓ All steps completed and turned green');

        // Step 13: Verify navigation to report-results page
        console.log('Step 13: Verifying navigation to report-results page...');
        await newPage.waitForURL('**/navigator/quarterly-update/report-results', { timeout: 10000 });
        expect(newPage.url()).toContain('/navigator/quarterly-update/report-results');
        console.log('✓ Successfully navigated to report-results page');
        console.log(`  URL: ${newPage.url()}`);

        console.log('\n✓ Test completed successfully - Report generated!');
    });

    test('Back to scope verification after report creation', async ({ page }) => {
        test.setTimeout(240000); // 4 minutes timeout
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Back to Scope After Report Creation ===\n');

        // Step 1: Login
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to report-builder
        console.log('Step 2: Navigating to report-builder...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        await newPage.waitForLoadState('networkidle');
        
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toContain('report-builder');
        console.log('✓ On report-builder page');

        // Step 3: Select all filters quickly
        console.log('Step 3: Selecting all filters...');
        const servicesSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').first();
        await servicesSelectAllButton.click();
        await newPage.waitForTimeout(500);
        
        const regionsSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').nth(1);
        await regionsSelectAllButton.scrollIntoViewIfNeeded();
        await regionsSelectAllButton.click();
        await newPage.waitForTimeout(500);
        
        const jurisdictionsDropdown = newPage.locator('span.s-checkbox-select-dropdown__label:has-text("Select jurisdictions")');
        await jurisdictionsDropdown.scrollIntoViewIfNeeded();
        await jurisdictionsDropdown.click();
        await newPage.waitForTimeout(500);
        
        const jurisdictionsSelectAll = newPage.locator('span.s-checkbox-select-dropdown__option-label:has-text("Select all")');
        await jurisdictionsSelectAll.click();
        await newPage.waitForTimeout(500);
        await newPage.keyboard.press('Escape');
        await newPage.waitForTimeout(500);
        
        const changeTypeSelectAll = newPage.locator('button.s-button.ghost:has-text("Select all")').last();
        await changeTypeSelectAll.scrollIntoViewIfNeeded();
        await changeTypeSelectAll.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All filters selected');

        // Step 4: Select timeframe and generate report
        console.log('Step 4: Selecting February 2026 timeframe...');
        const februaryPill = newPage.locator('button.report-builder-timeframe__pill:has-text("February 2026")');
        await februaryPill.scrollIntoViewIfNeeded();
        await februaryPill.click();
        await newPage.waitForTimeout(500);
        console.log('✓ February 2026 selected');

        console.log('Step 5: Generating report...');
        const generateButton = newPage.locator('button:has(span.button-text:has-text("Generate report"))');
        await generateButton.scrollIntoViewIfNeeded();
        await generateButton.click();
        console.log('✓ Generate report clicked');

        // Step 6: Wait for report generation to complete (can take 1-2 minutes)
        console.log('Step 6: Waiting for report generation to complete (can take 1-2 minutes)...');
        await newPage.waitForURL('**/navigator/quarterly-update/report-results', { timeout: 180000 });
        expect(newPage.url()).toContain('/navigator/quarterly-update/report-results');
        console.log('✓ Report generated and on report-results page');
        console.log(`  URL: ${newPage.url()}`);

        // Step 7: Click "Back to scope" button
        console.log('Step 7: Clicking "Back to scope" button...');
        const backToScopeButton = newPage.locator('button.s-button:has(span.button-text:has-text("Back to scope"))');
        await backToScopeButton.waitFor({ state: 'visible', timeout: 10000 });
        await backToScopeButton.click();
        await newPage.waitForTimeout(2000);
        console.log('✓ "Back to scope" button clicked');

        // Step 8: Verify redirect to report-builder
        console.log('Step 8: Verifying redirect to report-builder...');
        await newPage.waitForURL('**/navigator/quarterly-update/report-builder', { timeout: 10000 });
        expect(newPage.url()).toContain('/navigator/quarterly-update/report-builder');
        console.log('✓ Successfully redirected to report-builder page');
        console.log(`  URL: ${newPage.url()}`);

        console.log('\n✓ Test completed successfully - Back to scope verified!');
    });

    test('Check report content - TOC and sections', async ({ page }) => {
        test.setTimeout(240000); // 4 minutes timeout
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Check Report Content ===\n');

        // Step 1: Login
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to report-builder
        console.log('Step 2: Navigating to report-builder...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        await newPage.waitForLoadState('networkidle');
        
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toContain('report-builder');
        console.log('✓ On report-builder page');

        // Step 3: Select all filters quickly
        console.log('Step 3: Selecting all filters...');
        const servicesSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').first();
        await servicesSelectAllButton.click();
        await newPage.waitForTimeout(500);
        
        const regionsSelectAllButton = newPage.locator('button.s-button.ghost:has-text("Select all")').nth(1);
        await regionsSelectAllButton.scrollIntoViewIfNeeded();
        await regionsSelectAllButton.click();
        await newPage.waitForTimeout(500);
        
        const jurisdictionsDropdown = newPage.locator('span.s-checkbox-select-dropdown__label:has-text("Select jurisdictions")');
        await jurisdictionsDropdown.scrollIntoViewIfNeeded();
        await jurisdictionsDropdown.click();
        await newPage.waitForTimeout(500);
        
        const jurisdictionsSelectAll = newPage.locator('span.s-checkbox-select-dropdown__option-label:has-text("Select all")');
        await jurisdictionsSelectAll.click();
        await newPage.waitForTimeout(500);
        await newPage.keyboard.press('Escape');
        await newPage.waitForTimeout(500);
        
        const changeTypeSelectAll = newPage.locator('button.s-button.ghost:has-text("Select all")').last();
        await changeTypeSelectAll.scrollIntoViewIfNeeded();
        await changeTypeSelectAll.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All filters selected');

        // Step 4: Select February 2026 timeframe
        console.log('Step 4: Selecting February 2026 timeframe...');
        const februaryPill = newPage.locator('button.report-builder-timeframe__pill:has-text("February 2026")');
        await februaryPill.scrollIntoViewIfNeeded();
        await februaryPill.click();
        await newPage.waitForTimeout(500);
        console.log('✓ February 2026 selected');

        // Step 5: Generate report
        console.log('Step 5: Generating report (can take 1-2 minutes)...');
        const generateButton = newPage.locator('button:has(span.button-text:has-text("Generate report"))');
        await generateButton.scrollIntoViewIfNeeded();
        await generateButton.click();
        console.log('✓ Generate report clicked');

        // Step 6: Wait for report generation to complete
        console.log('Step 6: Waiting for report generation to complete...');
        await newPage.waitForURL('**/navigator/quarterly-update/report-results', { timeout: 180000 });
        expect(newPage.url()).toContain('/navigator/quarterly-update/report-results');
        console.log('✓ Report generated and on report-results page');

        // Step 7: Verify Table of Contents (TOC) sidebar
        console.log('Step 7: Verifying Table of Contents sidebar...');
        const reportToc = newPage.locator('aside.report-toc');
        await expect(reportToc).toBeVisible({ timeout: 10000 });
        console.log('✓ Table of Contents sidebar visible');

        // Verify TOC label
        const tocLabel = newPage.locator('div.report-toc__label:has-text("In this report")');
        await expect(tocLabel).toBeVisible();
        console.log('  ✓ "In this report" label visible');

        // Step 8: Verify selected date range section (February 2026 Update)
        console.log('Step 8: Verifying February 2026 Update section...');
        const februarySection = newPage.locator('button.report-toc__item:has(span.button-text:has-text("February 2026 Update"))');
        await expect(februarySection).toBeVisible();
        await expect(februarySection).toHaveClass(/report-toc__item--active/);
        console.log('✓ "February 2026 Update" section visible and active (selected date range)');

        // Step 9: Verify "Changes" section exists
        console.log('Step 9: Verifying "Changes" section...');
        const changesSection = newPage.locator('button.report-toc__item:has(span.button-text:has-text("Changes"))').filter({ hasNotText: 'Forthcoming' }).filter({ hasNotText: 'No' });
        await expect(changesSection).toBeVisible();
        console.log('✓ "Changes" section visible');

        // Step 10: Verify "Forthcoming Changes" section exists
        console.log('Step 10: Verifying "Forthcoming Changes" section...');
        const forthcomingChangesSection = newPage.locator('button.report-toc__item:has(span.button-text:has-text("Forthcoming Changes"))');
        await expect(forthcomingChangesSection).toBeVisible();
        console.log('✓ "Forthcoming Changes" section visible');

        // Step 11: Click and verify "Changes" section navigation
        console.log('Step 11: Testing "Changes" section navigation...');
        await changesSection.click();
        await newPage.waitForTimeout(1000);
        await expect(changesSection).toHaveClass(/report-toc__item--active/);
        console.log('✓ "Changes" section clicked and is now active');

        // Step 12: Click and verify "Forthcoming Changes" section navigation
        console.log('Step 12: Testing "Forthcoming Changes" section navigation...');
        await forthcomingChangesSection.click();
        await newPage.waitForTimeout(1000);
        await expect(forthcomingChangesSection).toHaveClass(/report-toc__item--active/);
        console.log('✓ "Forthcoming Changes" section clicked and is now active');

        console.log('\n✓ Test completed successfully - Report content verified!');
    });
});

test.describe('Navigator Quarterly Update - Extract Status Table', () => {
    
    test('Generate extract status table with all filters', async ({ page }) => {
        test.setTimeout(240000); // 4 minutes timeout
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Generate Extract Status Table ===\n');

        // Step 1: Login to dev environment
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        // Step 2: Navigate to Navigator page
        console.log('Step 2: Navigating to Navigator page...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        // Step 3: Click Quarterly Update link and get new tab
        console.log('Step 3: Clicking Quarterly Update link...');
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        console.log('✓ Quarterly Update opened in new tab');

        // Step 4: Verify on Quarterly Update page
        console.log('Step 4: Verifying on Quarterly Update page...');
        await newPage.waitForLoadState('networkidle');
        expect(newPage.url()).toContain('quarterly-update');
        console.log('✓ On Quarterly Update page');

        // Step 5: Click "Build a custom report" button
        console.log('Step 5: Clicking Build Custom Report button...');
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await expect(buildReportButton).toBeVisible();
        await expect(buildReportButton).toBeEnabled();
        await buildReportButton.click();
        console.log('✓ Build Custom Report button clicked');

        // Step 6: Verify navigation to report-builder
        console.log('Step 6: Verifying navigation to report-builder...');
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toBe('https://platform.dev-simmons.com/navigator/quarterly-update/report-builder');
        console.log('✓ On report-builder page');

        // Step 7: Click "Extract Status Tables" option card
        console.log('Step 7: Selecting Extract Status Tables option...');
        const extractStatusCard = newPage.locator('span.s-option-card__label:has-text("Extract Status Tables")').locator('..');
        await extractStatusCard.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(1000);
        console.log('✓ Extract Status Tables option selected');

        // Step 8: Select all services using "Select all" button
        console.log('Step 8: Selecting all services...');
        const selectAllServicesButton = newPage.locator('button.s-button.ghost:has-text("Select all")').first();
        await selectAllServicesButton.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All services selected');

        // Step 9: Select all regions using "Select all" button
        console.log('Step 9: Selecting all regions...');
        const selectAllRegionsButton = newPage.locator('button.s-button.ghost:has-text("Select all")').nth(1);
        await selectAllRegionsButton.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All regions selected');

        // Step 10: Select jurisdictions
        console.log('Step 10: Selecting jurisdictions...');
        const jurisdictionsDropdown = newPage.locator('span.s-checkbox-select-dropdown__label').first();
        await jurisdictionsDropdown.scrollIntoViewIfNeeded();
        await jurisdictionsDropdown.click();
        await newPage.waitForTimeout(1000);
        
        const jurisdictionsSelectAll = newPage.locator('span.s-checkbox-select-dropdown__option-label:has-text("Select all")');
        await jurisdictionsSelectAll.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All jurisdictions selected');
        
        // Close jurisdictions dropdown
        await newPage.keyboard.press('Escape');
        await newPage.waitForTimeout(1000);
        console.log('✓ Jurisdictions dropdown closed');

        // Step 11: Select all change types using "Select all" button
        console.log('Step 11: Selecting all change types...');
        const changeTypeSelectAll = newPage.locator('button.s-button.ghost:has-text("Select all")').last();
        await changeTypeSelectAll.scrollIntoViewIfNeeded();
        await changeTypeSelectAll.click();
        await newPage.waitForTimeout(1000);
        console.log('✓ All change types selected');

        // Step 12: Select February 2026 timeframe
        console.log('Step 12: Selecting February 2026 timeframe...');
        const februaryPill = newPage.locator('button.report-builder-timeframe__pill:has-text("February 2026")');
        await februaryPill.scrollIntoViewIfNeeded();
        await februaryPill.click();
        await newPage.waitForTimeout(1000);
        await expect(februaryPill).toHaveClass(/report-builder-timeframe__pill--active/);
        console.log('✓ February 2026 selected');

        // Step 13: Click Generate Report button
        console.log('Step 13: Generating status table (can take 1-2 minutes)...'); const generateButton = newPage.locator('button:has(span.button-text:has-text("Generate report"))');
        await generateButton.click();
        console.log('✓ Generate report clicked');

        // Step 14: Wait for URL to change to status-table-results (no progress steps for Extract Status Tables)
        console.log('Step 14: Waiting for status table generation to complete...');
        await newPage.waitForURL('**/status-table-results', { timeout: 180000 });
        console.log('✓ URL changed to status-table-results');

        // Step 15: Verify URL contains status-table-results
        console.log('Step 15: Verifying URL is status-table-results...');
        await newPage.waitForTimeout(2000);
        const currentUrl = newPage.url();
        console.log(`Current URL: ${currentUrl}`);
        expect(currentUrl).toContain('status-table-results');
        console.log('✓ Status table generated successfully');

        console.log('\n✓ Test completed successfully - Extract status table generated!');
    });

    test('Status table display columns functionality - toggle Changes and Forthcoming Changes', async ({ page }) => {
        test.setTimeout(240000); // 4 minutes timeout
        
        const quarterlyUpdate = new NavigatorQuarterlyUpdate(page);

        console.log('\n=== Test: Display Columns Toggle Functionality ===\n');

        // Steps 1-12: Generate status table with only "Changes" selected (not "Forthcoming Changes")
        console.log('Step 1: Logging in...');
        await quarterlyUpdate.login();
        await expect(await quarterlyUpdate.isLoginSuccessful()).toBeTruthy();
        console.log('✓ Login successful');

        console.log('Step 2: Navigating to Navigator page...');
        await page.goto('https://platform.dev-simmons.com/navigator/');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);
        
        console.log('Step 3: Clicking Quarterly Update link...');
        const pages = await quarterlyUpdate.clickQuarterlyUpdateLinkAndGetNewTab();
        const newPage = pages.newPage;
        console.log('✓ Quarterly Update opened in new tab');

        console.log('Step 4: Verifying on Quarterly Update page...');
        await newPage.waitForLoadState('networkidle');
        expect(newPage.url()).toContain('quarterly-update');
        console.log('✓ On Quarterly Update page');

        console.log('Step 5: Clicking Build Custom Report button...');
        const buildReportButton = newPage.locator('button:has(span.button-text[data-v-56dea316])');
        await buildReportButton.waitFor({ state: 'visible', timeout: 15000 });
        await buildReportButton.click();
        console.log('✓ Build Custom Report button clicked');

        console.log('Step 6: Verifying navigation to report-builder...');
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(2000);
        expect(newPage.url()).toBe('https://platform.dev-simmons.com/navigator/quarterly-update/report-builder');
        console.log('✓ On report-builder page');

        console.log('Step 7: Selecting Extract Status Tables option...');
        const extractStatusCard = newPage.locator('span.s-option-card__label:has-text("Extract Status Tables")').locator('..');
        await extractStatusCard.click();
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(1000);
        console.log('✓ Extract Status Tables option selected');

        console.log('Step 8: Selecting all services...');
        const selectAllServicesButton = newPage.locator('button.s-button.ghost:has-text("Select all")').first();
        await selectAllServicesButton.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All services selected');

        console.log('Step 9: Selecting all regions...');
        const selectAllRegionsButton = newPage.locator('button.s-button.ghost:has-text("Select all")').nth(1);
        await selectAllRegionsButton.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All regions selected');

        console.log('Step 10: Selecting all jurisdictions...');
        const jurisdictionsDropdown = newPage.locator('span.s-checkbox-select-dropdown__label').first();
        await jurisdictionsDropdown.scrollIntoViewIfNeeded();
        await jurisdictionsDropdown.click();
        await newPage.waitForTimeout(1000);
        
        const jurisdictionsSelectAll = newPage.locator('span.s-checkbox-select-dropdown__option-label:has-text("Select all")');
        await jurisdictionsSelectAll.click();
        await newPage.waitForTimeout(500);
        console.log('✓ All jurisdictions selected');
        
        await jurisdictionsDropdown.click();
        await newPage.waitForTimeout(1000);
        console.log('✓ Jurisdictions dropdown closed');

        console.log('Step 11: Selecting ONLY "Changes" (not Forthcoming Changes)...');
        const changesCard = newPage.getByRole('option', { name: 'Changes', exact: true });
        await changesCard.scrollIntoViewIfNeeded();
        await changesCard.click();
        await newPage.waitForTimeout(500);
        console.log('✓ Changes selected');

        console.log('Step 12: Selecting February 2026 timeframe...');
        const februaryPill = newPage.locator('button.report-builder-timeframe__pill:has-text("February 2026")');
        await februaryPill.scrollIntoViewIfNeeded();
        await februaryPill.click();
        await newPage.waitForTimeout(1000);
        await expect(februaryPill).toHaveClass(/report-builder-timeframe__pill--active/);
        console.log('✓ February 2026 selected');

        console.log('Step 13: Generating status table...');
        const generateButton = newPage.locator('button:has(span.button-text:has-text("Generate report"))');
        await generateButton.click();
        console.log('✓ Generate report clicked');

        console.log('Step 14: Waiting for status table generation...');
        await newPage.waitForURL('**/status-table-results', { timeout: 180000 });
        await newPage.waitForTimeout(2000);
        console.log('✓ Status table generated');

        // Step 15: Verify Display columns dropdown shows "5 selected"
        console.log('Step 15: Verifying Display columns dropdown...');
        const displayColumnsButton = newPage.locator('button.s-checkbox-select-dropdown__trigger:has-text("Display columns")');
        await displayColumnsButton.waitFor({ state: 'visible', timeout: 10000 });
        const countText = await displayColumnsButton.locator('span.s-checkbox-select-dropdown__count').textContent();
        expect(countText?.trim()).toBe('5 selected');
        console.log('✓ Display columns shows "5 selected"');

        // Step 16: Open Display columns dropdown
        console.log('Step 16: Opening Display columns dropdown...');
        await displayColumnsButton.click();
        await newPage.waitForTimeout(500);
        console.log('✓ Display columns dropdown opened');

        // Step 17: Verify checkboxes state - Forthcoming Changes should NOT be checked
        console.log('Step 17: Verifying checkbox states...');
        const jurisdictionCheckbox = newPage.locator('label.s-checkbox-select-dropdown__option input').nth(0);
        const serviceCheckbox = newPage.locator('label.s-checkbox-select-dropdown__option input').nth(1);
        const dateCheckbox = newPage.locator('label.s-checkbox-select-dropdown__option input').nth(2);
        const changesCheckbox = newPage.locator('label.s-checkbox-select-dropdown__option input').nth(3);
        const forthcomingCheckbox = newPage.locator('label.s-checkbox-select-dropdown__option input').nth(4);
        const commentCheckbox = newPage.locator('label.s-checkbox-select-dropdown__option input').nth(5);

        await expect(jurisdictionCheckbox).toBeChecked();
        await expect(serviceCheckbox).toBeChecked();
        await expect(dateCheckbox).toBeChecked();
        await expect(changesCheckbox).toBeChecked();
        await expect(forthcomingCheckbox).not.toBeChecked();
        await expect(commentCheckbox).toBeChecked();
        console.log('✓ All checkboxes correct: Forthcoming Changes is NOT checked');

        // Step 18: Verify "Forthcoming Changes" column is NOT in table
        console.log('Step 18: Verifying "Forthcoming Changes" column is NOT visible...');
        const forthcomingColumnBefore = newPage.locator('span.s-data-table__header-label:has-text("Forthcoming Changes")');
        await expect(forthcomingColumnBefore).not.toBeVisible();
        console.log('✓ Forthcoming Changes column is not visible');

        // Step 19: Check "Forthcoming Changes" checkbox
        console.log('Step 19: Checking "Forthcoming Changes" checkbox...');
        await forthcomingCheckbox.click();
        await newPage.waitForTimeout(1000);
        await expect(forthcomingCheckbox).toBeChecked();
        console.log('✓ Forthcoming Changes checkbox checked');

        // Step 20: Close dropdown and verify column appears
        console.log('Step 20: Closing dropdown...');
        await newPage.keyboard.press('Escape');
        await newPage.waitForTimeout(1000);
        console.log('✓ Dropdown closed');

        console.log('Step 21: Verifying "Forthcoming Changes" column now appears...');
        const forthcomingColumnAfter = newPage.locator('span.s-data-table__header-label:has-text("Forthcoming Changes")');
        await expect(forthcomingColumnAfter).toBeVisible({ timeout: 5000 });
        console.log('✓ Forthcoming Changes column is now visible');

        console.log('\n✓ Test completed successfully - Display columns toggle functionality verified!');
    });
});
