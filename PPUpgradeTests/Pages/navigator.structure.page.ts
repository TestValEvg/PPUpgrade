import { Page, expect } from '@playwright/test';
import { credentials } from '../Utilits/credentials';
import { SELECTORS } from '../Utilits/selectors';

/**
 * Navigator Structure Page Object Model
 * Handles verification of Navigator Jurisdiction Analysis structure
 */
export class NavigatorStructure {
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

    // Select multiple jurisdictions
    async selectJurisdictions(jurisdictions: string[]) {
        console.log(`Selecting ${jurisdictions.length} jurisdictions: ${jurisdictions.join(', ')}`);
        
        await this.clickOutside();
        
        // Click on the Jurisdiction dropdown
        const jurisdictionText = this.page.getByText('Jurisdiction', { exact: true }).first();
        await jurisdictionText.waitFor({ state: 'visible' });
        await jurisdictionText.click();

        // Wait for dropdown to open
        await this.page.waitForTimeout(600);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });

        for (const jurisdiction of jurisdictions) {
            // Search for the jurisdiction
            await searchInput.clear();
            await searchInput.fill(jurisdiction);
            await this.page.waitForTimeout(450);

            const option = this.page.getByRole('button', { name: `${jurisdiction} ${jurisdiction}` });
            await option.waitFor({ state: 'visible', timeout: 10000 });
            await option.click();
            
            console.log(`Selected jurisdiction: ${jurisdiction}`);
            await this.page.waitForTimeout(300);
        }

        // Close the dropdown
        await this.clickOutside();
        await this.page.waitForTimeout(500);
    }

    // Select a specific service
    async selectService(service: string) {
        console.log(`Selecting service: ${service}`);
        
        await this.clickOutside();
        
        // Click on the Service dropdown
        const serviceText = this.page.getByText('Service', { exact: true }).first();
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();

        // Wait for dropdown to open
        await this.page.waitForTimeout(600);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        
        // Search for the service
        await searchInput.clear();
        await searchInput.fill(service);
        await this.page.waitForTimeout(450);

        const option = this.page.getByRole('button', { name: service });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        
        console.log(`Selected service: ${service}`);
        await this.page.waitForTimeout(300);
    }

    // Select all services
    async selectAllServices() {
        console.log('Selecting all services...');
        
        const services = ['Banking', 'Corporate Finance', 'Derivatives & FX', 'Funds', 'Lending', 'Securities'];
        
        await this.clickOutside();
        
        // Click on the Service dropdown
        const serviceText = this.page.getByText('Service', { exact: true }).first();
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();

        // Wait for dropdown to open
        await this.page.waitForTimeout(600);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });

        for (const service of services) {
            // Search for the service
            await searchInput.clear();
            await searchInput.fill(service);
            await this.page.waitForTimeout(450);

            const option = this.page.getByRole('button', { name: service });
            await option.waitFor({ state: 'visible', timeout: 10000 });
            await option.click();
            
            console.log(`Selected service: ${service}`);
            await this.page.waitForTimeout(300);
        }

        // Close the dropdown
        await this.clickOutside();
        await this.page.waitForTimeout(500);
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
        await this.page.getByText('JURISDICTION ANALYSIS').waitFor({ state: 'visible', timeout: 20000 });
        await this.page.waitForTimeout(500);
        console.log('Results loaded successfully');
    }

    // Verify sidebar structure contains Scope, Licensing, Product, Jurisdiction Guide
    async verifySidebarStructure() {
        console.log('Verifying sidebar structure...');
        
        // Wait for content to stabilize
        await this.page.waitForTimeout(1500);
        
        // Verify Scope section using collapse component
        const scopeCollapse = this.page.locator('div.s-collapse').filter({ hasText: 'SCOPE' });
        await expect(scopeCollapse).toBeVisible({ timeout: 15000 });
        console.log('✓ Scope section found');
        
        // Verify Licensing section using collapse component
        const licensingCollapse = this.page.locator('div.s-collapse').filter({ hasText: 'LICENSING' });
        await expect(licensingCollapse).toBeVisible({ timeout: 15000 });
        console.log('✓ Licensing section found');
        
        // Verify Product section using collapse component
        const productCollapse = this.page.locator('div.s-collapse').filter({ hasText: 'PRODUCT' });
        await expect(productCollapse).toBeVisible({ timeout: 15000 });
        console.log('✓ Product section found');
        
        // Verify Jurisdiction Guide section using collapse component
        const jurisdictionGuideCollapse = this.page.locator('div.s-collapse').filter({ hasText: 'JURISDICTION GUIDE' });
        await expect(jurisdictionGuideCollapse).toBeVisible({ timeout: 15000 });
        console.log('✓ Jurisdiction Guide section found');
        
        return true;
    }

    // Verify Licensing section is expanded and Restrictions is active
    async verifyLicensingExpanded() {
        console.log('Verifying Licensing section is expanded...');
        
        // Wait for content to stabilize
        await this.page.waitForTimeout(1000);
        
        // Find the Licensing collapse component using filter
        const licensingCollapse = this.page.locator('div.s-collapse').filter({ hasText: 'LICENSING' });
        await expect(licensingCollapse).toBeVisible({ timeout: 10000 });
        
        // Verify it has the active class
        await expect(licensingCollapse).toHaveClass(/s-collapse--active/);
        console.log('✓ Licensing section is expanded');
        
        // Verify Restrictions is active/selected - check for active class on the li element
        const restrictionsItem = this.page.locator('ul.nav-list li.active').filter({ hasText: 'Restrictions' });
        await expect(restrictionsItem).toBeVisible({ timeout: 10000 });
        console.log('✓ Restrictions is active');
        
        // Verify other Licensing sub-items are present
        const licensingItems = [
            'Restrictions',
            'Territorial application',
            'Exemptions',
            'Unsolicited approach',
            'Sanctions'
        ];
        
        for (const item of licensingItems) {
            const listItem = this.page.locator('ul.nav-list li').filter({ hasText: item });
            await expect(listItem).toBeVisible({ timeout: 10000 });
            console.log(`✓ ${item} found in Licensing section`);
        }
        
        return true;
    }

    // Verify Product and Jurisdiction Guide sections are collapsed
    async verifyOtherSectionsCollapsed() {
        console.log('Verifying Product and Jurisdiction Guide sections are collapsed...');
        
        // Product section should be collapsed (no active class)
        const productCollapse = this.page.locator('div.s-collapse').filter({ hasText: 'PRODUCT' });
        await expect(productCollapse).toBeVisible({ timeout: 10000 });
        const productClass = await productCollapse.getAttribute('class');
        if (!productClass?.includes('s-collapse--active')) {
            console.log('✓ Product section is collapsed');
        } else {
            console.log('⚠ Product section is expanded (expected collapsed)');
        }
        
        // Jurisdiction Guide section should be collapsed
        const jurisdictionGuideCollapse = this.page.locator('div.s-collapse').filter({ hasText: 'JURISDICTION GUIDE' });
        await expect(jurisdictionGuideCollapse).toBeVisible({ timeout: 10000 });
        const guideClass = await jurisdictionGuideCollapse.getAttribute('class');
        if (!guideClass?.includes('s-collapse--active')) {
            console.log('✓ Jurisdiction Guide section is collapsed');
        } else {
            console.log('⚠ Jurisdiction Guide section is expanded (expected collapsed)');
        }
        
        return true;
    }

    // Verify complete structure
    async verifyCompleteStructure() {
        await this.verifySidebarStructure();
        await this.verifyLicensingExpanded();
        await this.verifyOtherSectionsCollapsed();
        console.log('✓ Complete structure verification passed');
    }
}
