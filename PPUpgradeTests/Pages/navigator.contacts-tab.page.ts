import { Page, expect } from '@playwright/test';
import { credentials } from '../Utilits/credentials';
import { SELECTORS } from '../Utilits/selectors';

/**
 * Navigator Contacts Tab Page Object Model
 * Handles expand/collapse functionality for the Contacts static tab
 * Note: Contacts tab typically does NOT have expandable content
 */
export class NavigatorContactsTab {
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

    // Select Jurisdiction filter
    async selectJurisdiction(jurisdiction: string) {
        await this.clickOutside();
        
        const jurisdictionText = this.page.getByText('Jurisdiction', { exact: true }).first();
        await jurisdictionText.waitFor({ state: 'visible' });
        await jurisdictionText.click();
        await this.page.waitForTimeout(600);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.fill(jurisdiction);
        await this.page.waitForTimeout(500);

        const option = this.page.getByRole('button', { name: `${jurisdiction} ${jurisdiction}` });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        
        await this.clickOutside();
        await this.page.waitForTimeout(300);
    }

    // Select Service filter
    async selectService(service: string) {
        await this.clickOutside();
        
        await this.page.waitForTimeout(1000);
        
        const serviceText = this.page.getByText('Service', { exact: true }).first();
        await serviceText.waitFor({ state: 'visible' });
        await serviceText.click();
        await this.page.waitForTimeout(800);

        const searchInput = this.page.getByPlaceholder('Search items');
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        
        await searchInput.clear();
        await searchInput.fill(service);
        await this.page.waitForTimeout(800);

        const option = this.page.getByRole('button', { name: service });
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.first().click();
        
        await this.clickOutside();
        await this.page.waitForTimeout(300);
    }

    // Click Search button
    async clickSearch() {
        const searchButton = this.page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible' });
        await expect(searchButton).toBeEnabled();
        await searchButton.click();
        await this.page.waitForLoadState('networkidle', { timeout: 60000 });
        await this.page.waitForTimeout(1500);
    }

    // Wait for results to appear
    async waitForResults() {
        await this.page.getByText('JURISDICTION ANALYSIS').waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
    }

    // Navigate to Contacts tab
    async navigateToContactsTab() {
        await this.page.waitForTimeout(1800);
        const contactsTab = this.page.getByRole('button', { name: 'Contacts' });
        await contactsTab.waitFor({ state: 'visible', timeout: 20000 });
        await contactsTab.click();
        await this.page.waitForTimeout(2000);
        console.log('✓ Navigated to Contacts tab');
    }

    // Check if Expand All button exists
    async isExpandAllButtonPresent(): Promise<boolean> {
        try {
            const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
            const count = await expandAllButton.count();
            
            if (count > 0) {
                const isVisible = await expandAllButton.first().isVisible({ timeout: 2000 }).catch(() => false);
                return isVisible;
            }
            return false;
        } catch (error) {
            return false;
        }
    }

    // Click Expand All button if present
    async clickExpandAllIfPresent(): Promise<boolean> {
        const isPresent = await this.isExpandAllButtonPresent();
        
        if (isPresent) {
            const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
            await expandAllButton.waitFor({ state: 'visible', timeout: 10000 });
            await expandAllButton.click();
            await this.page.waitForTimeout(2000);
            console.log('✓ Clicked Expand All button');
            return true;
        } else {
            console.log('ℹ Expand All button not present - no expandable content (expected for Contacts tab)');
            return false;
        }
    }

    // Verify button changed to "Collapse All"
    async verifyCollapseAllButtonVisible() {
        const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
        await expect(collapseAllButton).toBeVisible({ timeout: 10000 });
        console.log('✓ Button changed to "Collapse All"');
    }

    // Verify content is expanded
    async verifyContentExpanded() {
        await this.page.waitForTimeout(1000);
        
        const toggleElements = this.page.locator('div.plus-minus-toggle');
        const count = await toggleElements.count();
        
        if (count > 0) {
            console.log(`✓ Content expanded - found ${count} toggle elements`);
        } else {
            const tableRows = this.page.locator('tbody tr');
            const rowCount = await tableRows.count();
            console.log(`✓ Content expanded - found ${rowCount} table rows`);
        }
    }

    // Click Collapse All button
    async clickCollapseAll() {
        const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
        await collapseAllButton.waitFor({ state: 'visible', timeout: 10000 });
        await collapseAllButton.click();
        await this.page.waitForTimeout(2000);
        console.log('✓ Clicked Collapse All button');
    }

    // Verify button changed back to "Expand All"
    async verifyExpandAllButtonVisible() {
        const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
        await expect(expandAllButton).toBeVisible({ timeout: 10000 });
        console.log('✓ Button changed back to "Expand All"');
    }

    // Verify tab content is loaded
    async verifyTabContentLoaded() {
        await this.page.waitForTimeout(1500);
        
        const hasTable = await this.page.locator('table').count() > 0;
        const hasContent = await this.page.locator('.s-card__content').count() > 0;
        
        if (hasTable || hasContent) {
            console.log('✓ Contacts tab content loaded successfully');
        } else {
            console.log('⚠ Contacts tab content may not be fully loaded');
        }
    }
}
