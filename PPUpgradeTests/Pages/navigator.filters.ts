import { Page, expect } from '@playwright/test';
import { NAVIGATOR_SELECTORS } from '../Utilits/navigator.selectors';

/**
 * Navigator Licensing Restrictions Filter Page Object Model
 * 
 * General Service Suppression Rules (Azure DevOps Work Item 108651):
 * - General is HIDDEN from Service filter dropdown (never visible in UI)
 * - General ONLY appears in search RESULTS (after clicking Search)
 * - General is SUPPRESSED if ANY of: Banking, Corporate Finance, OR Lending are selected
 * - General APPEARS if NONE of: Banking, Corporate Finance, OR Lending are selected
 */
export class NavigatorFilters {
    private page: Page;

    // Services that suppress General when selected
    private readonly GENERAL_SUPPRESSING_SERVICES = ['Banking', 'Corporate Finance', 'Lending'];

    constructor(page: Page) {
        this.page = page;
    }

    // Navigate to Navigator Licensing Restrictions page
    async navigateToLicensingRestrictions() {
        await this.page.goto('https://platform.test-simmons.com/navigator/compare/licensing?version=118504-implement-migrating-nav-70613-1');
        await this.page.waitForLoadState('networkidle');
    }

    // Click outside to close any open dropdowns
    async clickOutside() {
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(300);
    }

    // Clear all filter selections
    async clearAllFilters() {
        const clearButton = this.page.locator(NAVIGATOR_SELECTORS.clearButton);
        if (await clearButton.isVisible()) {
            await clearButton.click();
            await this.page.waitForLoadState('networkidle');
        }
    }

    // Select Jurisdiction filter
    async selectJurisdiction(jurisdiction: string) {
        await this.clickOutside();
        
        const jurisdictionButton = this.page.locator(NAVIGATOR_SELECTORS.jurisdictionButton);
        await jurisdictionButton.waitFor({ state: 'visible' });
        await jurisdictionButton.click();

        const searchInput = this.page.locator(NAVIGATOR_SELECTORS.searchInput);
        await searchInput.fill(jurisdiction);

        const option = this.page.locator(`p:has-text("${jurisdiction}")`);
        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    // Select multiple jurisdictions
    async selectJurisdictions(jurisdictions: string[]) {
        await this.clickOutside();
        
        const jurisdictionButton = this.page.locator(NAVIGATOR_SELECTORS.jurisdictionButton);
        await jurisdictionButton.waitFor({ state: 'visible' });
        await jurisdictionButton.click();

        for (const jurisdiction of jurisdictions) {
            const searchInput = this.page.locator(NAVIGATOR_SELECTORS.searchInput);
            await searchInput.fill(jurisdiction);

            const option = this.page.locator(`p:has-text("${jurisdiction}")`);
            await option.waitFor({ state: 'visible' });
            await option.click();
        }

        await this.clickOutside();
    }

    // Select Service filter
    async selectService(service: string) {
        await this.clickOutside();
        
        const serviceButton = this.page.locator(NAVIGATOR_SELECTORS.serviceButton);
        await serviceButton.waitFor({ state: 'visible' });
        await serviceButton.click();

        const option = this.page.locator(`p:has-text("${service}")`);
        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    // Select multiple services
    async selectServices(services: string[]) {
        await this.clickOutside();
        
        const serviceButton = this.page.locator(NAVIGATOR_SELECTORS.serviceButton);
        await serviceButton.waitFor({ state: 'visible' });
        await serviceButton.click();

        for (const service of services) {
            const option = this.page.locator(`p:has-text("${service}")`);
            await option.waitFor({ state: 'visible' });
            await option.click();
        }

        await this.clickOutside();
    }

    // Click Search button
    async clickSearch() {
        const searchButton = this.page.locator(NAVIGATOR_SELECTORS.searchButton);
        await searchButton.waitFor({ state: 'visible' });
        await searchButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // Verify Search button is enabled
    async verifySearchButtonEnabled() {
        const searchButton = this.page.locator('button:has-text("Search")');
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });
        
        const isDisabled = await searchButton.getAttribute('disabled');
        expect(isDisabled).toBeNull();
    }

    // Verify Search button is disabled
    async verifySearchButtonDisabled() {
        const searchButton = this.page.locator('button:has-text("Search")');
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });
        
        const isDisabled = await searchButton.getAttribute('disabled');
        expect(isDisabled).not.toBeNull();
    }

    // Get all service headings from search results
    async getServiceHeadingsFromResults(): Promise<string[]> {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('h4', { timeout: 10000 }).catch(() => {});
        
        const headings = await this.page.locator('h4').allTextContents();
        const services = ['Banking', 'Corporate Finance', 'General', 'Derivatives & FX', 'Lending', 'Securities', 'Funds'];
        
        return headings.filter(h => services.includes(h.trim()));
    }

    // Verify General is NOT in results (suppressed)
    async verifyGeneralSuppressed() {
        const serviceHeadings = await this.getServiceHeadingsFromResults();
        expect(serviceHeadings).not.toContain('General');
    }

    // Verify General IS in results (displayed)
    async verifyGeneralDisplayed() {
        const serviceHeadings = await this.getServiceHeadingsFromResults();
        expect(serviceHeadings).toContain('General');
    }

    // Verify specific services are in results
    async verifyServicesInResults(expectedServices: string[]) {
        const serviceHeadings = await this.getServiceHeadingsFromResults();
        
        for (const service of expectedServices) {
            expect(serviceHeadings).toContain(service);
        }
    }

    // Check if General should be suppressed based on selected services
    shouldGeneralBeSuppressed(selectedServices: string[]): boolean {
        return selectedServices.some(service => 
            this.GENERAL_SUPPRESSING_SERVICES.includes(service)
        );
    }

    // Verify General visibility based on filter rules
    async verifyGeneralVisibilityRules(selectedServices: string[]) {
        const shouldSuppress = this.shouldGeneralBeSuppressed(selectedServices);
        
        if (shouldSuppress) {
            await this.verifyGeneralSuppressed();
        } else {
            await this.verifyGeneralDisplayed();
        }
    }

    // Verify General is NOT visible in Service filter dropdown
    async verifyGeneralNotInServiceFilter() {
        await this.clickOutside();
        
        const serviceButton = this.page.locator(NAVIGATOR_SELECTORS.serviceButton);
        await serviceButton.waitFor({ state: 'visible' });
        await serviceButton.click();

        // Get all service options
        const serviceOptions = await this.page.locator('div.s-input-dropdown__list p').allTextContents();
        
        // General should NOT be in the list
        expect(serviceOptions).not.toContain('General');
        
        await this.clickOutside();
    }

    // Get number of jurisdictions selected
    async getSelectedJurisdictionCount(): Promise<number> {
        const jurisdictionButton = this.page.locator(NAVIGATOR_SELECTORS.jurisdictionButton);
        const text = await jurisdictionButton.textContent();
        
        const match = text?.match(/(\d+)\s+selected/);
        return match ? parseInt(match[1]) : 0;
    }

    // Get number of services selected
    async getSelectedServiceCount(): Promise<number> {
        const serviceButton = this.page.locator(NAVIGATOR_SELECTORS.serviceButton);
        const text = await serviceButton.textContent();
        
        const match = text?.match(/(\d+)\s+selected/);
        return match ? parseInt(match[1]) : 0;
    }

    // Wait for results to load
    async waitForResults(timeout: number = 10000) {
        await this.page.waitForSelector('h4', { timeout });
    }
}
