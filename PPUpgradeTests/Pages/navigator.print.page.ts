import { Page, expect } from '@playwright/test';
import { NAVIGATOR_SELECTORS } from '../Utilits/navigator.selectors';

/**
 * Navigator Print Page Object Model
 * Handles print functionality for Navigator search results
 */
export class NavigatorPrint {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navigate to Navigator page
    async navigateToNavigator() {
        await this.page.goto('https://platform.test-simmons.com/navigator/');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    // Click outside to close any open dropdowns
    async clickOutside() {
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(300);
    }

    // Select Jurisdiction filter
    async selectJurisdiction(jurisdiction: string) {
        await this.clickOutside();
        
        const jurisdictionText = this.page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible' });
        await jurisdictionText.click();

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.fill(jurisdiction);

        const option = this.page.getByRole('button', { name: `${jurisdiction} ${jurisdiction}` });
        await option.waitFor({ state: 'visible' });
        await option.click();

        await this.clickOutside();
    }

    // Select Service filter
    async selectService(service: string) {
        await this.clickOutside();
        
        const serviceText = this.page.getByText('Service', { exact: true });
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.fill(service);

        const option = this.page.getByRole('button', { name: service });
        await option.waitFor({ state: 'visible' });
        await option.click();

        await this.clickOutside();
    }

    // Select All services
    async selectAllServices() {
        await this.clickOutside();
        
        const serviceText = this.page.getByText('Service', { exact: true });
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();

        // Wait for dropdown to appear and click "All" option
        await this.page.waitForTimeout(500);
        const allOption = this.page.getByText('All', { exact: true }).first();
        await allOption.waitFor({ state: 'visible', timeout: 10000 });
        await allOption.click();

        await this.clickOutside();
    }

    // Click Search button
    async clickSearch() {
        const searchButton = this.page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible' });
        await expect(searchButton).toBeEnabled();
        await searchButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
    }

    // Wait for results to appear
    async waitForResults() {
        // Wait for the JURISDICTION ANALYSIS section to be visible
        await this.page.getByText('JURISDICTION ANALYSIS').waitFor({ state: 'visible', timeout: 20000 });
        // Brief wait for initial render
        await this.page.waitForTimeout(1500);
    }

    // Click Expand All button to enable print
    async clickExpandAll() {
        const expandAllButton = this.page.getByRole('button', { name: 'Expand All' });
        await expandAllButton.waitFor({ state: 'visible', timeout: 10000 });
        await expandAllButton.click();
        // Wait for expansion to complete
        await this.page.waitForTimeout(2000);
    }

    // Click Print button - top right corner print icon
    async clickPrintButton() {
        // Print button with icon class
        const printButton = this.page.locator('button:has(.s-icon--print)');
        
        // Wait for button to be visible
        await printButton.waitFor({ state: 'visible', timeout: 10000 });
        
        // Force click to bypass any loading overlays
        await printButton.click({ force: true });
        
        // Wait longer for print dialog/modal to appear - increased wait time
        await this.page.waitForTimeout(5000);
    }

    // Verify Print to PDF button appears in print dialog
    async verifyPrintToPDFButton() {
        // Additional wait for print dialog to fully load
        await this.page.waitForTimeout(3000);
        
        const printToPDFButton = this.page.getByRole('button', { name: 'Print to PDF' });
        await expect(printToPDFButton).toBeVisible({ timeout: 15000 });
    }

    // Verify print button is visible
    async verifyPrintButtonVisible() {
        const printButton = this.page.locator('button:has(.s-icon--print)');
        await expect(printButton).toBeVisible({ timeout: 10000 });
    }

    // Verify filter applied message is visible
    async verifyFilterMessageVisible() {
        await expect(
            this.page.getByText(
                'Due to the search filters applied, not all navigator content for the selected jurisdiction will be exported.'
            )
        ).toBeVisible({ timeout: 10000 });
    }

    // Verify filter applied message is NOT visible
    async verifyFilterMessageNotVisible() {
        await expect(
            this.page.getByText(
                'Due to the search filters applied, not all navigator content for the selected jurisdiction will be exported.'
            )
        ).not.toBeVisible({ timeout: 5000 });
    }
}
