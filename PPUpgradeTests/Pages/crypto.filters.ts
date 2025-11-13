import { Page, expect } from '@playwright/test';
import { SELECTORS } from '../Utilits/selectors';

export class CryptoFilters {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Click outside to close any open dropdowns or overlays
    async clickOutside() {
        // Try ESC first (closes most dropdowns/modals), then fallback to clicking the body
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.locator('body').click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(300);
    }

    // Clear all filter selections
    async clearAllFilters() {
        await this.page.waitForLoadState('networkidle');
    }

    // Select Jurisdiction filter
    async selectJurisdiction(jurisdiction: string) {
        await this.clickOutside();
        const jurisdictionLabel = this.page.locator(SELECTORS.jurisdictionLabel);
        await jurisdictionLabel.waitFor({ state: 'visible' });
        await jurisdictionLabel.click();

        const inputField = this.page.locator(SELECTORS.jurisdictionInput);
        await inputField.fill(jurisdiction);

        const option = this.page.locator(`p:has-text("${jurisdiction}")`);
        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    // Select Token Type filter
    async selectTokenType(tokenType: string) {
        await this.clickOutside();
        const tokenTypeLabel = this.page.locator(SELECTORS.tokenTypeLabel);
        await tokenTypeLabel.waitFor({ state: 'visible' });
        await tokenTypeLabel.click();

        const inputField = this.page.locator(SELECTORS.jurisdictionInput);
        await inputField.fill(tokenType);

        const option = this.page.locator(`p:has-text("${tokenType}")`);
        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    // Clear Token Type selection (click clear link if present)
    async clearTokenType() {
        // Open the Token Type dropdown first so the clear control is visible
        await this.clickOutside();
        const tokenTypeLabel = this.page.locator(SELECTORS.tokenTypeLabel);
        await tokenTypeLabel.waitFor({ state: 'visible' });
        await tokenTypeLabel.click();

        // Try clicking the cross icon button inside the dropdown
        const crossButton = this.page.locator('button:has(svg.s-icon-cross)');
        if (await crossButton.count() > 0) {
            await crossButton.first().click();
            await this.page.waitForLoadState('networkidle');
            return;
        }

        // Fallback: click the 'clear' text near the Token Type label
        const clearLocator = this.page.locator('div:has(span:has-text("Token Type")) >> text=clear');
        if (await clearLocator.count() > 0) {
            await clearLocator.first().click();
            await this.page.waitForLoadState('networkidle');
            return;
        }

        // Another fallback: clear button inside the dropdown box (X icon inside input)
        const insideClear = this.page.locator('div.s-input-dropdown__list >> button:has(svg.s-icon-cross)');
        if (await insideClear.count() > 0) {
            await insideClear.first().click();
            await this.page.waitForLoadState('networkidle');
            return;
        }
    }

    // Select first Token Type from the dropdown
    async selectFirstTokenType() {
        await this.clickOutside();
        const tokenTypeLabel = this.page.locator(SELECTORS.tokenTypeLabel);
        await tokenTypeLabel.waitFor({ state: 'visible' });
        await tokenTypeLabel.click();

        // pick the first option in the list
        const firstOption = this.page.locator('div.s-input-dropdown__list p').first();
        await firstOption.waitFor({ state: 'visible', timeout: 10000 });
        const text = await firstOption.textContent();
        await firstOption.click();
        return text ? text.trim() : '';
    }

    // Get selected Token Type text from the control area
    async getSelectedTokenTypeText() {
        const selected = this.page.locator('div.s-input-dropdown__box:has-text("Token Type") >> .s-input__selection');
        if (await selected.count() === 0) return '';
        const txt = await selected.first().textContent();
        return txt ? txt.trim() : '';
    }

    // Select Category filter
    async selectCategory(category: string) {
        await this.clickOutside();
        const categoryLabel = this.page.locator(SELECTORS.categoryLabel);
        await categoryLabel.waitFor({ state: 'visible' });
        await categoryLabel.click();

        const inputField = this.page.locator(SELECTORS.jurisdictionInput);
        await inputField.fill(category);

        const option = this.page.locator(`p:has-text("${category}")`);
        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    // Select Sub Category filter
    async selectSubCategory(subCategory: string) {
        await this.clickOutside();
        const subCategoryLabel = this.page.locator(SELECTORS.subCategoryLabel);
        await subCategoryLabel.waitFor({ state: 'visible' });
        await subCategoryLabel.click();

        const inputField = this.page.locator(SELECTORS.jurisdictionInput);
        await inputField.fill(subCategory);

        const option = this.page.locator(`p:has-text("${subCategory}")`);
        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    // Select Method filter
    async selectMethod(method: string) {
        await this.clickOutside();
        const methodLabel = this.page.locator(SELECTORS.methodLabel);
        await methodLabel.waitFor({ state: 'visible' });
        await methodLabel.click();

        const inputField = this.page.locator(SELECTORS.jurisdictionInput);
        await inputField.fill(method);

        const option = this.page.locator(`p:has-text("${method}")`);
        await option.waitFor({ state: 'visible' });
        await option.click();
    }

    // Verify Search button is disabled
    async verifySearchButtonDisabled() {
        const searchButton = this.page.locator('button:has-text("Search")');
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });
        
        // Check if button is disabled
        const isDisabled = await searchButton.getAttribute('disabled');
        expect(isDisabled).not.toBeNull();
    }

    // Verify Search button is enabled
    async verifySearchButtonEnabled() {
        const searchButton = this.page.locator('button:has-text("Search")');
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });
        
        // Check if button is not disabled
        const isDisabled = await searchButton.getAttribute('disabled');
        expect(isDisabled).toBeNull();
    }
}
