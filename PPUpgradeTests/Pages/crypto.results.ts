import { Page, expect } from '@playwright/test';
import { SELECTORS } from '../Utilits/selectors';

export class CryptoResults {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navigate to Crypto page and verify header
    public async navigateToCrypto() {
        const cryptoLink = this.page.locator(SELECTORS.cryptoMenuLink);
        await cryptoLink.waitFor({ state: 'visible' });

        await Promise.all([
            this.page.waitForURL('**/crypto/content'),
            cryptoLink.click(),
        ]);

        const welcomeHeader = this.page.locator(SELECTORS.cryptoWelcomeHeader);
        await welcomeHeader.waitFor({ state: 'visible', timeout: 15000 });
        await expect(welcomeHeader).toHaveText('Welcome to the Crypto Reviewer');
    }

    async viewCryptoData() {
        const viewButton = this.page.locator(SELECTORS.viewCryptoDataButton);
        await viewButton.waitFor({ state: 'visible' });
        await viewButton.click();

        const infoText = this.page.locator(SELECTORS.selectInfoText);
        await infoText.waitFor({ state: 'visible' });
        await expect(infoText).toHaveText('Please select the specific information you would like to review');
    }

    // Search by jurisdiction (dynamic)
    async searchByJurisdiction(jurisdiction: string = 'Canada') {
        // Click the Jurisdiction label (to open section)
        const jurisdictionLabel = this.page.locator(SELECTORS.jurisdictionLabel);
        await jurisdictionLabel.waitFor({ state: 'visible' });
        await jurisdictionLabel.click();

        // Click dropdown icon
        const dropdownIcon = this.page.locator(SELECTORS.jurisdictionLabel);
        await dropdownIcon.waitFor({ state: 'visible' });
        await dropdownIcon.click();

        // Type in the search input
        const inputField = this.page.locator(SELECTORS.jurisdictionInput);
        await inputField.fill(jurisdiction);

        // Select matching jurisdiction
        const option = this.page.locator(`p:has-text("${jurisdiction}")`);
        await option.waitFor({ state: 'visible' });
        await option.click();

        // Click Search and wait for results
        const searchButton = this.page.locator(SELECTORS.searchButton);
        await Promise.all([
            this.page.waitForLoadState('networkidle'),
            searchButton.click(),
        ]);

        // Verify results contain the jurisdiction
        const resultItem = this.page.locator(`text=${jurisdiction}`);
        await resultItem.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(resultItem.first()).toContainText(jurisdiction);
    }

    // Search by multiple jurisdictions
    async searchByMultipleJurisdictions(jurisdictions: string[]) {
        // Click the Jurisdiction label (to open section)
        const jurisdictionLabel = this.page.locator(SELECTORS.jurisdictionLabel);
        await jurisdictionLabel.waitFor({ state: 'visible' });
        await jurisdictionLabel.click();

        for (const jurisdiction of jurisdictions) {
            // Click dropdown icon
            const dropdownIcon = this.page.locator(SELECTORS.jurisdictionLabel);
            await dropdownIcon.waitFor({ state: 'visible' });
            await dropdownIcon.click();

            // Type in the search input
            const inputField = this.page.locator(SELECTORS.jurisdictionInput);
            await inputField.fill(jurisdiction);

            // Select matching jurisdiction
            const option = this.page.locator(`p:has-text("${jurisdiction}")`);
            await option.waitFor({ state: 'visible' });
            await option.click();
        }

        // Click Search and wait for results
        const searchButton = this.page.locator(SELECTORS.searchButton);
        await searchButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    // Verify the status view message for multiple jurisdictions
    async verifyMultiJurisdictionStatusMessage() {
        // Wait for results to load
        await this.page.waitForLoadState('networkidle');
        
        // Check the message contains the multi-jurisdiction text
        const pageContent = await this.page.textContent('body');
        expect(pageContent).toContain('Please refer to the Status view for information on updates');
    }

    // Verify the status view message for single jurisdiction (without checking date)
    async verifySingleJurisdictionStatusMessage() {
        // Wait for results to load
        await this.page.waitForLoadState('networkidle');
        
        // Verify the message contains text without checking specific date
        const pageContent = await this.page.textContent('body');
        expect(pageContent).toContain('Results displayed are effective from');
        expect(pageContent).toContain('for more information please refer to');
    }

    // Click on Status view link
    async clickStatusViewLink() {
        // Wait for page to load
        await this.page.waitForLoadState('networkidle');
        
        // Find and click the Status view link
        const statusLink = this.page.locator(SELECTORS.statusViewLink);
        await statusLink.waitFor({ state: 'visible', timeout: 15000 });
        await statusLink.click();
        
        // Wait longer for navigation to Status page and content to load
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(3000);
    }

    // ============ EXPAND/COLLAPSE FUNCTIONALITY ============
    
    // Check if Expand All button exists
    async isExpandAllButtonPresent(): Promise<boolean> {
        const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
        try {
            await expandAllButton.waitFor({ state: 'visible', timeout: 3000 });
            return true;
        } catch {
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
            console.log('✓ Clicked Expand All button on Crypto Results');
            return true;
        } else {
            console.log('ℹ Expand All button not present - no expandable content');
            return false;
        }
    }

    // Verify Collapse All button is visible
    async verifyCollapseAllButtonVisible() {
        const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
        await expect(collapseAllButton).toBeVisible({ timeout: 10000 });
        console.log('✓ Button changed to "Collapse All"');
    }

    // Verify content is expanded
    async verifyContentExpanded() {
        const toggleElements = this.page.locator('div.plus-minus-toggle');
        const count = await toggleElements.count();
        expect(count).toBeGreaterThan(0);
        console.log(`✓ Found ${count} expandable elements`);
    }

    // Click Collapse All button
    async clickCollapseAll() {
        const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
        await collapseAllButton.waitFor({ state: 'visible', timeout: 10000 });
        await collapseAllButton.click();
        await this.page.waitForTimeout(2000);
        console.log('✓ Clicked Collapse All button');
    }

    // Verify Expand All button is visible (after collapsing)
    async verifyExpandAllButtonVisible() {
        const expandAllButton = this.page.locator('span.button-text:has-text("Expand All")');
        await expect(expandAllButton).toBeVisible({ timeout: 10000 });
        console.log('✓ Button changed back to "Expand All"');
    }

    // Verify content is collapsed
    async verifyContentCollapsed() {
        const collapseAllButton = this.page.locator('span.button-text:has-text("Collapse All")');
        await expect(collapseAllButton).not.toBeVisible({ timeout: 5000 });
        console.log('✓ Content is collapsed');
    }
}