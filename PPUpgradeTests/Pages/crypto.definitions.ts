import { Page, expect } from '@playwright/test';
import { SELECTORS } from '../Utilits/selectors';

export class CryptoDefinitions {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navigate from Results to Definitions tab
    public async openDefinitionsTab() {
        const definitionsTab = this.page.locator(SELECTORS.cryptoDefinitionsTab);
        await definitionsTab.waitFor({ state: 'visible' });
        await definitionsTab.click();

        // Wait for the table to load
        const termHeader = this.page.locator(SELECTORS.definitionsTermHeader);
        await termHeader.waitFor({ state: 'visible', timeout: 15000 });

        // Verify Term column header is visible
        await expect(termHeader).toHaveText('Term');
    }
}