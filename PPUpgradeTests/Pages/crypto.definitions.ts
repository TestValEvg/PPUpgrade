import { Page, expect } from '@playwright/test';
import { SELECTORS } from '../Utilits/selectors';

export class CryptoDefinitions {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navigate from Results to Definitions tab
    public async openDefinitionsTab() {
        // Wait for network to be idle before proceeding
        await this.page.waitForLoadState('networkidle');
        
        // Get the Definitions tab
        const definitionsTab = this.page.locator(SELECTORS.cryptoDefinitionsTab);
        
        // Wait for it to be visible and clickable
        await definitionsTab.waitFor({ state: 'visible', timeout: 30000 });
        await definitionsTab.click();
        
        // Wait for the page to stabilize after tab click
        await this.page.waitForLoadState('networkidle');

        // Wait for the table to load
        const termHeader = this.page.locator(SELECTORS.definitionsTermHeader);
        await termHeader.waitFor({ state: 'visible', timeout: 30000 });

        // Verify Term column header is visible
        await expect(termHeader).toHaveText('Term');
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
            console.log('✓ Clicked Expand All button on Definitions tab');
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
        console.log(`✓ Found ${count} expandable elements on Definitions tab`);
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

    // Verify tab content is loaded
    async verifyTabContentLoaded() {
        const termHeader = this.page.locator(SELECTORS.definitionsTermHeader);
        await expect(termHeader).toBeVisible({ timeout: 10000 });
        console.log('✓ Definitions tab content loaded');
    }
}