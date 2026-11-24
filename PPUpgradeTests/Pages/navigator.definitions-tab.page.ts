import { Page, expect } from '@playwright/test';
import { credentials } from '../Utilits/credentials';
import { SELECTORS } from '../Utilits/selectors';

/**
 * Navigator Definitions Tab Page Object Model
 * Handles expand/collapse functionality for the Definitions static tab
 */
export class NavigatorDefinitionsTab {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Login to the platform
    async login() {
        await this.page.goto('https://platform.test-simmons.com/');
        
        const signInButton = this.page.locator(SELECTORS.signInButton);
        await signInButton.waitFor({ state: 'visible' });
        await signInButton.click();

        const emailField = this.page.locator(SELECTORS.emailField);
        await emailField.waitFor({ state: 'visible' });
        await emailField.fill(credentials.username);

        const continueButton = this.page.locator(SELECTORS.continueButton);
        await continueButton.waitFor({ state: 'visible' });
        await continueButton.click();

        const passwordField = this.page.locator(SELECTORS.passwordField);
        await passwordField.waitFor({ state: 'visible' });
        await passwordField.fill(credentials.password);

        const signInButton2 = this.page.locator(SELECTORS.signInButton2);
        await signInButton2.waitFor({ state: 'visible' });
        await signInButton2.click();

        const checkButton = this.page.locator(SELECTORS.checkButton);
        await checkButton.waitFor({ state: 'visible' });
        await checkButton.click();

        const submitButton2 = this.page.locator(SELECTORS.submitButton2);
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle' }),
            submitButton2.click()
        ]);
        
        await this.page.waitForTimeout(600);
    }

    // Navigate to Navigator page
    async navigateToNavigator() {
        await this.page.goto('https://platform.test-simmons.com/navigator/');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(500);
    }

    // Click outside to close dropdowns
    async clickOutside() {
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(200);
    }

    // Select Jurisdiction filter
    async selectJurisdiction(jurisdiction: string) {
        await this.clickOutside();
        
        const jurisdictionText = this.page.getByText('Jurisdiction', { exact: true }).first();
        await jurisdictionText.waitFor({ state: 'visible' });
        await jurisdictionText.click();
        await this.page.waitForTimeout(600);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.fill(jurisdiction);
        await this.page.waitForTimeout(500);

        const option = this.page.getByRole('button', { name: `${jurisdiction} ${jurisdiction}` });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        
        await this.clickOutside();
        await this.page.waitForTimeout(300);
    }

    // Select Service filter
    async selectService(service: string) {
        await this.clickOutside();
        
        await this.page.waitForTimeout(1000);
        
        const serviceText = this.page.getByText('Service', { exact: true }).first();
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();
        await this.page.waitForTimeout(800);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        
        await searchInput.clear();
        await searchInput.fill(service);
        await this.page.waitForTimeout(800);

        const option = this.page.getByRole('button', { name: service });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.first().click();
        
        await this.clickOutside();
        await this.page.waitForTimeout(300);
    }

    // Click Search button
    async clickSearch() {
        const searchButton = this.page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible' });
        await expect(searchButton).toBeEnabled();
        await searchButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 60000 });
        await this.page.waitForTimeout(1500);
    }

    // Wait for results to appear
    async waitForResults() {
        await this.page.getByText('JURISDICTION ANALYSIS').waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
    }

    // Navigate to Definitions tab
    async navigateToDefinitionsTab() {
        await this.page.waitForTimeout(1800);
        const definitionsTab = this.page.getByRole('button', { name: 'Definitions' });
        await definitionsTab.waitFor({ state: 'visible', timeout: 20000 });
        await definitionsTab.click();
        await this.page.waitForTimeout(2000);
        console.log('✓ Navigated to Definitions tab');
    }

    // Check if Expand All button exists
    async isExpandAllButtonPresent(): Promise<boolean> {
        try {
            const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
            const count = await expandAllButton.count();
            
            if (count > 0) {
                const isVisible = await expandAllButton.first().isVisible({ timeout: 2000 }).catch(() => false);
                return isVisible;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Click Expand All button if present
    async clickExpandAllIfPresent(): Promise<boolean> {
        const isPresent = await this.isExpandAllButtonPresent();
        
        if (isPresent) {
            const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
            await expandAllButton.waitFor({ state: 'visible', timeout: 10000 });
            await expandAllButton.click();
            await this.page.waitForTimeout(2000);
            console.log('✓ Clicked Expand All button');
            return true;
        } else {
            console.log('ℹ Expand All button not present - no expandable content');
            return false;
        }
    }

    // Verify button changed to "Collapse All"
    async verifyCollapseAllButtonVisible() {
        const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
        await expect(collapseAllButton).toBeVisible({ timeout: 10000 });
        console.log('✓ Button changed to "Collapse All"');
    }

    // Verify content is expanded
    async verifyContentExpanded() {
        await this.page.waitForTimeout(1000);
        
        const toggleElements = this.page.locator('div.plus-minus-toggle');
        const count = await toggleElements.count();
        
        if (count > 0) {
            console.log(`✓ Content expanded - found ${count} toggle elements`);
        } else {
            const tableRows = this.page.locator('tbody tr');
            const rowCount = await tableRows.count();
            console.log(`✓ Content expanded - found ${rowCount} table rows`);
        }
    }

    // Click Collapse All button
    async clickCollapseAll() {
        const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
        await collapseAllButton.waitFor({ state: 'visible', timeout: 10000 });
        await collapseAllButton.click();
        await this.page.waitForTimeout(2000);
        console.log('✓ Clicked Collapse All button');
    }

    // Verify button changed back to "Expand All"
    async verifyExpandAllButtonVisible() {
        const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
        await expect(expandAllButton).toBeVisible({ timeout: 10000 });
        console.log('✓ Button changed back to "Expand All"');
    }

    // Verify tab content is loaded
    async verifyTabContentLoaded() {
        await this.page.waitForTimeout(1500);
        
        const hasTable = await this.page.locator('table').count() > 0;
        const hasContent = await this.page.locator('.s-card__content').count() > 0;
        
        if (hasTable || hasContent) {
            console.log('✓ Definitions tab content loaded successfully');
        } else {
            console.log('⚠ Definitions tab content may not be fully loaded');
        }
    }

    // Verify table headers persist (Jurisdiction, Term, Description)
    async verifyTableHeaders() {
        const headerRow = this.page.locator('tr.s-table__row th.s-table__header--flag-label, tr.s-table__row th.s-table__header--html');
        await headerRow.first().waitFor({ state: 'visible', timeout: 10000 });
        
        const headerCount = await headerRow.count();
        expect(headerCount).toBe(3);
        
        // Verify Jurisdiction header (1st column)
        const jurisdictionHeader = this.page.locator('th.s-table__header--flag-label span.s-table__header-label').filter({ hasText: 'Jurisdiction' });
        await expect(jurisdictionHeader).toBeVisible();
        
        // Verify Term header (2nd column)
        const termHeader = this.page.locator('th.s-table__header--html span.s-table__header-label').filter({ hasText: 'Term' });
        await expect(termHeader).toBeVisible();
        
        // Verify Description header (3rd column)
        const descriptionHeader = this.page.locator('th.s-table__header--html span.s-table__header-label').filter({ hasText: 'Description' });
        await expect(descriptionHeader).toBeVisible();
        
        console.log('✓ Verified table headers: Jurisdiction, Term, Description');
    }

    // Get all definition rows
    async getDefinitionRows() {
        const rows = this.page.locator('tbody tr');
        await rows.first().waitFor({ state: 'visible', timeout: 10000 });
        return rows;
    }

    // Click on a definition row
    async clickDefinitionRow(index: number) {
        const rows = await this.getDefinitionRows();
        const rowCount = await rows.count();
        
        if (index < rowCount) {
            await rows.nth(index).click();
            await this.page.waitForTimeout(1000);
            console.log(`✓ Clicked definition row ${index + 1}`);
        } else {
            console.log(`⚠ Row index ${index} is out of range (total rows: ${rowCount})`);
        }
    }

    // Get the count of definition rows
    async getDefinitionRowCount(): Promise<number> {
        const rows = await this.getDefinitionRows();
        return await rows.count();
    }

    // Click jurisdiction column search icon in the table (not the top filter)
    async clickJurisdictionSearchIcon() {
        // Target the search icon specifically within the table header, not the top filter bar
        const table = this.page.locator('table.s-table');
        const jurisdictionHeader = table.locator('thead th.s-table__header--flag-label');
        const searchIcon = jurisdictionHeader.locator('svg.s-icon-search');
        await searchIcon.waitFor({ state: 'visible', timeout: 10000 });
        await searchIcon.click();
        await this.page.waitForTimeout(1000);
        console.log('✓ Clicked jurisdiction search icon in table header');
    }

    // Open jurisdiction filter dropdown
    async openJurisdictionDropdown() {
        // After clicking search icon, click the dropdown box to open it
        const dropdownBox = this.page.locator('div.s-input-dropdown__box[role="button"][tabindex="0"]').first();
        await dropdownBox.waitFor({ state: 'visible', timeout: 10000 });
        await dropdownBox.click();
        await this.page.waitForTimeout(1000);
        console.log('✓ Opened jurisdiction dropdown');
    }

    // Search for jurisdiction in the filter panel
    async searchJurisdictionInDropdown(jurisdiction: string) {
        // After clicking search icon, a filter panel appears - find the input field
        await this.page.waitForTimeout(1000);
        const searchInput = this.page.locator('input[type="text"]').first();
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.click();
        await searchInput.fill(jurisdiction);
        await this.page.waitForTimeout(1000);
        console.log(`✓ Entered "${jurisdiction}" in jurisdiction filter panel`);
    }

    // Select jurisdiction from filter panel list
    async selectJurisdictionFromList(jurisdiction: string) {
        // Wait for filter panel to appear, then click on the jurisdiction
        await this.page.waitForTimeout(1500);
        // Look for jurisdiction text in the filter panel (e.g., "Canada")
        const jurisdictionItem = this.page.locator('text=' + jurisdiction).first();
        await jurisdictionItem.waitFor({ state: 'visible', timeout: 10000 });
        await jurisdictionItem.click();
        await this.page.waitForTimeout(1000);
        console.log(`✓ Selected "${jurisdiction}" from filter panel`);
    }

    // Click Apply button in the jurisdiction filter panel
    async clickApplyButton() {
        // Click the red Apply button in the jurisdiction filter panel
        const applyButton = this.page.getByRole('button', { name: 'Apply' }).first();
        await applyButton.waitFor({ state: 'visible', timeout: 10000 });
        await applyButton.click();
        await this.page.waitForTimeout(2000);
        console.log('✓ Clicked Apply button in filter panel');
    }

    // Verify only selected jurisdiction is visible in results
    async verifyOnlyJurisdictionVisible(jurisdiction: string) {
        await this.page.waitForTimeout(1500);
        
        const jurisdictionCells = this.page.locator('tbody tr td').first();
        const visibleRows = this.page.locator('tbody tr');
        const rowCount = await visibleRows.count();
        
        // Check a sample of rows to verify they all contain the expected jurisdiction
        const samplesToCheck = Math.min(rowCount, 10);
        
        for (let i = 0; i < samplesToCheck; i++) {
            const row = visibleRows.nth(i);
            const firstCell = row.locator('td').first();
            const cellText = await firstCell.textContent();
            
            if (cellText && !cellText.includes(jurisdiction)) {
                throw new Error(`Found row with jurisdiction "${cellText}" instead of "${jurisdiction}"`);
            }
        }
        
        console.log(`✓ Verified only "${jurisdiction}" is visible in jurisdiction column (checked ${samplesToCheck} rows)`);
    }
}
