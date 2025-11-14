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
}