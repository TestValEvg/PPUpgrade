import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { NavigatorPrint } from '../Pages/navigator.print.page';

test.describe('Navigator Print Tests', () => {

    test('User can search and see print button in results', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const navigatorPrint = new NavigatorPrint(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator page (platform1.test-simmons.com - temporary URL)
        await navigatorPrint.navigateToNavigator();

        // Select Jurisdiction: Argentina
        await navigatorPrint.selectJurisdiction('Argentina');

        // Select Service: Corporate Finance
        await navigatorPrint.selectService('Corporate Finance');

        // Click Search button
        await navigatorPrint.clickSearch();

        // Wait for results to appear
        await navigatorPrint.waitForResults();

        // Verify print button is visible
        await navigatorPrint.verifyPrintButtonVisible();
    });

    test('User can click print button after search', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const navigatorPrint = new NavigatorPrint(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator page (platform1.test-simmons.com - temporary URL)
        await navigatorPrint.navigateToNavigator();

        // Select Jurisdiction: Argentina
        await navigatorPrint.selectJurisdiction('Argentina');

        // Select Service: Corporate Finance
        await navigatorPrint.selectService('Corporate Finance');

        // Click Search button
        await navigatorPrint.clickSearch();

        // Wait for results to appear
        await navigatorPrint.waitForResults();

        // Click print button
        await navigatorPrint.clickPrintButton();

        // Give time for print dialog to appear
        await page.waitForTimeout(1000);
    });
});
