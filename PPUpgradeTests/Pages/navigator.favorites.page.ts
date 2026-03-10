import { Page, expect } from '@playwright/test';
import { credentials } from '../Utilits/credentials';
import { SELECTORS } from '../Utilits/selectors';
import { NAVIGATOR_SELECTORS } from '../Utilits/navigator.selectors';

/**
 * Navigator Favorites Page Object Model
 * Handles favorites functionality for Navigator Jurisdiction Analysis and Static Views
 */
export class NavigatorFavorites {
    private page: Page;

    // Jurisdictions available in Navigator
    private jurisdictions = [
        'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Barbados', 
        'Belgium', 'Bermuda', 'Bolivia', 'Botswana', 'Brazil', 'Brunei', 
        'Bulgaria', 'Cambodia', 'Canada', 'Cayman Islands', 'China', 'Colombia', 
        'Cook Islands', 'Costa Rica', 'Côte d\'Ivoire', 'Croatia', 'Curaçao', 
        'Cyprus', 'Czechia', 'Denmark', 'Dominica', 'Dominican Republic', 
        'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Fiji', 'Finland', 
        'France', 'Georgia', 'Germany', 'Gibraltar', 'Greece', 'Guatemala', 
        'Guyana', 'Haiti', 'Iceland', 'Indonesia', 'Iraq', 'Ireland', 
        'Isle of Man', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kenya', 
        'Kuwait', 'Latvia', 'Lebanon', 'Liberia', 'Liechtenstein', 'Lithuania', 
        'Luxembourg', 'Macau', 'Malta', 'Marshall Islands', 'Mauritius', 
        'Micronesia (Federated States of)', 'Monaco', 'Morocco', 'Namibia', 
        'Netherlands', 'Nicaragua', 'Norway', 'Pakistan', 'Panama', 'Paraguay', 
        'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 
        'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saudi Arabia', 
        'Serbia', 'Seychelles', 'Singapore', 'Slovakia', 'Slovenia', 
        'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Suriname', 
        'Sweden', 'Switzerland', 'Taiwan', 'Tanzania', 'Thailand', 'Togo', 
        'Trinidad and Tobago', 'Turkey', 'Turks and Caicos Islands', 'Uganda', 
        'United Kingdom', 'Ukraine', 'Uruguay', 'United States of America', 
        'Venezuela', 'Vietnam', 'Zambia', 'Zimbabwe'
    ];

    // Services available in Navigator
    private services = [
        'Banking', 'Corporate Finance', 'Derivatives & FX', 
        'Funds', 'Lending', 'Securities'
    ];

    // Service to Products mapping
    private serviceProductsMap: { [key: string]: string[] } = {
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

    // Store selected values for verification
    public selectedJurisdiction: string = '';
    public selectedService: string = '';
    public selectedProduct: string = '';
    public savedFavoriteName: string = '';

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
        
        // Wait for platform to load
        await this.page.waitForTimeout(1000);
    }

    // Navigate to Navigator page
    async navigateToNavigator() {
        await this.page.goto('https://platform.test-simmons.com/navigator/');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(500);
    }

    // Click outside to close any open dropdowns
    async clickOutside() {
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(300);
    }

    // Get random jurisdiction from the list
    getRandomJurisdiction(): string {
        const randomIndex = Math.floor(Math.random() * this.jurisdictions.length);
        return this.jurisdictions[randomIndex];
    }

    // Get random service from the list
    getRandomService(): string {
        const randomIndex = Math.floor(Math.random() * this.services.length);
        return this.services[randomIndex];
    }

    // Select Jurisdiction filter
    async selectJurisdiction(jurisdiction: string) {
        this.selectedJurisdiction = jurisdiction;
        console.log(`Selecting jurisdiction: ${jurisdiction}`);
        
        await this.clickOutside();
        
        // Click on the Jurisdiction dropdown (not the table header)
        const jurisdictionText = this.page.getByText('Jurisdiction', { exact: true }).first();
        await jurisdictionText.waitFor({ state: 'visible' });
        await jurisdictionText.click();

        // Wait for dropdown to open
        await this.page.waitForTimeout(1000);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.fill(jurisdiction);

        // Wait for search to filter options
        await this.page.waitForTimeout(700);

        const option = this.page.getByRole('button', { name: `${jurisdiction} ${jurisdiction}` });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();

        // Wait for selection to apply and for services to update
        await this.page.waitForTimeout(1000);
        await this.clickOutside();
        
        // Additional waits to ensure services dropdown is populated with jurisdiction-specific options
        await this.page.waitForTimeout(800);
    }

    // Select Service filter
    async selectService(service: string) {
        this.selectedService = service;
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

    // Get expected products for a service
    getExpectedProducts(service: string): string[] {
        return this.serviceProductsMap[service] || [];
    }

    // Click Product dropdown to open it
    async clickProductDropdown() {
        await this.clickOutside();
        await this.page.waitForTimeout(1000);
        
        // Click on the Product dropdown label
        const productLabel = this.page.locator(NAVIGATOR_SELECTORS.productLabel);
        await productLabel.waitFor({ state: 'visible', timeout: 10000 });
        await productLabel.click();
        
        console.log('Opened Product dropdown');
        await this.page.waitForTimeout(1500);
    }

    // Get all available products from the dropdown
    async getAvailableProducts(): Promise<string[]> {
        // Wait for dropdown to populate
        await this.page.waitForTimeout(1000);
        
        // Check if "No options available" message is present
        const noOptionsMessage = this.page.getByText('No options available');
        const noOptionsCount = await noOptionsMessage.count();
        
        if (noOptionsCount > 0) {
            console.log('No products available');
            return [];
        }
        
        // Get all product options from dropdown
        const productOptions = this.page.locator('li [role="button"]');
        const count = await productOptions.count();
        
        const products: string[] = [];
        for (let i = 0; i < count; i++) {
            const text = await productOptions.nth(i).textContent();
            if (text) {
                products.push(text.trim());
            }
        }
        
        console.log(`Found ${products.length} available products:`, products);
        return products;
    }

    // Verify products match expected list for a service
    async verifyProductsForService(service: string): Promise<boolean> {
        const expectedProducts = this.getExpectedProducts(service);
        const availableProducts = await this.getAvailableProducts();
        
        // If no products expected, verify "No options available" or empty list
        if (expectedProducts.length === 0) {
            if (availableProducts.length === 0) {
                console.log(`✓ Correct: No products available for ${service}`);
                return true;
            } else {
                console.log(`✗ Error: Expected no products for ${service}, but found:`, availableProducts);
                return false;
            }
        }
        
        // Verify all expected products are present
        const missingProducts = expectedProducts.filter(p => !availableProducts.includes(p));
        const extraProducts = availableProducts.filter(p => !expectedProducts.includes(p));
        
        if (missingProducts.length === 0 && extraProducts.length === 0) {
            console.log(`✓ All expected products present for ${service}`);
            return true;
        } else {
            if (missingProducts.length > 0) {
                console.log(`✗ Missing products for ${service}:`, missingProducts);
            }
            if (extraProducts.length > 0) {
                console.log(`✗ Unexpected products for ${service}:`, extraProducts);
            }
            return false;
        }
    }

    // Click Search button
    async clickSearch() {
        const searchButton = this.page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible' });
        await expect(searchButton).toBeEnabled();
        await searchButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    // Wait for results to appear
    async waitForResults() {
        // Wait for the JURISDICTION ANALYSIS section to be visible
        await this.page.getByText('JURISDICTION ANALYSIS').waitFor({ state: 'visible', timeout: 20000 });
        // Brief wait for initial render
        await this.page.waitForTimeout(500);
    }

    // Navigate to Static Views tabs
    async navigateToDefinitions() {
        // Wait for page to stabilize after results load
        await this.page.waitForTimeout(3000);
        
        const definitionsTab = this.page.locator('button.static-tab-button', { hasText: 'Definitions' });
        await definitionsTab.waitFor({ state: 'visible', timeout: 20000 });
        await definitionsTab.click();
        await this.page.waitForTimeout(2000);
    }

    async navigateToStatus() {
        // Wait for page to stabilize after results load
        await this.page.waitForTimeout(3000);
        
        const statusTab = this.page.locator('button.static-tab-button', { hasText: 'Status' });
        await statusTab.waitFor({ state: 'visible', timeout: 20000 });
        await statusTab.click();
        await this.page.waitForTimeout(2000);
    }

    async navigateToLegends() {
        // Wait for page to stabilize after results load
        await this.page.waitForTimeout(3000);
        
        const legendsTab = this.page.locator('button.static-tab-button', { hasText: 'Legends' });
        await legendsTab.waitFor({ state: 'visible', timeout: 20000 });
        await legendsTab.click();
        await this.page.waitForTimeout(2000);
    }

    async navigateToContacts() {
        // Wait for page to stabilize after results load
        await this.page.waitForTimeout(3000);
        
        const contactsTab = this.page.locator('button.static-tab-button', { hasText: 'Contacts' });
        await contactsTab.waitFor({ state: 'visible', timeout: 20000 });
        await contactsTab.click();
        await this.page.waitForTimeout(2000);
    }

    // Generate random favorite name (3-18 characters)
    generateFavoriteName(): string {
        const prefix = 'Fav';
        const timestamp = Date.now().toString().slice(-8);
        const randomSuffix = Math.random().toString(36).substring(2, 6);
        const name = `${prefix}${timestamp}${randomSuffix}`.substring(0, 18);
        return name;
    }

    // Click favorite button to save search
    async clickFavoriteButton() {
        const favoriteButton = this.page.locator(NAVIGATOR_SELECTORS.favoriteButton).first();
        await favoriteButton.waitFor({ state: 'visible', timeout: 10000 });
        await favoriteButton.click();
        console.log('Clicked favorite button');
        await this.page.waitForTimeout(1000);
    }

    // Check if favorite button is already saved (filled/yellow)
    async isFavoriteAlreadySaved(): Promise<boolean> {
        try {
            await this.page.waitForTimeout(1000);
            const filledFavorite = this.page.locator(NAVIGATOR_SELECTORS.favoriteButtonFilled).first();
            const count = await filledFavorite.count();
            
            if (count > 0) {
                const isVisible = await filledFavorite.isVisible();
                if (isVisible) {
                    console.log('Favorite button is already filled (yellow) - favorite already exists with this jurisdiction/service combination');
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Wait for Save Search modal to appear
    async waitForSaveSearchModal() {
        const modalTitle = this.page.locator(NAVIGATOR_SELECTORS.saveSearchModalTitle);
        await modalTitle.waitFor({ state: 'visible', timeout: 10000 });
        await expect(modalTitle).toHaveText('Save Search');
        console.log('Save Search modal appeared');
        await this.page.waitForTimeout(500);
    }

    // Enter favorite name in input field
    async enterFavoriteName(name: string) {
        this.savedFavoriteName = name;
        const nameInput = this.page.locator(NAVIGATOR_SELECTORS.favoriteNameInput);
        await nameInput.waitFor({ state: 'visible', timeout: 5000 });
        await nameInput.fill(name);
        console.log(`Entered favorite name: ${name}`);
        await this.page.waitForTimeout(500);
    }

    // Click Save button in modal
    async clickSaveButton() {
        const saveButton = this.page.locator(NAVIGATOR_SELECTORS.saveButton);
        await saveButton.waitFor({ state: 'visible', timeout: 5000 });
        await saveButton.click();
        console.log('Clicked Save button');
        await this.page.waitForTimeout(2000);
    }

    // Verify success message appears
    async verifySuccessMessage() {
        const successMessage = this.page.locator(NAVIGATOR_SELECTORS.successMessage);
        await successMessage.waitFor({ state: 'visible', timeout: 10000 });
        await expect(successMessage).toHaveText('Search saved successfully');
        console.log('Success message appeared');
    }

    // Verify favorite button is filled (yellow) and disabled
    async verifyFavoriteButtonSaved() {
        // Wait for button to update
        await this.page.waitForTimeout(1000);
        
        // Check if the filled heart icon is visible
        const filledFavorite = this.page.locator(NAVIGATOR_SELECTORS.favoriteButtonFilled).first();
        await filledFavorite.waitFor({ state: 'visible', timeout: 5000 });
        
        // Verify it's visible
        await expect(filledFavorite).toBeVisible();
        console.log('Favorite button is now filled (saved state)');
    }

    // Complete favorite save workflow
    async saveFavorite(customName?: string) {
        // Generate or use provided name
        const favoriteName = customName || this.generateFavoriteName();
        
        // Click favorite button
        await this.clickFavoriteButton();
        
        // Wait for modal
        await this.waitForSaveSearchModal();
        
        // Enter name
        await this.enterFavoriteName(favoriteName);
        
        // Click save
        await this.clickSaveButton();
        
        // Verify success
        await this.verifySuccessMessage();
        
        // Verify button state changed
        await this.verifyFavoriteButtonSaved();
        
        console.log(`Favorite saved successfully: ${favoriteName}`);
        return favoriteName;
    }

    // Complete favorite save workflow with retry if already exists
    async saveFavoriteWithRetry(customName?: string, maxRetries: number = 3, handleProducts: boolean = false): Promise<string> {
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            // Check if favorite button is already saved (filled/yellow)
            const alreadySaved = await this.isFavoriteAlreadySaved();
            
            if (alreadySaved) {
                console.log(`Attempt ${retryCount + 1}: Favorite already exists with ${this.selectedJurisdiction} - ${this.selectedService}`);
                console.log('Changing jurisdiction and service selections...');
                
                // Select different random jurisdiction and service
                const newJurisdiction = this.getRandomJurisdiction();
                
                // If handling products, use getRandomServiceWithProducts, otherwise use getRandomService
                const newService = handleProducts ? this.getRandomServiceWithProducts() : this.getRandomService();
                
                console.log(`Trying with new selection: ${newJurisdiction} - ${newService}`);
                
                // Select new filters
                await this.selectJurisdiction(newJurisdiction);
                await this.selectService(newService);
                
                // If handling products, reselect product for the new service
                if (handleProducts) {
                    const availableProducts = this.getAvailableProductsForService(newService);
                    if (availableProducts.length > 0) {
                        // Pick one product to keep selected
                        const productToKeep = this.getRandomProduct(newService);
                        console.log(`Product to keep selected: ${productToKeep}`);
                        this.selectedProduct = productToKeep;
                        
                        // Unselect all other products
                        const productsToUnselect = availableProducts.filter(p => p !== productToKeep);
                        console.log(`Products to unselect (by clicking them):`, productsToUnselect);
                        
                        if (productsToUnselect.length > 0) {
                            await this.unselectProducts(productsToUnselect);
                        }
                    }
                }
                
                // Re-run search
                await this.clickSearch();
                await this.waitForResults();
                
                retryCount++;
                continue;
            }
            
            // Favorite button is empty (not saved), proceed with saving
            console.log('Favorite button is empty, proceeding to save...');
            
            // Generate or use provided name
            const favoriteName = customName || this.generateFavoriteName();
            
            // Click favorite button
            await this.clickFavoriteButton();
            
            // Wait for modal
            await this.waitForSaveSearchModal();
            
            // Enter name
            await this.enterFavoriteName(favoriteName);
            
            // Click save
            await this.clickSaveButton();
            
            // Verify success
            await this.verifySuccessMessage();
            
            // Verify button state changed
            await this.verifyFavoriteButtonSaved();
            
            console.log(`Favorite saved successfully: ${favoriteName}`);
            return favoriteName;
        }
        
        throw new Error(`Failed to save favorite after ${maxRetries} retries - all combinations may already be saved`);
    }

    // Reload the page
    async reloadPage() {
        await this.page.reload({ waitUntil: 'networkidle' });
        await this.page.waitForTimeout(500);
        console.log('Page reloaded');
    }

    // Click favorites dropdown button to open dropdown
    async clickFavoritesDropdownButton() {
        // First wait for the page filters to be visible to ensure page is fully loaded
        await this.page.locator(NAVIGATOR_SELECTORS.jurisdictionButton).waitFor({ state: 'visible', timeout: 30000 });
        console.log('Navigator page filters loaded');
        
        // Wait for dynamic content to load
        await this.page.waitForTimeout(3000);
        
        // Click the chevron SVG icon to open dropdown
        const dropdownButton = this.page.locator(NAVIGATOR_SELECTORS.favoritesDropdownButton).first();
        await dropdownButton.waitFor({ state: 'visible', timeout: 15000 });
        await dropdownButton.click();
        console.log('Clicked favorites dropdown chevron to open dropdown');
        await this.page.waitForTimeout(1000);
    }

    // Wait for favorites dropdown to appear
    async waitForFavoritesDropdown() {
        // After clicking the dropdown button, favorites appear as a list
        await this.page.waitForTimeout(1000);
        console.log('Favorites dropdown opened');
    }

    // Check if favorite name exists in dropdown
    async verifyFavoriteInDropdown(favoriteName: string): Promise<boolean> {
        // After clicking dropdown, look for the favorite name in visible text
        // Try multiple possible selectors for dropdown items
        const possibleSelectors = [
            NAVIGATOR_SELECTORS.favoriteDropdownItem,  // .s-dropdown-item
            'li',  // Generic list items
            '[role="button"]',  // Role-based selector
            'button',  // Button elements
            'div[class*="item"]',  // Divs with "item" in class
        ];
        
        for (const selector of possibleSelectors) {
            const items = this.page.locator(selector).filter({ hasText: favoriteName });
            const count = await items.count();
            if (count > 0) {
                console.log(`✓ Found favorite '${favoriteName}' using selector: ${selector} (${count} matches)`);
                return true;
            }
        }
        
        console.log(`✗ Favorite not found in dropdown: ${favoriteName}`);
        return false;
    }

    // Click on specific favorite name in dropdown
    async clickFavoriteInDropdown(favoriteName: string, clickSearch: boolean = true) {
        // Try multiple possible selectors to find the favorite item
        const selectors = [
            NAVIGATOR_SELECTORS.favoriteDropdownItem,
            'li',
            '[role="button"]',
            'button',
            'div[class*="item"]'
        ];
        
        for (const selector of selectors) {
            const items = this.page.locator(selector).filter({ hasText: favoriteName });
            const count = await items.count();
            if (count > 0) {
                await items.first().click();
                console.log(`Clicked on favorite: ${favoriteName} (using selector: ${selector})`);
                await this.page.waitForTimeout(1000);
                
                if (clickSearch) {
                    // Click Search button after selecting favorite
                    await this.clickSearchAfterFavorite();
                }
                
                return;
            }
        }
        
        throw new Error(`Could not find favorite to click: ${favoriteName}`);
    }

    // Click Search button after selecting favorite
    async clickSearchAfterFavorite() {
        const searchButton = this.page.locator(NAVIGATOR_SELECTORS.searchButtonSpan).filter({ hasText: 'Search' }).first();
        await searchButton.waitFor({ state: 'visible', timeout: 5000 });
        await searchButton.click();
        console.log('Clicked Search button after selecting favorite');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
    }

    // Verify correct filters are applied after loading favorite
    async verifyFiltersApplied(): Promise<{ jurisdiction: string; service: string }> {
        // Get selected jurisdiction from the first filter button
        const jurisdictionText = await this.page.locator('div:nth-of-type(2) > .small span:nth-of-type(2)').first().textContent();
        const selectedJurisdiction = jurisdictionText?.trim() || '';
        
        // Get selected service from the second filter button
        const serviceText = await this.page.locator('div:nth-of-type(2) > .small button > span').nth(1).textContent();
        const selectedService = serviceText?.trim() || '';
        
        console.log(`Filters applied - Jurisdiction: ${selectedJurisdiction}, Service: ${selectedService}`);
        
        return { jurisdiction: selectedJurisdiction, service: selectedService };
    }

    // Verify filters match expected values
    async verifyCorrectFilters(expectedJurisdiction: string, expectedService: string) {
        const filters = await this.verifyFiltersApplied();
        
        expect(filters.jurisdiction).toBe(expectedJurisdiction);
        expect(filters.service).toBe(expectedService);
        
        console.log(`✓ Filters verified: ${expectedJurisdiction} - ${expectedService}`);
    }

    // Complete workflow: reload, select favorite, search, verify
    async loadFavoriteAndVerify(favoriteName: string) {
        // Reload page to ensure favorite is saved
        await this.reloadPage();
        
        // Navigate back to Navigator base page where dropdown button is visible
        await this.navigateToNavigator();
        
        // Open favorites dropdown (buttons should be visible on Navigator homepage)
        await this.clickFavoritesDropdownButton();
        await this.waitForFavoritesDropdown();
        
        // Verify favorite exists
        const exists = await this.verifyFavoriteInDropdown(favoriteName);
        expect(exists).toBe(true);
        
        // Click on favorite (will auto-click Search)
        await this.clickFavoriteInDropdown(favoriteName);
        
        // Wait for results
        await this.waitForResults();
        
        // Verify filters match
        await this.verifyCorrectFilters(this.selectedJurisdiction, this.selectedService);
        
        // Verify favorite button is filled (yellow)
        await this.verifyFavoriteButtonSaved();
        
        console.log(`✓ Favorite loaded and verified successfully: ${favoriteName}`);
    }

    // Click Delete button in dropdown after selecting favorite
    async clickDeleteButtonInDropdown() {
        // Wait for Delete button to be visible
        const deleteButton = this.page.locator('span.button-text:has-text("Delete")');
        await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
        await deleteButton.click();
        console.log('Clicked Delete button in dropdown');
        await this.page.waitForTimeout(1000);
    }

    // Confirm delete by clicking "Yes, delete" button in popup
    async confirmDeleteFavorite() {
        // Wait for confirmation popup and "Yes, delete" button
        const confirmButton = this.page.locator('button.s-button:has-text("Yes, delete")');
        await confirmButton.waitFor({ state: 'visible', timeout: 10000 });
        await confirmButton.click();
        console.log('Clicked "Yes, delete" button');
        await this.page.waitForTimeout(1000);
    }

    // Verify delete success message appears
    async verifyDeleteSuccessMessage() {
        const successMessage = this.page.locator('p:has-text("Search deleted successfully")');
        await successMessage.waitFor({ state: 'visible', timeout: 10000 });
        const messageText = await successMessage.textContent();
        
        if (messageText?.includes('Search deleted successfully')) {
            console.log('✓ Delete success message verified');
            return true;
        } else {
            console.log('✗ Delete success message not found');
            throw new Error('Delete success message not found');
        }
    }

    // Complete workflow: save → reload → delete favorite
    async deleteFavoriteWorkflow(favoriteName: string) {
        // Reload page to ensure favorite is saved
        await this.reloadPage();
        
        // Navigate back to Navigator base page where dropdown button is visible
        await this.navigateToNavigator();
        
        // Open favorites dropdown
        await this.clickFavoritesDropdownButton();
        await this.waitForFavoritesDropdown();
        
        // Verify favorite exists
        const exists = await this.verifyFavoriteInDropdown(favoriteName);
        expect(exists).toBe(true);
        
        // Click on favorite to select it (but don't search)
        await this.clickFavoriteInDropdown(favoriteName, false);
        
        // Click Delete button
        await this.clickDeleteButtonInDropdown();
        
        // Confirm deletion
        await this.confirmDeleteFavorite();
        
        // Verify success message
        await this.verifyDeleteSuccessMessage();
        
        console.log(`✓ Favorite deleted successfully: ${favoriteName}`);
    }

    // Get random service that has products available
    getRandomServiceWithProducts(): string {
        const servicesWithProducts = Object.keys(this.serviceProductsMap).filter(
            service => this.serviceProductsMap[service].length > 0
        );
        const randomIndex = Math.floor(Math.random() * servicesWithProducts.length);
        return servicesWithProducts[randomIndex];
    }

    // Get random product for a given service
    getRandomProduct(service: string): string {
        const products = this.serviceProductsMap[service] || [];
        if (products.length === 0) {
            throw new Error(`No products available for service: ${service}`);
        }
        const randomIndex = Math.floor(Math.random() * products.length);
        return products[randomIndex];
    }

    // Select a specific product from the dropdown
    async selectProduct(product: string) {
        console.log(`Selecting product: ${product}`);
        
        // Click Product dropdown to open it
        await this.clickProductDropdown();
        
        // Wait for dropdown to populate
        await this.page.waitForTimeout(1500);
        
        // Search for the product
        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.clear();
        await searchInput.fill(product);
        await this.page.waitForTimeout(1000);
        
        // Find and click the product option
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

    // Get available products for a service
    getAvailableProductsForService(service: string): string[] {
        return this.serviceProductsMap[service] || [];
    }

    // Unselect products by clicking on them (in Navigator, clicking = unselecting when "All" is default)
    async unselectProducts(productsToUnselect: string[]) {
        console.log(`Unselecting products: ${productsToUnselect.join(', ')}`);
        
        // Click Product dropdown to open it
        await this.clickProductDropdown();
        await this.page.waitForTimeout(1500);
        
        for (const product of productsToUnselect) {
            console.log(`Unselecting: ${product}`);
            
            // Search for the product
            const searchInput = this.page.getByPlaceholder('Search items');
            await searchInput.waitFor({ state: 'visible', timeout: 5000 });
            await searchInput.clear();
            await searchInput.fill(product);
            await this.page.waitForTimeout(1000);
            
            // Find and click the product option to unselect it
            const option = this.page.getByRole('button', { name: product });
            const optionCount = await option.count();
            
            if (optionCount > 0) {
                await option.first().click({ timeout: 3000 });
                console.log(`Unselected product: ${product}`);
            } else {
                console.log(`Product ${product} not found in dropdown`);
            }
            
            await this.page.waitForTimeout(500);
        }
        
        // Close the dropdown
        await this.page.waitForTimeout(1000);
        await this.clickOutside();
        console.log('Finished unselecting products');
    }

    // Verify product selection after reload
    async verifyProductSelection(expectedProduct: string): Promise<boolean> {
        console.log(`Verifying product selection: ${expectedProduct}`);
        
        // Click Product dropdown to see what's selected
        await this.clickProductDropdown();
        await this.page.waitForTimeout(1000);
        
        // Check if the expected product is marked as selected
        const selectedProduct = this.page.locator(`li [role="button"]:has-text("${expectedProduct}")`).first();
        const isSelected = await selectedProduct.getAttribute('aria-selected');
        
        await this.clickOutside();
        
        if (isSelected === 'true') {
            console.log(`✓ Product verified: ${expectedProduct}`);
            return true;
        } else {
            console.log(`✗ Product mismatch. Expected: ${expectedProduct}`);
            return false;
        }
    }
}

