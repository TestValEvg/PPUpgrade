import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';

test.describe('Navigator Filters - Validation Rules', () => {

    test('Search button is disabled when filters are empty', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator Compare Licensing page
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        
        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        // Get the Search button
        const searchButton = page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });

        // Verify Search button is disabled when no selections are made
        await expect(searchButton).toBeDisabled();
    });

    test('Search button is enabled only when Jurisdiction and Service have selections', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator Compare Licensing page
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        
        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(2000);

        const searchButton = page.getByRole('button', { name: 'Search' });
        await searchButton.waitFor({ state: 'visible', timeout: 15000 });

        // Initially should be disabled
        await expect(searchButton).toBeDisabled();

        // Select only Jurisdiction - button should still be disabled
        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Verify button is still disabled (need Service too)
        await expect(searchButton).toBeDisabled();

        // Now select Service - button should become enabled
        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Banking');
        await page.getByRole('button', { name: 'Banking' }).click();
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        // Verify button is now enabled
        await expect(searchButton).toBeEnabled();
    });
});
