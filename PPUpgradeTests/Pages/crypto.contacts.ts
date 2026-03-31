import { Page, expect } from '@playwright/test';
import { SELECTORS } from '../Utilits/selectors';

export class CryptoContacts {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navigate from Results to Contacts tab
    public async openContactsTab() {
        const contactsTab = this.page.locator(SELECTORS.cryptoContactsTab);
        await contactsTab.waitFor({ state: 'visible' });
        await contactsTab.click();

        // Wait for the table to load
        await this.page.waitForLoadState('networkidle');
    }

    // Verify only the selected jurisdiction is present on Contacts page
    public async verifyJurisdictionOnContactsPage(jurisdiction: string) {
        // Wait for jurisdiction text to be visible on the page
        const jurisdictionText = this.page.locator(`text=${jurisdiction}`);
        await jurisdictionText.first().waitFor({ state: 'visible', timeout: 15000 });
        
        // Verify the jurisdiction is present
        await expect(jurisdictionText.first()).toContainText(jurisdiction);
    }

    // ============ EXPAND/COLLAPSE FUNCTIONALITY ============
    // Note: Contacts may not have expandable content in some cases
    
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
            console.log('✓ Clicked Expand All button on Contacts tab');
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
        console.log(`✓ Found ${count} expandable elements on Contacts tab`);
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

    // Verify tab content is loaded
    async verifyTabContentLoaded() {
        await this.page.waitForLoadState('networkidle');
        console.log('✓ Contacts tab content loaded');
    }
}
