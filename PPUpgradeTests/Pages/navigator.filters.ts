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

    // Activity-Service relationship mapping (common activities for each service)
    private readonly SERVICE_ACTIVITIES = {
        'Banking': [
            'Banking activities in scope',
            'Deposit Taking',
            'Foreign Exchange Trading',
            'Guarantees and Commitments',
            'Payments',
            'Reach In treatment',
            'Fly In treatment',
            'Fly Out treatment',
            'Client Type',
            'End Client / Counterparty is locally licensed',
            'Existing Client',
            'Intermediation',
            'Nominee Accounts',
            'Offshore Accounts',
            'EU Passport',
            'MiFID Exemptions',
            'Ancillary Services Exemptions',
            'Other Local Exemptions',
            'Tolerated Market Practice',
            'Legal Basis',
            'What constitutes an unsolicited approach?',
            'Limitations to the response',
            'Third party referrals',
            'Relationship or transaction based',
            'Record keeping',
            'Marketing materials - additional considerations',
            'Other local restrictions'
        ],
        'Securities': [
            'Securities Products',
            'Marketing by a third party entity',
            'Reach In treatment',
            'Fly In treatment',
            'Fly Out treatment',
            'Will use of Local Licensed Entity or Intermediary',
            'Pre-Marketing',
            'Generic Marketing Regime',
            'Private Placement Regime',
            'Other Local Law Licence or Exemption available',
            'Tolerated Market Practice available?',
            'Is Product registration available?',
            'Avoiding a Public Offer',
            'Civil/Administrative sanctions',
            'Criminal sanctions',
            'Risk of liability',
            'Risk of unenforceability',
            'Enforcement trends',
            'Marketing materials - additional considerations',
            'Selling restriction language / Legends for services',
            'Possibility of public offer',
            'Other local restrictions',
            'On sale liability',
            'Market abuse and insider dealing',
            // General activities (added to all services except Banking, CF, Lending)
            'Cold calling',
            'Product intervention considerations',
            'PRIIPS/ KID considerations',
            'Cross Border conduct considerations',
            'Currency name',
            'General',
            'Trading restriction',
            'Transfer/ Payment restrictions',
            'Repatriation restrictions',
            'Conversion restrictions',
            'Offshore Account restrictions',
            'Reference currency',
            'Territorial reach of currency controls',
            'Other restrictions',
            'Availability of exemptions',
            'Reporting requirements',
            'Sanctions',
            'Irrevocability of payment instruction',
            'Finality of currency transfer',
            'Impact of bankruptcy',
            'Zero hour rule',
            'Local payment and securities settlement',
            'Capacity and Authority',
            'Contract (including but not limited to information on: local representations and warranties, and location of contract execution if applicable)',
            'Governing law/ jurisdiction'
        ]
    };

    // Product-Activity relationship mapping (activities specific to products within each service)
    private readonly PRODUCT_ACTIVITIES = {
        // Banking products
        'Deposits': ['Deposit Taking'],
        'FX': ['Foreign Exchange Trading'],
        'Guarantees and Commitments': ['Guarantees and Commitments'],
        'Payments': ['Payments'],
        // Securities products (using actual UI product names)
        // NOTE: Excluding hidden products: Debt Securities, Equity Securities (per hidden rules)
        'Closed Ended Funds': ['Securities Products'],
        'Linked Products': ['Securities Products']
    };

    // Activity-SubActivity relationship mapping (subactivities specific to activities within each service)
    private readonly ACTIVITY_SUBACTIVITIES = {
        // Banking activities
        'Deposit Taking': [
            'Certificates of deposit',
            'Current account',
            'Deposits',
            'Structured deposits',
            'Sweep deposit accounts',
            'Term deposits'
        ],
        'Foreign Exchange Trading': [], // No subactivities
        'Guarantees and Commitments': [], // No subactivities
        'Payment Services': [], // No subactivities
        // Securities activities
        'Marketing by a third party entity': [], // No subactivities
        'Securities Products': [], // No subactivities
        'Marketing materials - additional considerations': [
            'Additional financial promotions regimes (if applicable)',
            'Selling restriction language / Legends for services'
        ],
        'Other local restrictions': ['Investment restrictions'],
        // General activities (added to Securities and other services except Banking, CF, Lending)
        'Cold calling': [], // No subactivities
        'Product intervention considerations': [], // No subactivities
        'PRIIPS/ KID considerations': [], // No subactivities
        'Cross Border conduct considerations': [
            'Application of COB rules / continuing obligations / disapplications',
            'Client money',
            'Client assets',
            'Local call and investor restrictions'
        ],
        'Currency name': [], // No subactivities
        'General': [], // No subactivities
        'Trading restriction': [], // No subactivities
        'Transfer/ Payment restrictions': [], // No subactivities
        'Repatriation restrictions': [], // No subactivities
        'Conversion restrictions': [], // No subactivities
        'Offshore Account restrictions': [], // No subactivities
        'Reference currency': [], // No subactivities
        'Territorial reach of currency controls': [], // No subactivities
        'Other restrictions': [], // No subactivities
        'Availability of exemptions': [], // No subactivities
        'Reporting requirements': [], // No subactivities
        'Sanctions': [], // No subactivities
        'Irrevocability of payment instruction': [], // No subactivities
        'Finality of currency transfer': [], // No subactivities
        'Impact of bankruptcy': [], // No subactivities
        'Zero hour rule': [], // No subactivities
        'Local payment and securities settlement': [], // No subactivities
        'Capacity and Authority': [
            'Does the guidance set out in the Capacity and Authority Grid apply without exception in the jurisdiction?'
        ],
        'Contract (including but not limited to information on: local representations and warranties, and location of contract execution if applicable)': [], // No subactivities
        'Governing law/ jurisdiction': [
            'Recognition of choice of law - Will the jurisdictions courts recognise the choice of law?',
            'Arbitration - Is the jurisdiction a signatory to the New York Convention?',
            'Arbitration - Is arbitration an accepted method of dispute resolution in the jurisdiction?',
            'Foreign judgments - Are foreign judgments recognised under local law?',
            'Validity and Enforceability of Contracts - Are financial contracts enforceable under local law?',
            'Validity and Enforceability of Contracts - Is the law of the jurisdiction, for the purposes of contract law, statute or contract based?',
            'Sovereign immunity - Can entities claim sovereign immunity under local law?'
        ]
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
        
        const jurisdictionText = this.page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible' });
        await jurisdictionText.click();
        await this.page.waitForTimeout(300);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.fill(jurisdiction);
        await this.page.waitForTimeout(500);

        const option = this.page.getByRole('button', { name: `${jurisdiction} ${jurisdiction}` });
        await option.waitFor({ state: 'visible' });
        await option.click();
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    // Select multiple jurisdictions
    async selectJurisdictions(jurisdictions: string[]) {
        await this.clickOutside();
        
        const jurisdictionText = this.page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible' });
        await jurisdictionText.click();
        await this.page.waitForTimeout(300);

        for (const jurisdiction of jurisdictions) {
            const searchInput = this.page.getByPlaceholder('Search items');
            await searchInput.clear();
            await searchInput.fill(jurisdiction);
            await this.page.waitForTimeout(500);

            const option = this.page.getByRole('button', { name: `${jurisdiction} ${jurisdiction}` });
            await option.waitFor({ state: 'visible' });
            await option.click();
        }

        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    // Select Service filter (using proven pattern from favorites)
    async selectService(service: string) {
        console.log(`Selecting service: ${service}`);
        
        await this.clickOutside();
        
        // Additional wait to ensure jurisdiction-based services are loaded
        await this.page.waitForTimeout(1000);
        
        // Click on the Service dropdown
        const serviceText = this.page.getByText('Service', { exact: true }).first();
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();

        // Wait for dropdown to open and populate with jurisdiction-specific services
        await this.page.waitForTimeout(800);

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
        await this.page.waitForTimeout(1000);

        // Search for the service
        await searchInput.clear();
        await searchInput.fill(service);

        // Wait for search to filter options
        await this.page.waitForTimeout(800);

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
        await this.page.waitForTimeout(1000);
        await this.clickOutside();
    }

    // Check if a service is available in the dropdown
    async isServiceAvailable(service: string): Promise<boolean> {
        console.log(`Checking if service "${service}" is available`);
        
        await this.clickOutside();
        
        // Additional wait to ensure jurisdiction-based services are loaded
        await this.page.waitForTimeout(1000);
        
        // Click on the Service dropdown
        const serviceText = this.page.getByText('Service', { exact: true }).first();
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();

        // Wait for dropdown to open
        await this.page.waitForTimeout(800);

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
        await this.page.waitForTimeout(1000);

        // Search for the service
        await searchInput.clear();
        await searchInput.fill(service);

        // Wait for search to filter options
        await this.page.waitForTimeout(800);

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

    // Select Product filter (using working selector from navigator.favorites.page.ts)
    async selectProduct(product: string) {
        console.log(`Selecting product: ${product}`);
        
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
        
        // Using the working selector from NAVIGATOR_SELECTORS.productLabel
        const productLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Product")');
        await productLabel.waitFor({ state: 'visible', timeout: 10000 });
        await productLabel.click();
        
        console.log('Opened Product dropdown');
        await this.page.waitForTimeout(1500);
        
        // Search for the product
        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.clear();
        await searchInput.fill(product);
        await this.page.waitForTimeout(1000);
        
        // Find and click the product option using getByRole (working pattern)
        const option = this.page.getByRole('button', { name: product });
        const optionCount = await option.count();
        
        if (optionCount > 0) {
            await option.first().click({ timeout: 3000 });
            console.log(`Selected product: ${product}`);
        } else {
            throw new Error(`Product ${product} not found in dropdown`);
        }
        
        // Wait for selection to apply
        await this.page.waitForTimeout(1500);
        await this.clickOutside();
    }

    // Unselect specific products (by default all products are selected when a service is chosen)
    async unselectProducts(productsToUnselect: string[]) {
        console.log(`Unselecting products: ${productsToUnselect.join(', ')}`);
        
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
        
        // Open Product dropdown
        const productLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Product")');
        await productLabel.waitFor({ state: 'visible', timeout: 10000 });
        await productLabel.click();
        await this.page.waitForTimeout(1500);
        
        for (const product of productsToUnselect) {
            console.log(`Unselecting: ${product}`);
            
            const searchInput = this.page.getByPlaceholder('Search items');
            await searchInput.waitFor({ state: 'visible', timeout: 5000 });
            await searchInput.clear();
            await searchInput.fill(product);
            await this.page.waitForTimeout(800);
            
            // Click the product to unselect it
            const option = this.page.getByRole('button', { name: product });
            const optionCount = await option.count();
            
            if (optionCount > 0) {
                await option.first().click({ timeout: 3000 });
                console.log(`Unselected: ${product}`);
            } else {
                console.log(`Product ${product} not found`);
            }
            
            await this.page.waitForTimeout(500);
        }
        
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
    }

    // Unselect all products except the specified one (to isolate a single product for testing)
    async unselectAllProductsExcept(productToKeep: string) {
        console.log(`Keeping only product: ${productToKeep}`);
        
        // Get all available products
        const allProducts = await this.getAvailableProducts();
        console.log(`All available products: ${allProducts.join(', ')}`);
        
        // Filter out the product we want to keep
        const productsToUnselect = allProducts.filter(p => 
            !p.toLowerCase().includes(productToKeep.toLowerCase()) &&
            !productToKeep.toLowerCase().includes(p.toLowerCase())
        );
        
        if (productsToUnselect.length > 0) {
            await this.unselectProducts(productsToUnselect);
        } else {
            console.log('No other products to unselect');
        }
    }

    // Get available products from dropdown (using working selector)
    async getAvailableProducts(): Promise<string[]> {
        await this.clickOutside();
        await this.page.waitForTimeout(600);
        
        // Using working selector from navigator.favorites
        const productLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Product")');
        await productLabel.waitFor({ state: 'visible', timeout: 10000 });
        await productLabel.click();
        await this.page.waitForTimeout(600);

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

    // ============================================================
    // Activity/SubActivity Filter Methods
    // ============================================================

    // Unselect specific activities (by default all activities are selected when products are selected)
    async unselectActivities(activitiesToUnselect: string[]) {
        console.log(`Unselecting activities: ${activitiesToUnselect.join(', ')}`);
        
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
        
        // Open Activity dropdown
        const activityLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Activity")');
        await activityLabel.waitFor({ state: 'visible', timeout: 10000 });
        await activityLabel.click();
        await this.page.waitForTimeout(1500);
        
        for (const activity of activitiesToUnselect) {
            console.log(`Unselecting: ${activity}`);
            
            const searchInput = this.page.getByPlaceholder('Search items');
            await searchInput.waitFor({ state: 'visible', timeout: 5000 });
            await searchInput.clear();
            await searchInput.fill(activity);
            await this.page.waitForTimeout(800);
            
            // Click the activity to unselect it (toggle behavior)
            const option = this.page.getByRole('button', { name: activity });
            const optionCount = await option.count();
            
            if (optionCount > 0) {
                await option.first().click({ timeout: 3000 });
                console.log(`Unselected: ${activity}`);
            } else {
                console.log(`Activity ${activity} not found`);
            }
            
            await this.page.waitForTimeout(500);
        }
        
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
    }

    // Unselect all activities except the specified one (to isolate a single activity for testing)
    async unselectAllActivitiesExcept(activityToKeep: string) {
        console.log(`Keeping only activity: ${activityToKeep}`);
        
        // Get all available activities
        const allActivities = await this.getAvailableActivities();
        console.log(`All available activities: ${allActivities.join(', ')}`);
        
        // Filter out the activity we want to keep
        const activitiesToUnselect = allActivities.filter(a => 
            !a.toLowerCase().includes(activityToKeep.toLowerCase()) &&
            !activityToKeep.toLowerCase().includes(a.toLowerCase())
        );
        
        if (activitiesToUnselect.length > 0) {
            console.log(`Unselecting ${activitiesToUnselect.length} activities`);
            await this.unselectActivities(activitiesToUnselect);
        } else {
            console.log('No activities to unselect');
        }
    }

    // Click Activity dropdown to open it
    async clickActivityDropdown() {
        await this.clickOutside();
        await this.page.waitForTimeout(2000);
        
        console.log('DEBUG: Checking for Activity dropdown...');
        
        // Check all filter labels on page
        const allLabels = await this.page.locator('span.s-input-dropdown-item__item__label').allTextContents();
        console.log('DEBUG: All filter labels found:', allLabels);
        
        // Try exact text match
        const activityLabelExact = this.page.locator('span.s-input-dropdown-item__item__label', { hasText: 'Activity' });
        const exactCount = await activityLabelExact.count();
        console.log(`DEBUG: Activity label count with exact match: ${exactCount}`);
        
        // Try contains match
        const activityLabelContains = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Activity")');
        const containsCount = await activityLabelContains.count();
        console.log(`DEBUG: Activity label count with contains match: ${containsCount}`);
        
        if (containsCount === 0) {
            // Try alternative: look for any element with text "Activity"
            const anyActivity = this.page.getByText('Activity', { exact: true });
            const anyCount = await anyActivity.count();
            console.log(`DEBUG: Any element with "Activity" text: ${anyCount}`);
            
            if (anyCount > 0) {
                console.log('Found Activity with getByText, clicking it...');
                await anyActivity.first().click();
            } else {
                throw new Error('Activity dropdown not found with any selector');
            }
        } else {
            console.log('Clicking Activity dropdown with standard selector...');
            await activityLabelContains.first().click();
        }
        
        console.log('Opened Activity dropdown');
        await this.page.waitForTimeout(2000);
    }

    // Select Activity filter (using same pattern as Product from navigator.favorites.page.ts)
    async selectActivity(activity: string) {
        console.log(`Selecting activity: ${activity}`);
        
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
        
        // Using same selector pattern as Product
        const activityLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Activity")');
        await activityLabel.waitFor({ state: 'visible', timeout: 10000 });
        await activityLabel.click();
        
        console.log('Opened Activity dropdown');
        await this.page.waitForTimeout(1500);
        
        // Search for the activity
        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.clear();
        await searchInput.fill(activity);
        await this.page.waitForTimeout(1000);
        
        // Find and click the activity option using getByRole (working pattern)
        const option = this.page.getByRole('button', { name: activity });
        const optionCount = await option.count();
        
        if (optionCount > 0) {
            await option.first().click({ timeout: 3000 });
            console.log(`Selected activity: ${activity}`);
        } else {
            throw new Error(`Activity ${activity} not found in dropdown`);
        }
        
        // Wait for selection to apply
        await this.page.waitForTimeout(1500);
        await this.clickOutside();
    }

    // Get available activities from dropdown
    async getAvailableActivities(): Promise<string[]> {
        console.log('Getting available activities...');
        
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
        
        // Wait for activity data to load after product selection
        await this.page.waitForTimeout(2000);
        
        // Using working selector pattern from Product
        const activityLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Activity")');
        
        // Check if Activity dropdown exists
        const activityCount = await activityLabel.count();
        console.log(`Activity dropdown count: ${activityCount}`);
        
        const isActivityVisible = await activityLabel.isVisible().catch(() => false);
        
        if (!isActivityVisible) {
            console.log('Activity dropdown not visible with standard selector');
            console.log('Checking for Activity filter in page...');
            
            // Try alternative: check all filter labels
            const allLabels = await this.page.locator('span.s-input-dropdown-item__item__label').allTextContents();
            console.log('All available filter labels:', allLabels);
            
            return [];
        }
        
        console.log('Clicking Activity dropdown...');
        await activityLabel.click();
        await this.page.waitForTimeout(1500);
        
        // Wait for "No options available" to disappear (if it appears initially while loading)
        try {
            const noOptionsMessage = this.page.getByText('No options available');
            await noOptionsMessage.waitFor({ state: 'hidden', timeout: 5000 });
            console.log('Activity options loaded after product filter applied');
        } catch (error) {
            console.log('No "No options available" message, or it disappeared quickly');
        }
        
        // Additional wait for options to populate
        await this.page.waitForTimeout(2000);

        // Check if "No options available" is still present
        const noOptionsText = await this.page.locator('text="No options available"').isVisible().catch(() => false);
        if (noOptionsText) {
            await this.clickOutside();
            console.log('No activities available in dropdown after waiting');
            return [];
        }

        // Get all activity options
        const activityOptions = await this.page.locator('li p').allTextContents();
        
        await this.clickOutside();
        
        const activities = activityOptions.map(a => a.trim()).filter(a => a.length > 0);
        console.log('Available activities found:', activities);
        return activities;
    }

    // Verify Activity options match expected list for selected service
    async verifyActivitiesForService(service: string) {
        const expectedActivities = this.SERVICE_ACTIVITIES[service as keyof typeof this.SERVICE_ACTIVITIES];
        
        if (expectedActivities === undefined) {
            console.log(`No activity mapping defined for service: ${service}`);
            return;
        }

        const availableActivities = await this.getAvailableActivities();
        
        if (availableActivities.length === 0) {
            throw new Error(`No activities found for service: ${service}`);
        }

        // Check if key expected activities are available (sample check, not all)
        // We check a subset as the full activity list can be very large
        const keyActivities = expectedActivities.slice(0, 5); // Check first 5 activities
        
        for (const expectedActivity of keyActivities) {
            const found = availableActivities.some(a => 
                a.toLowerCase().includes(expectedActivity.toLowerCase()) || 
                expectedActivity.toLowerCase().includes(a.toLowerCase())
            );
            
            if (!found) {
                console.log(`Expected activity "${expectedActivity}" not found for service "${service}"`);
                console.log(`Available activities: ${availableActivities.slice(0, 10).join(', ')}...`);
            } else {
                console.log(`✓ Found expected activity: ${expectedActivity}`);
            }
        }
        
        console.log(`✓ Verified: Key activities available for ${service}`);
    }

    // Verify specific activity is available for a product
    async verifyActivityForProduct(product: string, expectedActivity: string) {
        const availableActivities = await this.getAvailableActivities();
        
        const found = availableActivities.some(a => 
            a.toLowerCase().includes(expectedActivity.toLowerCase()) || 
            expectedActivity.toLowerCase().includes(a.toLowerCase())
        );
        
        if (!found) {
            throw new Error(`Expected activity "${expectedActivity}" not found for product "${product}". Available: ${availableActivities.slice(0, 10).join(', ')}`);
        }
        
        console.log(`✓ Verified: Activity "${expectedActivity}" available for product "${product}"`);
    }

    // Get expected activities for a service
    getExpectedActivitiesForService(service: string): string[] {
        return this.SERVICE_ACTIVITIES[service as keyof typeof this.SERVICE_ACTIVITIES] || [];
    }

    // Get expected activity for a product (returns first matching activity)
    getExpectedActivityForProduct(product: string): string | undefined {
        return this.PRODUCT_ACTIVITIES[product as keyof typeof this.PRODUCT_ACTIVITIES]?.[0];
    }

    // Select SubActivity filter
    async selectSubActivity(subActivity: string) {
        await this.clickOutside();
        
        const subActivityLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Sub Activity")');
        await subActivityLabel.waitFor({ state: 'visible', timeout: 10000 });
        await subActivityLabel.click();
        await this.page.waitForTimeout(500);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.clear();
        await searchInput.fill(subActivity);
        await this.page.waitForTimeout(500);

        const option = this.page.locator(`li [role="button"]:has-text("${subActivity}")`).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        
        console.log(`Selected sub activity: ${subActivity}`);
        await this.clickOutside();
    }

    // Click SubActivity dropdown to open it
    async clickSubActivityDropdown() {
        await this.clickOutside();
        
        // Wait longer for SubActivity dropdown to appear after activity selection
        console.log('Waiting for SubActivity dropdown to appear...');
        await this.page.waitForTimeout(4000);
        
        console.log('DEBUG: Checking for SubActivity dropdown...');
        
        // Check all filter labels on page
        const allLabels = await this.page.locator('span.s-input-dropdown-item__item__label').allTextContents();
        console.log('DEBUG: All filter labels found:', allLabels);
        
        // Try multiple variations of SubActivity text
        const variations = ['Sub Activity', 'SubActivity', 'Sub-Activity', 'Subactivity'];
        
        for (const variation of variations) {
            const labelContains = this.page.locator('span.s-input-dropdown-item__item__label:has-text("' + variation + '")');
            const count = await labelContains.count();
            
            if (count > 0) {
                console.log(`Found SubActivity dropdown with text: "${variation}"`);
                await labelContains.first().click();
                console.log('Opened SubActivity dropdown');
                await this.page.waitForTimeout(2000);
                return;
            }
        }
        
        // If not found with standard selector, try getByText with variations
        console.log('SubActivity not found with standard selector, trying alternatives...');
        for (const variation of variations) {
            const anySubActivity = this.page.getByText(variation, { exact: true });
            const anyCount = await anySubActivity.count();
            
            if (anyCount > 0) {
                console.log(`Found SubActivity with getByText: "${variation}"`);
                await anySubActivity.first().click();
                console.log('Opened SubActivity dropdown');
                await this.page.waitForTimeout(2000);
                return;
            }
        }
        
        // Still not found - throw detailed error
        throw new Error(`SubActivity dropdown not found with any variation. Available filters: ${allLabels.join(', ')}`);
    }

    // Get available subactivities from dropdown
    async getAvailableSubActivities(): Promise<string[]> {
        console.log('Getting available subactivities...');
        
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
        
        // Wait for subactivity data to load after activity selection
        await this.page.waitForTimeout(2000);
        
        // Using working selector pattern
        const subActivityLabel = this.page.locator('span.s-input-dropdown-item__item__label:has-text("Sub Activity")');
        
        // Check if SubActivity dropdown exists
        const subActivityCount = await subActivityLabel.count();
        console.log(`SubActivity dropdown count: ${subActivityCount}`);
        
        const isSubActivityVisible = await subActivityLabel.isVisible().catch(() => false);
        
        if (!isSubActivityVisible) {
            console.log('Sub Activity dropdown not visible with standard selector');
            console.log('Checking for SubActivity filter in page...');
            
            // Try alternative: check all filter labels
            const allLabels = await this.page.locator('span.s-input-dropdown-item__item__label').allTextContents();
            console.log('All available filter labels:', allLabels);
            
            return [];
        }
        
        console.log('Clicking SubActivity dropdown...');
        await subActivityLabel.click();
        await this.page.waitForTimeout(1500);
        
        // Wait for "No options available" to disappear (if it appears initially while loading)
        try {
            const noOptionsMessage = this.page.getByText('No options available');
            await noOptionsMessage.waitFor({ state: 'hidden', timeout: 5000 });
            console.log('SubActivity options loaded after activity filter applied');
        } catch (error) {
            console.log('No "No options available" message, or it disappeared quickly');
        }
        
        // Additional wait for options to populate
        await this.page.waitForTimeout(2000);

        // Check if "No options available" is still present
        const noOptionsText = await this.page.locator('text="No options available"').isVisible().catch(() => false);
        if (noOptionsText) {
            await this.clickOutside();
            console.log('No subactivities available in dropdown after waiting');
            return [];
        }

        // Get all subactivity options using same pattern as Activity
        const subActivityOptions = await this.page.locator('li [role="button"]').allTextContents();
        
        await this.clickOutside();
        
        const subActivities = subActivityOptions.map(s => s.trim()).filter(s => s.length > 0);
        console.log('Available subactivities found:', subActivities);
        return subActivities;
    }

}
