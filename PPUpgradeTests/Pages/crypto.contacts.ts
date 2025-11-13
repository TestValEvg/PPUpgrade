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
}
