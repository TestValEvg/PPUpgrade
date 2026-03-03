import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { NavigatorPrint } from '../Pages/navigator.print.page';

test.describe('Navigator Print Tests', () => {
    // Set timeout for all tests in this suite to 10 minutes for stable jurisdiction and service selection
    test.setTimeout(600000);

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

        // Click Expand All button to enable print
        await navigatorPrint.clickExpandAll();

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

        // Verify Print/Export button becomes enabled after search
        await navigatorPrint.verifyPrintButtonEnabled();
    });

    test('Print dialog shows filters dynamically populated from multiple selections', async ({ page, browserName }) => {
        test.skip(browserName !== 'chromium', 'This test only runs on Chromium');
        
        const loginPage = new LoginPage(page);
        const navigatorPrint = new NavigatorPrint(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator page
        await navigatorPrint.navigateToNavigator();

        // Select multiple Jurisdictions: Argentina and Austria
        await navigatorPrint.selectJurisdiction('Argentina');
        await navigatorPrint.selectJurisdiction('Austria');

        // Select multiple Services: Corporate Finance and Derivatives
        await navigatorPrint.selectService('Corporate Finance');
        await navigatorPrint.selectService('Derivatives');

        // Perform a search
        await navigatorPrint.clickSearch();

        // Wait for results to appear
        await navigatorPrint.waitForResults();

        // Click Expand All button
        await navigatorPrint.clickExpandAll();

        // Wait longer for results to fully load
        await page.waitForTimeout(5000);

        // Click print button to open print dialog
        await navigatorPrint.clickPrintButton();

        // Verify Print to PDF button appears in the print dialog
        await navigatorPrint.verifyPrintToPDFButton();

        // Click on Select jurisdiction dropdown in print dialog
        await page.getByRole('button', { name: 'Select jurisdiction...' }).click();

        // Select one of the previously selected jurisdictions (Argentina)
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();

        // Close the jurisdiction dropdown by clicking on the header
        await page.getByRole('heading', { name: 'Printable PDF Selection' }).click();

        // Verify Services included section is visible
        await expect(
            page.getByText('Services included:', { exact: true })
        ).toBeVisible();

        // Verify the selected services are displayed
        await expect(
            page.locator('p.u-font-semibold:has-text("Services included:")').locator('..').locator('p').nth(1)
        ).toContainText('Corporate Finance');
        
        await expect(
            page.locator('p.u-font-semibold:has-text("Services included:")').locator('..').locator('p').nth(1)
        ).toContainText('Derivatives');
    });

    test('Print button is accessible in Definitions tab', async ({ page }) => {
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

        // Click on Definitions button
        await page.getByRole('button', { name: 'Definitions' }).click();

        // Wait for Definitions tab to load
        await page.waitForTimeout(2000);

        // Verify headers appear in table (Jurisdiction, Term, Description)
        await expect(page.getByRole('table').getByText('Jurisdiction', { exact: true })).toBeVisible();
        await expect(page.getByRole('table').getByText('Term', { exact: true })).toBeVisible();
        await expect(page.getByRole('table').getByText('Description', { exact: true })).toBeVisible();

        // Click print button
        await navigatorPrint.clickPrintButton();

        // Verify Print to PDF button is visible in print dialog
        await navigatorPrint.verifyPrintToPDFButton();
    });

    test('Print button is accessible in Legends tab', async ({ page }) => {
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

        // Select Service: Banking
        await navigatorPrint.selectService('Banking');

        // Click Search button
        await navigatorPrint.clickSearch();

        // Wait for results to appear
        await navigatorPrint.waitForResults();

        // Click Expand All button to enable print
        await navigatorPrint.clickExpandAll();

        // Click on Legends button
        await page.getByRole('button', { name: 'Legends' }).click();

        // Wait for Legends tab to load
        await page.waitForTimeout(2000);

        // Verify headers appear in table (Jurisdiction, Service, Scenario, Description, Status)
        await expect(page.getByRole('table').getByText('Jurisdiction', { exact: true })).toBeVisible();
        await expect(page.getByRole('table').getByText('Service', { exact: true })).toBeVisible();
        await expect(page.getByRole('table').getByText('Scenario', { exact: true })).toBeVisible();
        await expect(page.getByRole('table').getByText('Description', { exact: true })).toBeVisible();
        await expect(page.getByRole('table').getByText('Status', { exact: true })).toBeVisible();

        // Click print button
        await navigatorPrint.clickPrintButton();

        // Verify Print to PDF button is visible in print dialog
        await navigatorPrint.verifyPrintToPDFButton();
    });

    test('Disclaimer message appears in Definitions tab print dialog', async ({ page }) => {
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

        // Click on Definitions button
        await page.getByRole('button', { name: 'Definitions' }).click();

        // Wait for Definitions tab to load
        await page.waitForTimeout(2000);

        // Click print button
        await navigatorPrint.clickPrintButton();

        // Verify disclaimer message appears in print dialog
        await navigatorPrint.verifyFilterMessageVisible();
    });

    test('Disclaimer message appears in Legends tab print dialog', async ({ page }) => {
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

        // Select Service: Banking
        await navigatorPrint.selectService('Banking');

        // Click Search button
        await navigatorPrint.clickSearch();

        // Wait for results to appear
        await navigatorPrint.waitForResults();

        // Click Expand All button
        await navigatorPrint.clickExpandAll();

        // Click on Legends button
        await page.getByRole('button', { name: 'Legends' }).click();

        // Wait for Legends tab to load
        await page.waitForTimeout(2000);

        // Click print button
        await navigatorPrint.clickPrintButton();

        // Verify disclaimer message appears in print dialog
        await navigatorPrint.verifyFilterMessageVisible();
    });

    test('User can open print document with correct jurisdiction and cycle info', async ({ page, context }) => {
        const loginPage = new LoginPage(page);
        const navigatorPrint = new NavigatorPrint(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator page (platform1.test-simmons.com - temporary URL)
        await navigatorPrint.navigateToNavigator();

        // Select Jurisdiction: Argentina
        const jurisdictionName = 'Argentina';
        await navigatorPrint.selectJurisdiction(jurisdictionName);

        // Select Service: Corporate Finance
        await navigatorPrint.selectService('Corporate Finance');

        // Click Search button
        await navigatorPrint.clickSearch();

        // Wait for results to appear
        await navigatorPrint.waitForResults();

        // Get the cycle name from the sub-label-text (e.g., "As at February 2024")
        const cycleLabelElement = page.locator('p.sub-label-text').first();
        const cycleName = await cycleLabelElement.textContent();
        console.log(`Cycle name: ${cycleName}`);

        // Click Expand All button to enable print
        await navigatorPrint.clickExpandAll();

        // Set up listener for new window/tab BEFORE clicking print button
        const pagePromise = context.waitForEvent('page', { timeout: 120000 });

        // Click print button
        await navigatorPrint.clickPrintButton();

        // Wait for print dialog to appear
        await page.waitForTimeout(3000);

        // Click on Print to PDF button
        const printToPDFButton = page.getByRole('button', { name: 'Print to PDF' });
        await printToPDFButton.click();

        // Wait for new window/tab to open
        const newPage = await pagePromise;
        console.log('New page opened, waiting for PDF to load...');
        
        // Get the URL of the new page
        const newPageURL = newPage.url();
        console.log(`New page URL: ${newPageURL}`);

        // Wait for the page to finish loading (PDF generation can take time)
        await newPage.waitForLoadState('domcontentloaded', { timeout: 180000 });
        console.log('PDF page loaded');

        // Try to find embed element (Chrome may use embed tag)
        const embedElement = newPage.locator('embed[type="application/x-google-chrome-pdf"]');
        const embedCount = await embedElement.count();
        
        let pdfUrl = newPageURL;
        
        if (embedCount > 0) {
            // If embed element exists, get the original-url attribute
            const embedOriginalUrl = await embedElement.getAttribute('original-url');
            console.log(`Embed original-url: ${embedOriginalUrl}`);
            pdfUrl = embedOriginalUrl || newPageURL;
        } else {
            // If no embed element, Chrome is displaying PDF directly - use page URL
            console.log('No embed element found - Chrome displaying PDF directly');
            console.log(`Using page URL for verification: ${pdfUrl}`);
        }

        // Decode URL for verification (URLs are percent-encoded)
        const decodedPdfUrl = decodeURIComponent(pdfUrl);
        console.log(`Decoded PDF URL: ${decodedPdfUrl}`);

        // Verify PDF URL contains the API endpoint
        expect(decodedPdfUrl).toContain('https://api.test-simmons.com/reports/pp/navigator/export-audit/');

        // Verify PDF URL contains jurisdiction name (Argentina)
        expect(decodedPdfUrl).toContain(jurisdictionName);

        // Verify PDF URL contains cycle name (e.g., "February 2024")
        if (cycleName) {
            // Remove "As at " prefix and trim to get just "February 2024"
            const cycleNameOnly = cycleName.replace('As at ', '').trim();
            expect(decodedPdfUrl).toContain(cycleNameOnly);
        }
    });
});
