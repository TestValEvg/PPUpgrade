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

        // Click Expand All button to enable print
        await navigatorPrint.clickExpandAll();

        // Click Search again after expanding
        await navigatorPrint.clickSearch();

        // Click print button
        await navigatorPrint.clickPrintButton();

        // Verify Print to PDF button is visible in print dialog
        await navigatorPrint.verifyPrintToPDFButton();
    });

    test('Disclaimer message appears if not all filters selected', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const navigatorPrint = new NavigatorPrint(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator page
        await navigatorPrint.navigateToNavigator();

        // Select Jurisdiction: Argentina
        await navigatorPrint.selectJurisdiction('Argentina');

        // Select Service: Corporate Finance
        await navigatorPrint.selectService('Corporate Finance');

        // Click Search button
        await navigatorPrint.clickSearch();

        // Wait for results to appear
        await navigatorPrint.waitForResults();

        // Click Expand All button
        await navigatorPrint.clickExpandAll();

        // Click Search again after expanding
        await navigatorPrint.clickSearch();

        // Click print button
        await navigatorPrint.clickPrintButton();

        // Verify disclaimer message appears in print dialog
        await navigatorPrint.verifyFilterMessageVisible();
    });

    test('Print button disabled before search and enabled after search', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'This test only runs on Chromium');
        
        const loginPage = new LoginPage(page);
        const navigatorPrint = new NavigatorPrint(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator page
        await navigatorPrint.navigateToNavigator();

        // Verify Print/Export button is disabled before search
        await navigatorPrint.verifyPrintButtonDisabled();

        // Select Jurisdiction: Argentina
        await navigatorPrint.selectJurisdiction('Argentina');

        // Select Service: Corporate Finance
        await navigatorPrint.selectService('Corporate Finance');

        // Perform a search
        await navigatorPrint.clickSearch();

        // Wait for results to appear
        await navigatorPrint.waitForResults();

        // Click Expand All button
        await navigatorPrint.clickExpandAll();

        // Click Search again after expanding
        await navigatorPrint.clickSearch();

        // Verify Print/Export button becomes enabled after search
        await navigatorPrint.verifyPrintButtonEnabled();
    });
});
