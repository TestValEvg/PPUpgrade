import { Page, expect } from '@playwright/test';
import { credentials } from '../Utilits/credentials';
import { SELECTORS } from '../Utilits/selectors';
import { NAVIGATOR_SELECTORS } from '../Utilits/navigator.selectors';

/**
 * Navigator Quarterly Update Page Object Model
 * Handles interactions with the Quarterly Update reporting interface
 */
export class NavigatorQuarterlyUpdate {
    private page: Page;
    // Using dev environment for now, will switch to test in future
    private baseUrl = 'https://platform.dev-simmons.com';

    constructor(page: Page) {
        this.page = page;
    }

    // Login to the platform
    async login() {
        await this.page.goto(`${this.baseUrl}/`);
        
        const signInButton = this.page.locator(SELECTORS.signInButton);
        await signInButton.waitFor({ state: 'visible' });
        await signInButton.click();

        const emailField = this.page.locator(SELECTORS.emailField);
        await emailField.waitFor({ state: 'visible' });
        await emailField.fill(credentials.username);

        const continueButton = this.page.locator(SELECTORS.continueButton);
        await continueButton.waitFor({ state: 'visible' });
        await continueButton.click();

        const passwordField = this.page.locator(SELECTORS.passwordField);
        await passwordField.waitFor({ state: 'visible' });
        await passwordField.fill(credentials.password);

        const signInButton2 = this.page.locator(SELECTORS.signInButton2);
        await signInButton2.waitFor({ state: 'visible' });
        await signInButton2.click();

        const checkButton = this.page.locator(SELECTORS.checkButton);
        await checkButton.waitFor({ state: 'visible' });
        await checkButton.click();

        const submitButton2 = this.page.locator(SELECTORS.submitButton2);
        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'networkidle' }),
            submitButton2.click()
        ]);
        
        await this.page.waitForTimeout(1000);
    }

    // Verify login was successful
    async isLoginSuccessful() {
        const platformTitle = this.page.locator(SELECTORS.platformTitle);
        await platformTitle.waitFor({ state: 'visible', timeout: 20000 });
        return await platformTitle.isVisible();
    }

    // Navigate to Quarterly Update page
    async navigateToQuarterlyUpdate() {
        console.log('Navigating to Quarterly Update page...');
        
        // Navigate directly to Navigator page first
        await this.page.goto(`${this.baseUrl}/navigator/`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        
        // Now click on Latest Quarterly Update link (opens in new tab)
        console.log('Clicking on Latest Quarterly Update link...');
        const quarterlyUpdateLink = this.page.locator(NAVIGATOR_SELECTORS.quarterlyUpdateLink);
        await quarterlyUpdateLink.waitFor({ state: 'visible', timeout: 10000 });
        
        // Wait for new page to open
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            quarterlyUpdateLink.click()
        ]);
        
        // Wait for the new page to load
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(1000);
        
        // Switch context to the new page
        this.page = newPage;
        
        console.log('✓ Quarterly Update page opened in new tab');
    }

    // Click Quarterly Update link and return both original and new tab
    async clickQuarterlyUpdateLinkAndGetNewTab() {
        console.log('Clicking Quarterly Update link and capturing both tabs...');
        
        const originalPage = this.page;
        const quarterlyUpdateLink = this.page.locator(NAVIGATOR_SELECTORS.quarterlyUpdateLink);
        await quarterlyUpdateLink.waitFor({ state: 'visible', timeout: 10000 });
        
        // Wait for new page to open
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            quarterlyUpdateLink.click()
        ]);
        
        // Wait for the new page to load
        await newPage.waitForLoadState('networkidle');
        await newPage.waitForTimeout(1000);
        
        return {
            originalPage: originalPage,
            newPage: newPage
        };
    }

    // Click Navigator link from Quarterly Update page (within the new tab)
    async clickNavigatorLinkOnNewTab(newPage: any) {
        console.log('Clicking Navigator icon from Quarterly Update page...');
        
        // Look for Navigator icon in the left sidebar (menu-icon-link)
        const navigatorLink = newPage.locator('a.menu-icon-link[href="/navigator/compare"]').or(
            newPage.locator('a[href="/navigator/compare"]')
        ).or(
            newPage.locator('svg[title="navigator icon"]').locator('..')
        ).first();
        
        await navigatorLink.waitFor({ state: 'visible', timeout: 10000 });
        await navigatorLink.click();
        await newPage.waitForTimeout(1000);
    }

    // Verify Quarterly Update page is loaded
    async verifyQuarterlyUpdatePageLoaded() {
        console.log('Verifying Quarterly Update page loaded...');
        // Wait for page to load
        await this.page.waitForLoadState('networkidle');
        const url = this.page.url();
        console.log(`Current URL: ${url}`);
        expect(url).toContain('quarterly-update');
        console.log('✓ Quarterly Update page loaded successfully');
    }

    // Verify information tiles are visible
    async verifyInformationTilesVisible() {
        console.log('Verifying information tiles are visible...');
        // TODO: Update selectors based on actual implementation
        const tiles = this.page.locator('[data-testid="info-tile"]').or(
            this.page.locator('.info-tile')
        );
        await tiles.first().waitFor({ state: 'visible', timeout: 10000 });
        const tileCount = await tiles.count();
        expect(tileCount).toBeGreaterThan(0);
    }

    // Verify dashboard calculations are displayed
    async verifyDashboardCalculations() {
        console.log('Verifying dashboard calculations...');
        // TODO: Update selectors based on actual implementation
        const metrics = [
            'Changes Published',
            'Updates in Progress',
            'Jurisdictions Affected',
            'Services'
        ];
        
        for (const metric of metrics) {
            const metricElement = this.page.getByText(metric, { exact: false });
            await expect(metricElement).toBeVisible({ timeout: 10000 });
        }
    }

    // Verify service tiles are displayed
    async verifyServiceTilesVisible() {
        console.log('Verifying service tiles are visible...');
        // TODO: Update selectors based on actual implementation
        const serviceTiles = this.page.locator('[data-testid="service-tile"]').or(
            this.page.locator('.service-tile')
        );
        await serviceTiles.first().waitFor({ state: 'visible', timeout: 10000 });
        const count = await serviceTiles.count();
        expect(count).toBeGreaterThan(0);
    }

    // Navigate to Build Custom Report section
    async openCustomReportBuilder() {
        console.log('Opening custom report builder...');
        // TODO: Update selector based on actual implementation
        const reportBuilderButton = this.page.getByRole('button', { name: /build.*custom.*report/i }).or(
            this.page.getByText(/build.*custom.*report/i)
        );
        await reportBuilderButton.waitFor({ state: 'visible', timeout: 10000 });
        await reportBuilderButton.click();
        await this.page.waitForTimeout(500);
    }

    // Select report type (single selection)
    async selectReportType(reportType: string) {
        console.log(`Selecting report type: ${reportType}`);
        // TODO: Update selectors based on actual implementation
        const reportTypeDropdown = this.page.getByText('Report Type', { exact: false });
        await reportTypeDropdown.click();
        await this.page.waitForTimeout(300);
        
        const option = this.page.getByRole('button', { name: reportType }).or(
            this.page.getByText(reportType, { exact: true })
        );
        await option.click();
        await this.page.waitForTimeout(300);
    }

    // Select services (can select multiple)
    async selectServices(services: string[]) {
        console.log(`Selecting ${services.length} service(s): ${services.join(', ')}`);
        // TODO: Update selectors based on actual implementation
        const servicesDropdown = this.page.getByText('Services', { exact: false }).first();
        await servicesDropdown.click();
        await this.page.waitForTimeout(500);

        for (const service of services) {
            const serviceOption = this.page.getByRole('button', { name: service }).or(
                this.page.getByText(service, { exact: true })
            );
            await serviceOption.click();
            await this.page.waitForTimeout(300);
        }
        
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    // Select all services
    async selectAllServices() {
        console.log('Selecting all services...');
        // TODO: Update selectors based on actual implementation
        const selectAllButton = this.page.getByRole('button', { name: /select all/i });
        await selectAllButton.click();
        await this.page.waitForTimeout(500);
    }

    // Select regions (can select multiple)
    async selectRegions(regions: string[]) {
        console.log(`Selecting ${regions.length} region(s): ${regions.join(', ')}`);
        // TODO: Update selectors based on actual implementation
        const regionsDropdown = this.page.getByText('Regions', { exact: false }).first();
        await regionsDropdown.click();
        await this.page.waitForTimeout(500);

        for (const region of regions) {
            const regionOption = this.page.getByRole('button', { name: region }).or(
                this.page.getByText(region, { exact: true })
            );
            await regionOption.click();
            await this.page.waitForTimeout(300);
        }
        
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    // Select jurisdictions (can select multiple)
    async selectJurisdictions(jurisdictions: string[]) {
        console.log(`Selecting ${jurisdictions.length} jurisdiction(s): ${jurisdictions.join(', ')}`);
        // TODO: Update selectors based on actual implementation
        const jurisdictionsDropdown = this.page.getByText('Jurisdictions', { exact: false }).first();
        await jurisdictionsDropdown.click();
        await this.page.waitForTimeout(500);

        for (const jurisdiction of jurisdictions) {
            const jurisdictionOption = this.page.getByRole('button', { name: jurisdiction }).or(
                this.page.getByText(jurisdiction, { exact: true })
            );
            await jurisdictionOption.click();
            await this.page.waitForTimeout(300);
        }
        
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    // Select change type
    async selectChangeType(changeTypes: string[]) {
        console.log(`Selecting change type(s): ${changeTypes.join(', ')}`);
        // TODO: Update selectors based on actual implementation
        for (const changeType of changeTypes) {
            const checkbox = this.page.getByLabel(changeType).or(
                this.page.getByText(changeType).locator('..').getByRole('checkbox')
            );
            await checkbox.check();
            await this.page.waitForTimeout(200);
        }
    }

    // Select timeframe
    async selectTimeframe(timeframe: string) {
        console.log(`Selecting timeframe: ${timeframe}`);
        // TODO: Update selectors based on actual implementation
        const timeframeOption = this.page.getByText(timeframe, { exact: true });
        await timeframeOption.click();
        await this.page.waitForTimeout(300);
    }

    // Verify generate report button is enabled
    async verifyGenerateReportButtonEnabled() {
        console.log('Verifying generate report button is enabled...');
        const generateButton = this.page.getByRole('button', { name: /generate.*report/i });
        await expect(generateButton).toBeEnabled({ timeout: 5000 });
    }

    // Verify generate report button is disabled
    async verifyGenerateReportButtonDisabled() {
        console.log('Verifying generate report button is disabled...');
        const generateButton = this.page.getByRole('button', { name: /generate.*report/i });
        await expect(generateButton).toBeDisabled({ timeout: 5000 });
    }

    // Click generate report button
    async clickGenerateReportButton() {
        console.log('Clicking generate report button...');
        const generateButton = this.page.getByRole('button', { name: /generate.*report/i });
        await generateButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    // Verify custom report is generated
    async verifyCustomReportGenerated() {
        console.log('Verifying custom report generated...');
        // TODO: Update selectors based on actual implementation
        const reportContent = this.page.locator('[data-testid="report-content"]').or(
            this.page.locator('.report-content')
        );
        await reportContent.waitFor({ state: 'visible', timeout: 15000 });
        await expect(reportContent).toBeVisible();
    }

    // Export report to Word
    async exportToWord() {
        console.log('Exporting report to Word...');
        const exportButton = this.page.getByRole('button', { name: /export.*word/i });
        const downloadPromise = this.page.waitForEvent('download');
        await exportButton.click();
        const download = await downloadPromise;
        console.log(`Downloaded: ${download.suggestedFilename()}`);
        return download;
    }

    // Export report to PDF
    async exportToPDF() {
        console.log('Exporting report to PDF...');
        const exportButton = this.page.getByRole('button', { name: /export.*pdf/i });
        const downloadPromise = this.page.waitForEvent('download');
        await exportButton.click();
        const download = await downloadPromise;
        console.log(`Downloaded: ${download.suggestedFilename()}`);
        return download;
    }

    // Navigate back to content search
    async navigateBackToContentSearch() {
        console.log('Navigating back to content search...');
        const backButton = this.page.getByRole('button', { name: /back.*content.*search/i }).or(
            this.page.getByRole('link', { name: /content.*search/i })
        );
        await backButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    // Verify user returned to content search
    async verifyOnContentSearchPage() {
        console.log('Verifying user is on content search page...');
        const url = this.page.url();
        // TODO: Update expected URL based on actual implementation
        expect(url).toContain('navigator');
    }

    // Helper: Close any open dropdowns
    async closeDropdowns() {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }
}
