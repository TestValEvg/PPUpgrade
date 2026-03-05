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

    // Store selected values for verification
    public selectedJurisdiction: string = '';
    public selectedService: string = '';
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
        await this.page.waitForTimeout(800);

        const option = this.page.getByRole('button', { name: `${jurisdiction} ${jurisdiction}` });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();

        // Wait for selection to apply and for services to update
        await this.page.waitForTimeout(2000);
        await this.clickOutside();
        
        // Additional waits to ensure services dropdown is populated with jurisdiction-specific options
        await this.page.waitForTimeout(3000);
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

    // Navigate to Static Views tabs
    async navigateToDefinitions() {
        const definitionsTab = this.page.getByRole('tab', { name: 'Definitions' });
        await definitionsTab.waitFor({ state: 'visible', timeout: 10000 });
        await definitionsTab.click();
        await this.page.waitForTimeout(2000);
    }

    async navigateToStatus() {
        const statusTab = this.page.getByRole('tab', { name: 'Status' });
        await statusTab.waitFor({ state: 'visible', timeout: 10000 });
        await statusTab.click();
        await this.page.waitForTimeout(2000);
    }

    async navigateToLegends() {
        const legendsTab = this.page.getByRole('tab', { name: 'Legends' });
        await legendsTab.waitFor({ state: 'visible', timeout: 10000 });
        await legendsTab.click();
        await this.page.waitForTimeout(2000);
    }

    async navigateToContacts() {
        const contactsTab = this.page.getByRole('tab', { name: 'Contacts' });
        await contactsTab.waitFor({ state: 'visible', timeout: 10000 });
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
    async saveFavoriteWithRetry(customName?: string, maxRetries: number = 3): Promise<string> {
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            // Check if favorite button is already saved (filled/yellow)
            const alreadySaved = await this.isFavoriteAlreadySaved();
            
            if (alreadySaved) {
                console.log(`Attempt ${retryCount + 1}: Favorite already exists with ${this.selectedJurisdiction} - ${this.selectedService}`);
                console.log('Changing jurisdiction and service selections...');
                
                // Select different random jurisdiction and service
                const newJurisdiction = this.getRandomJurisdiction();
                const newService = this.getRandomService();
                
                console.log(`Trying with new selection: ${newJurisdiction} - ${newService}`);
                
                // Select new filters
                await this.selectJurisdiction(newJurisdiction);
                await this.selectService(newService);
                
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
}
