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
        await this.page.goto('https://platform1.test-simmons.com/navigator/');
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
        const resultsContainer = this.page.locator(NAVIGATOR_SELECTORS.resultsContainer);
        await resultsContainer.waitFor({ state: 'visible', timeout: 20000 });
        await this.page.waitForTimeout(2000);
    }

    // Click Print button
    async clickPrintButton() {
        const printButton = this.page.locator(NAVIGATOR_SELECTORS.printButton);
        await printButton.waitFor({ state: 'visible', timeout: 10000 });
        await printButton.click();
    }

    // Verify print button is visible
    async verifyPrintButtonVisible() {
        const printButton = this.page.locator(NAVIGATOR_SELECTORS.printButton);
        await expect(printButton).toBeVisible();
    }
}
