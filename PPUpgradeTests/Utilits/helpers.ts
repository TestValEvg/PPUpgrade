import { Page } from '@playwright/test';

export async function waitForElement(page: Page, selector: string, timeout: number = 10000) {
    await page.waitForSelector(selector, { timeout });
}