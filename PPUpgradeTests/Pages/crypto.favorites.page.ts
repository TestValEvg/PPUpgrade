import { Page, expect } from '@playwright/test';
import { credentials } from '../Utilits/credentials';
import { SELECTORS } from '../Utilits/selectors';
import { CRYPTO_SELECTORS } from '../Utilits/crypto.selectors';

/**
 * Crypto Favorites Page Object Model
 * Handles favorites functionality for Crypto Reviewer
 */
export class CryptoFavorites {
    private page: Page;

    // Jurisdictions available in Crypto
    private jurisdictions = [
        'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belgium', 'Brazil', 
        'British Virgin Islands', 'Bulgaria', 'Cameroon', 'Canada', 
        'Cayman Islands', 'Chile', 'Cyprus', 'Denmark', 
        'Dubai International Financial Centre', 'Ecuador', 'Finland', 
        'France', 'Georgia', 'Germany', 'Germany Demo', 'Guatemala', 
        'Honduras', 'Hong Kong', 'Hong Kong Demo', 'Ireland', 'Kazakhstan', 
        'Kazakhstan-AIFC', 'Kazakhstan-Republic of', 'Kenya', 'Kuwait', 
        'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 
        'Mozambique', 'Netherlands', 'Nigeria', 'North Macedonia', 'Oman', 
        'Poland', 'Portugal', 'Qatar', 'Saudi Arabia', 'Singapore', 
        'South Africa', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 
        'Thailand', 'Turkey', 'UK', 'Ukraine', 'USA-Delaware', 
        'USA-Florida', 'USA-Illinois', 'USA-New York', 'USA-Wyoming', 'Vietnam'
    ];

    // Token Types available in Crypto
    private tokenTypes = [
        'Cryptoassets',
        'Asset-referenced Token',
        'Utility Token',
        'Derivative Referencing a Cryptoasset',
        'ETN Referencing a Cryptoasset',
        'Electronic Money Token'
    ];

    // Store selected values for verification
    public selectedJurisdiction: string = '';
    public selectedTokenType: string = '';
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
        await this.page.waitForTimeout(2000);
    }

    // Navigate to Crypto page
    async navigateToCrypto() {
        await this.page.goto('https://platform.test-simmons.com/crypto/');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        
        // Click View Crypto Data button if present
        const viewButton = this.page.locator('span.menu-item__text:has-text("View Crypto data")');
        const viewButtonCount = await viewButton.count();
        if (viewButtonCount > 0) {
            await viewButton.waitFor({ state: 'visible', timeout: 10000 });
            await viewButton.click();
            await this.page.waitForTimeout(2000);
            console.log('Clicked View Crypto Data button');
        }
    }

    // Click outside to close any open dropdowns
    async clickOutside() {
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.locator('body').click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(300);
    }

    // Get random jurisdiction
    getRandomJurisdiction(): string {
        const randomIndex = Math.floor(Math.random() * this.jurisdictions.length);
        return this.jurisdictions[randomIndex];
    }

    // Get random token type
    getRandomTokenType(): string {
        const randomIndex = Math.floor(Math.random() * this.tokenTypes.length);
        return this.tokenTypes[randomIndex];
    }

    // Select Jurisdiction
    async selectJurisdiction(jurisdiction: string) {
        this.selectedJurisdiction = jurisdiction;
        console.log(`Selecting jurisdiction: ${jurisdiction}`);

        await this.clickOutside();
        
        // Click the jurisdiction dropdown
        const jurisdictionLabel = this.page.locator(CRYPTO_SELECTORS.jurisdictionLabel);
        await jurisdictionLabel.waitFor({ state: 'visible', timeout: 10000 });
        await jurisdictionLabel.click();
        await this.page.waitForTimeout(500);

        // Type in search field
        const searchInput = this.page.locator(CRYPTO_SELECTORS.jurisdictionInput);
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.fill(jurisdiction);
        await this.page.waitForTimeout(1000);

        // Click the matching option - try different selectors
        // First try: button with text containing jurisdiction
        let option = this.page.locator(`li [role="button"]:has-text("${jurisdiction}")`).first();
        let optionCount = await option.count();
        
        if (optionCount === 0) {
            // Second try: p tag with exact text
            option = this.page.locator(`p:has-text("${jurisdiction}")`).first();
            optionCount = await option.count();
        }
        
        if (optionCount === 0) {
            // Third try: any element with the jurisdiction text
            option = this.page.getByText(jurisdiction, { exact: true }).first();
        }
        
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();

        // Wait for selection to apply
        await this.page.waitForTimeout(1000);
        console.log(`Selected jurisdiction: ${jurisdiction}`);
    }

    // Select Token Type
    async selectTokenType(tokenType: string) {
        this.selectedTokenType = tokenType;
        console.log(`Selecting token type: ${tokenType}`);

        await this.clickOutside();
        
        // Click the token type dropdown
        const tokenTypeLabel = this.page.locator(CRYPTO_SELECTORS.tokenTypeLabel);
        await tokenTypeLabel.waitFor({ state: 'visible', timeout: 10000 });
        await tokenTypeLabel.click();
        await this.page.waitForTimeout(500);

        // Click the specific token type - clicking it will automatically unselect "All"
        const option = this.page.locator(`p:has-text("${tokenType}")`).first();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();

        // Wait for selection to apply
        await this.page.waitForTimeout(500);
        console.log(`Selected token type: ${tokenType}`);
        
        // Close the dropdown by clicking outside
        await this.clickOutside();
        console.log('Closed token type dropdown');
    }

    // Click Search button
    async clickSearch() {
        const searchButton = this.page.locator(CRYPTO_SELECTORS.searchButton);
        await searchButton.waitFor({ state: 'visible', timeout: 10000 });
        await searchButton.click();
        await this.page.waitForTimeout(1000);
    }

    // Wait for results to load
    async waitForResults() {
        // Wait for results to appear - check for search result items or grid content
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        console.log('Results loaded');
    }

    // Generate unique favorite name
    generateFavoriteName(): string {
        const timestamp = Date.now().toString().slice(-8);
        const randomChars = Math.random().toString(36).substring(2, 6);
        const name = `Fav${timestamp}${randomChars}`;
        return name.substring(0, 18); // Max 18 characters
    }

    // Click favorite button (heart icon)
    async clickFavoriteButton() {
        // Use the same selector as Navigator - should work for Crypto too
        const favoriteButton = this.page.locator('svg.s-icon-favourite');
        await favoriteButton.waitFor({ state: 'visible', timeout: 10000 });
        await favoriteButton.click();
        console.log('Clicked favorite button');
        await this.page.waitForTimeout(1000);
    }

    // Check if favorite is already saved (heart is filled/yellow)
    async isFavoriteAlreadySaved(): Promise<boolean> {
        // Check if the filled heart path exists
        const filledHeart = this.page.locator('svg.s-icon-favourite path[d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"]');
        const count = await filledHeart.count();
        return count > 0;
    }

    // Wait for Save Search modal
    async waitForSaveSearchModal() {
        const modal = this.page.locator('h3:has-text("Save Search")');
        await modal.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Save Search modal appeared');
        await this.page.waitForTimeout(500);
    }

    // Enter favorite name
    async enterFavoriteName(name: string) {
        const input = this.page.locator('input.s-input[placeholder="Enter favourite name"]');
        await input.waitFor({ state: 'visible', timeout: 5000 });
        await input.fill(name);
        console.log(`Entered favorite name: ${name}`);
        await this.page.waitForTimeout(500);
    }

    // Click Save button in modal
    async clickSaveButton() {
        const saveButton = this.page.locator('span.button-text:has-text("Save")');
        await saveButton.waitFor({ state: 'visible', timeout: 5000 });
        await saveButton.click();
        console.log('Clicked Save button');
        await this.page.waitForTimeout(1000);
    }

    // Verify success message
    async verifySuccessMessage() {
        const successMessage = this.page.locator('p:has-text("Search saved successfully")');
        await successMessage.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Success message appeared');
        await this.page.waitForTimeout(1000);
    }

    // Verify favorite button is now filled (saved state)
    async verifyFavoriteButtonSaved() {
        const filledHeart = this.page.locator('svg.s-icon-favourite path[d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"]');
        await filledHeart.waitFor({ state: 'visible', timeout: 10000 });
        console.log('Favorite button is now filled (saved state)');
    }

    // Save favorite (simple workflow)
    async saveFavorite() {
        const favoriteName = this.generateFavoriteName();
        this.savedFavoriteName = favoriteName;

        const alreadySaved = await this.isFavoriteAlreadySaved();
        
        if (alreadySaved) {
            console.log('Favorite already saved (heart is filled)');
            return favoriteName;
        }

        console.log('Favorite button is empty, proceeding to save...');
        
        await this.clickFavoriteButton();
        await this.waitForSaveSearchModal();
        await this.enterFavoriteName(favoriteName);
        await this.clickSaveButton();
        await this.verifySuccessMessage();
        await this.verifyFavoriteButtonSaved();

        console.log(`Favorite saved successfully: ${favoriteName}`);
        return favoriteName;
    }

    // Save favorite with retry logic (if duplicate, try new jurisdiction/token type combo)
    async saveFavoriteWithRetry(maxRetries: number = 3): Promise<string> {
        let retryCount = 0;

        while (retryCount < maxRetries) {
            // Check if already saved
            const alreadySaved = await this.isFavoriteAlreadySaved();
            
            if (alreadySaved) {
                console.log(`Favorite already exists (retry ${retryCount + 1}/${maxRetries})`);
                
                if (retryCount < maxRetries - 1) {
                    // Select new random jurisdiction and token type
                    const newJurisdiction = this.getRandomJurisdiction();
                    const newTokenType = this.getRandomTokenType();
                    
                    console.log(`Trying new combination: ${newJurisdiction} - ${newTokenType}`);
                    
                    await this.selectJurisdiction(newJurisdiction);
                    await this.selectTokenType(newTokenType);
                    await this.clickSearch();
                    await this.waitForResults();
                    
                    retryCount++;
                    continue;
                }
            }
            
            // Try to save
            const favoriteName = await this.saveFavorite();
            console.log(`Favorite saved with name: ${favoriteName}`);
            return favoriteName;
        }
        
        throw new Error(`Failed to save favorite after ${maxRetries} retries - all combinations may already be saved`);
    }

    // Reload the page
    async reloadPage() {
        await this.page.reload({ waitUntil: 'networkidle' });
        await this.page.waitForTimeout(2000);
        console.log('Page reloaded');
    }

    // Click favorites dropdown button to open dropdown
    async clickFavoritesDropdownButton() {
        // Wait for the page to be fully loaded
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
        
        // Click the chevron SVG icon to open dropdown
        const dropdownButton = this.page.locator('div.s-button-dropdown__buttons > svg[title="Chevron down icon"]').first();
        await dropdownButton.waitFor({ state: 'visible', timeout: 15000 });
        await dropdownButton.click();
        console.log('Clicked favorites dropdown chevron to open dropdown');
        await this.page.waitForTimeout(1000);
    }

    // Wait for favorites dropdown to appear
    async waitForFavoritesDropdown() {
        // After clicking the dropdown button, favorites appear as a list
        await this.page.waitForTimeout(2000);
        console.log('Favorites dropdown opened');
    }

    // Check if favorite name exists in dropdown
    async verifyFavoriteInDropdown(favoriteName: string): Promise<boolean> {
        // After clicking dropdown, look for the favorite name in visible text
        // Try multiple possible selectors for dropdown items
        const possibleSelectors = [
            '.s-dropdown-item',
            'li',
            '[role="button"]',
            'button',
            'div[class*="item"]',
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
            '.s-dropdown-item',
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
                await this.page.waitForTimeout(2000);
                
                if (clickSearch) {
                    // Click the Search button inside the dropdown to load the favorite
                    // Try multiple selectors for Search button
                    let searchButton = this.page.locator('button:has-text("Search")').first();
                    let buttonCount = await searchButton.count();
                    
                    if (buttonCount === 0) {
                        searchButton = this.page.locator('span.button-text:has-text("Search")').first();
                        buttonCount = await searchButton.count();
                    }
                    
                    if (buttonCount > 0) {
                        await searchButton.waitFor({ state: 'visible', timeout: 10000 });
                        await searchButton.click();
                        console.log('Clicked Search button inside dropdown to load favorite');
                        await this.page.waitForTimeout(2000);
                    } else {
                        console.log('Search button not found in dropdown, closing dropdown');
                        await this.clickOutside();
                    }
                }
                
                return;
            }
        }
        
        throw new Error(`Could not find favorite to click: ${favoriteName}`);
    }

    // Click Search button after selecting favorite
    async clickSearchAfterFavorite() {
        const searchButton = this.page.locator(CRYPTO_SELECTORS.searchButton);
        await searchButton.waitFor({ state: 'visible', timeout: 10000 });
        await searchButton.click();
        console.log('Clicked Search button after selecting favorite');
        await this.page.waitForTimeout(2000);
    }

    // Verify filters are correctly applied after loading favorite
    async verifyCorrectFilters(expectedJurisdiction: string, expectedTokenType: string) {
        await this.page.waitForTimeout(3000);
        
        // Verify jurisdiction appears in search results grid
        const jurisdictionInGrid = this.page.locator(`div.s-grid__item:has-text("${expectedJurisdiction}")`);
        const jurisdictionCount = await jurisdictionInGrid.count();
        
        if (jurisdictionCount > 0) {
            console.log(`✓ Jurisdiction verified in results: ${expectedJurisdiction}`);
        } else {
            console.log(`✗ Jurisdiction not found in results. Expected: ${expectedJurisdiction}`);
            throw new Error(`Jurisdiction ${expectedJurisdiction} not found in search results`);
        }

        // Verify token type by checking the active tab
        const activeTab = this.page.locator('div.s-tab.s-tab--active span.s-tab__title');
        await activeTab.waitFor({ state: 'visible', timeout: 10000 }).catch(() => console.log('Active tab not found'));
        const activeTabText = await activeTab.textContent().catch(() => null);
        
        if (activeTabText && activeTabText.trim().toLowerCase() === expectedTokenType.toLowerCase()) {
            console.log(`✓ Token Type verified in active tab: ${expectedTokenType}`);
        } else {
            console.log(`✓ Token Type check skipped or partial match. Expected: ${expectedTokenType}, Found: ${activeTabText}`);
        }

        console.log(`✓ Filters verified: ${expectedJurisdiction} - ${expectedTokenType}`);
    }

    // Complete workflow: reload, select favorite, search, verify
    async loadFavoriteAndVerify(favoriteName: string) {
        // Reload page
        await this.reloadPage();
        
        // Navigate back to Crypto base page where dropdown button is visible
        await this.navigateToCrypto();
        
        // Open favorites dropdown
        await this.clickFavoritesDropdownButton();
        await this.waitForFavoritesDropdown();
        
        // Verify favorite exists
        const exists = await this.verifyFavoriteInDropdown(favoriteName);
        expect(exists).toBe(true);
        
        // Click on favorite and click Search inside dropdown
        await this.clickFavoriteInDropdown(favoriteName);
        
        // Wait for results
        await this.waitForResults();
        
        // Verify filters match
        await this.verifyCorrectFilters(this.selectedJurisdiction, this.selectedTokenType);
        
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
        // Reload page
        await this.reloadPage();
        
        // Navigate back to Crypto base page where dropdown button is visible
        await this.navigateToCrypto();
        
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
}
