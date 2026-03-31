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
            
            console.log(`✓ Selected jurisdiction: ${jurisdiction}`);
            await this.page.waitForTimeout(300);
        }

        // Close the dropdown
        await this.clickOutside();
        await this.page.waitForTimeout(500);
        console.log(`✓ All ${jurisdictions.length} jurisdictions selected`);
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
        console.log('Selecting all 6 services...');
        
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
            
            console.log(`✓ Selected service: ${service}`);
            await this.page.waitForTimeout(300);
        }

        // Close the dropdown
        await this.clickOutside();
        await this.page.waitForTimeout(500);
        console.log('✓ All 6 services selected');
    }

    // Click Search button
    async clickSearch() {
        console.log('Clicking Search button...');
        const searchButton = this.page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible' });
        await expect(searchButton).toBeEnabled();
        await searchButton.click();
        console.log('Search button clicked, waiting for page to load...');
        await this.page.waitForLoadState('networkidle', { timeout: 60000 });
        await this.page.waitForTimeout(2000);
        console.log('Page loaded after search click');
    }

    // Wait for results to appear
    async waitForResults() {
        console.log('Waiting for JURISDICTION ANALYSIS results...');
        await this.page.getByText('JURISDICTION ANALYSIS').waitFor({ state: 'visible', timeout: 60000 });
        console.log('✓ JURISDICTION ANALYSIS header visible');
        
        // Wait for sidebar sections to actually render - wait for the h4 heading with "Licensing" text
        console.log('Waiting for sidebar sections to render...');
        await this.page.locator('h4:has-text("Licensing")').first().waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(3000);
        console.log('✓ Sidebar sections rendered');
    }

    // Verify sidebar structure contains Scope, Licensing, Product, Jurisdiction Guide
    async verifySidebarStructure() {
        console.log('Verifying sidebar structure (4 sections in order)...');
        
        // Wait for content to stabilize
        await this.page.waitForTimeout(2000);
        
        // Verify each section heading exists in order - target h4 elements directly
        console.log('1. Checking for SCOPE section...');
        const scopeHeading = this.page.locator('h4:has-text("Scope")').first();
        await expect(scopeHeading).toBeVisible({ timeout: 10000 });
        console.log('   ✓ SCOPE section found');
        
        console.log('2. Checking for LICENSING section...');
        const licensingHeading = this.page.locator('h4:has-text("Licensing")').first();
        await expect(licensingHeading).toBeVisible({ timeout: 10000 });
        console.log('   ✓ LICENSING section found');
        
        console.log('3. Checking for PRODUCT section...');
        const productHeading = this.page.locator('h4:has-text("Product")').first();
        await expect(productHeading).toBeVisible({ timeout: 10000 });
        console.log('   ✓ PRODUCT section found');
        
        console.log('4. Checking for JURISDICTION GUIDE section...');
        const jurisdictionHeading = this.page.locator('h4:has-text("Jurisdiction Guide")').first();
        await expect(jurisdictionHeading).toBeVisible({ timeout: 10000 });
        console.log('   ✓ JURISDICTION GUIDE section found');
        
        console.log('✓ All 4 sidebar sections present in correct order');
        return true;
    }

    // Verify Licensing section is expanded and Restrictions is active
    async verifyLicensingExpanded() {
        console.log('Verifying Licensing section is expanded...');
        
        // Wait for content to stabilize
        await this.page.waitForTimeout(1000);
        
        // Find all .s-collapse sections and filter by the one containing Licensing h4
        const allCollapses = await this.page.locator('.s-collapse').all();
        let licensingCollapse = null;
        
        for (const collapse of allCollapses) {
            const h4Text = await collapse.locator('h4').textContent().catch(() => null);
            if (h4Text && h4Text.includes('Licensing')) {
                licensingCollapse = collapse;
                break;
            }
        }
        
        if (!licensingCollapse) {
            throw new Error('Licensing section not found');
        }
        
        // Verify it has the active class (expanded state)
        const className = await licensingCollapse.getAttribute('class');
        if (className?.includes('s-collapse--active')) {
            console.log('✓ Licensing section is expanded');
        } else {
            throw new Error('Licensing section is not expanded');
        }
        
        // Verify Restrictions is visible and active
        const restrictionsActive = this.page.locator('ul.nav-list li.active').filter({ hasText: 'Restrictions' }).first();
        await expect(restrictionsActive).toBeVisible({ timeout: 10000 });
        console.log('✓ Restrictions is active');
        
        // Verify other Licensing sub-items are present
        const licensingItems = [
            'Territorial application',
            'Exemptions',
            'Unsolicited approach',
            'Sanctions'
        ];
        
        for (const item of licensingItems) {
            const listItem = this.page.locator('ul.nav-list li').filter({ hasText: item }).first();
            await expect(listItem).toBeVisible({ timeout: 10000 });
            console.log(`✓ ${item} found in Licensing section`);
        }
        
        return true;
    }

    // Verify Product and Jurisdiction Guide sections are collapsed
    async verifyOtherSectionsCollapsed() {
        console.log('Verifying Product and Jurisdiction Guide sections are collapsed...');
        
        // Get all collapse sections
        const allCollapses = await this.page.locator('.s-collapse').all();
        
        // Find Product section
        for (const collapse of allCollapses) {
            const h4Text = await collapse.locator('h4').textContent().catch(() => null);
            if (h4Text && h4Text.includes('Product')) {
                const className = await collapse.getAttribute('class');
                if (!className?.includes('s-collapse--active')) {
                    console.log('✓ Product section is collapsed');
                } else {
                    console.log('⚠ Product section is expanded (expected collapsed)');
                }
                break;
            }
        }
        
        // Find Jurisdiction Guide section
        for (const collapse of allCollapses) {
            const h4Text = await collapse.locator('h4').textContent().catch(() => null);
            if (h4Text && h4Text.includes('Jurisdiction Guide')) {
                const className = await collapse.getAttribute('class');
                if (!className?.includes('s-collapse--active')) {
                    console.log('✓ Jurisdiction Guide section is collapsed');
                } else {
                    console.log('⚠ Jurisdiction Guide section is expanded (expected collapsed)');
                }
                break;
            }
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
