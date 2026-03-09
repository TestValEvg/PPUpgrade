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

    // Product-Service relationship mapping
    private readonly SERVICE_PRODUCTS = {
        'Banking': ['Deposits', 'FX', 'Guarantees and Commitments', 'Payments'],
        'Corporate Finance': [], // No products available
        'Derivatives & FX': [
            'Financial Derivatives',
            'Credit Derivatives',
            'Equity Derivatives',
            'Exotic Derivatives',
            'Contracts for Differences',
            'Commodity derivatives - Cash Settled Commodity Derivatives',
            'Commodity derivatives - Non Traded Commodity Derivatives',
            'Commodity derivatives - Traded Commodity Derivatives'
        ],
        'Funds': ['Open Ended Funds', 'Closed Ended Funds'],
        'Lending': ['Lending', 'Secondary Market Loans (Secondary Market Loan Activities)'],
        'Securities': ['Closed Ended Funds', 'Equity Securities', 'Debt Securities', 'Linked Products']
    };

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
        const isVisible = await clearButton.isVisible().catch(() => false);
        if (isVisible) {
            await clearButton.click();
            await this.page.waitForTimeout(1000);
            console.log('Cleared all filters');
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

    // Select Service filter (using proven pattern from favorites)
    async selectService(service: string) {
        console.log(`Selecting service: ${service}`);
        
        await this.clickOutside();
        
        // Additional wait to ensure jurisdiction-based services are loaded
        await this.page.waitForTimeout(2000);
        
        // Click on the Service dropdown
        const serviceText = this.page.getByText('Service', { exact: true }).first();
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();

        // Wait for dropdown to open and populate with jurisdiction-specific services
        await this.page.waitForTimeout(1500);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        
        // Wait for "No options available" to disappear (if it appears initially)
        try {
            const noOptionsMessage = this.page.getByText('No options available');
            await noOptionsMessage.waitFor({ state: 'hidden', timeout: 5000 });
            console.log('Service options loaded after jurisdiction filter applied');
        } catch (error) {
            console.log('No "No options available" message, or it disappeared quickly');
        }
        
        // Additional wait after options are loaded
        await this.page.waitForTimeout(2500);

        // Search for the service
        await searchInput.clear();
        await searchInput.fill(service);

        // Wait for search to filter options
        await this.page.waitForTimeout(1500);

        // Find and click the service option
        const option = this.page.getByRole('button', { name: service });
        const optionCount = await option.count();

        if (optionCount > 0) {
            await option.first().click({ timeout: 3000 });
            console.log(`Selected service: ${service}`);
        } else {
            throw new Error(`Service ${service} not found in dropdown`);
        }

        // Wait for selection to apply
        await this.page.waitForTimeout(2500);
        await this.clickOutside();
    }

    // Check if a service is available in the dropdown
    async isServiceAvailable(service: string): Promise<boolean> {
        console.log(`Checking if service "${service}" is available`);
        
        await this.clickOutside();
        
        // Additional wait to ensure jurisdiction-based services are loaded
        await this.page.waitForTimeout(2000);
        
        // Click on the Service dropdown
        const serviceText = this.page.getByText('Service', { exact: true }).first();
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();

        // Wait for dropdown to open
        await this.page.waitForTimeout(1500);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        
        // Wait for "No options available" to disappear (if it appears initially)
        try {
            const noOptionsMessage = this.page.getByText('No options available');
            await noOptionsMessage.waitFor({ state: 'hidden', timeout: 5000 });
        } catch (error) {
            // No message or it disappeared
        }
        
        // Additional wait after options are loaded
        await this.page.waitForTimeout(2000);

        // Search for the service
        await searchInput.clear();
        await searchInput.fill(service);

        // Wait for search to filter options
        await this.page.waitForTimeout(1500);

        // Check if the service option exists
        const option = this.page.getByRole('button', { name: service });
        const count = await option.count();
        
        // Close dropdown
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
        
        console.log(`Service "${service}" available: ${count > 0}`);
        return count > 0;
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

    // Select Product filter
    async selectProduct(product: string) {
        await this.clickOutside();
        
        const productLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Product")');
        await productLabel.waitFor({ state: 'visible', timeout: 10000 });
        await productLabel.click();
        await this.page.waitForTimeout(500);

        const option = this.page.locator(`p:has-text("${product}")`).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        
        console.log(`Selected product: ${product}`);
    }

    // Get available products from dropdown
    async getAvailableProducts(): Promise<string[]> {
        await this.clickOutside();
        
        const productLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Product")');
        await productLabel.waitFor({ state: 'visible', timeout: 10000 });
        await productLabel.click();
        await this.page.waitForTimeout(1000);

        // Check if "No options available" is present
        const noOptionsText = await this.page.locator('text="No options available"').isVisible().catch(() => false);
        if (noOptionsText) {
            await this.clickOutside();
            console.log('No products available in dropdown');
            return [];
        }

        // Get all product options using the same pattern as service selection
        const productOptions = await this.page.locator('li p').allTextContents();
        
        await this.clickOutside();
        
        const products = productOptions.map(p => p.trim()).filter(p => p.length > 0);
        console.log('Available products found:', products);
        return products;
    }

    // Verify Product options match expected list for selected service
    async verifyProductOptionsForService(service: string) {
        const expectedProducts = this.SERVICE_PRODUCTS[service as keyof typeof this.SERVICE_PRODUCTS];
        
        if (expectedProducts === undefined) {
            throw new Error(`Unknown service: ${service}`);
        }

        if (expectedProducts.length === 0) {
            // Corporate Finance has no products - verify Product dropdown is disabled/hidden or shows "No options available"
            await this.clickOutside();
            await this.page.waitForTimeout(1000);
            
            const productLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Product")');
            const isProductVisible = await productLabel.isVisible().catch(() => false);
            
            if (!isProductVisible) {
                console.log(`✓ Verified: ${service} has no product dropdown (hidden/disabled as expected)`);
                return;
            }
            
            // If visible, check if it shows "No options available"
            await productLabel.click();
            await this.page.waitForTimeout(500);

            const noOptionsText = this.page.locator('text="No options available"');
            const noOptionsVisible = await noOptionsText.isVisible().catch(() => false);
            
            await this.clickOutside();
            
            if (!noOptionsVisible) {
                throw new Error(`Expected "No options available" for ${service}, but found options`);
            }
            
            console.log(`✓ Verified: ${service} has no product options`);
            return;
        }

        const availableProducts = await this.getAvailableProducts();
        
        // Check if all expected products are available
        for (const expectedProduct of expectedProducts) {
            const found = availableProducts.some(p => 
                p.toLowerCase().includes(expectedProduct.toLowerCase()) || 
                expectedProduct.toLowerCase().includes(p.toLowerCase())
            );
            
            if (!found) {
                console.log(`Expected product "${expectedProduct}" not found for service "${service}". Available: ${availableProducts.join(', ')}`);
                throw new Error(`Expected product "${expectedProduct}" not found for service "${service}". Available: ${availableProducts.join(', ')}`);
            }
        }
        
        console.log(`✓ Verified: All expected products available for ${service}`);
        console.log(`  Expected: ${expectedProducts.join(', ')}`);
        console.log(`  Found: ${availableProducts.join(', ')}`);
    }

    // Get expected products for a service
    getExpectedProductsForService(service: string): string[] {
        return this.SERVICE_PRODUCTS[service as keyof typeof this.SERVICE_PRODUCTS] || [];
    }
}
