import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { NAVIGATOR_SELECTORS } from '../Utilits/navigator.selectors';

test.describe('Navigator General Sections - Bug Verification', () => {

    test('Banking + Corporate Finance - General should be SUPPRESSED (BUG if visible)', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        // Login
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

        // Navigate to Navigator Compare Licensing page
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        
        // Wait for the page to load completely
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Select Argentina
        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        // Select Banking + Corporate Finance
        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Banking');
        await page.getByRole('button', { name: 'Banking' }).click();
        await page.getByPlaceholder('Search items').fill('Corporate Finance');
        await page.getByRole('button', { name: 'Corporate Finance' }).click();
        await page.keyboard.press('Escape');

        // Click Search
        await page.getByRole('button', { name: 'Search' }).click();

        // Wait for results to load - Licensing Restrictions is open by default
        await page.waitForSelector('[role="tabpanel"]', { timeout: 15000 });
        await page.waitForTimeout(3000);

        // Verify service headings ONLY in Licensing > Restrictions section
        const serviceHeadings = await page.evaluate(() => {
            // Find the Restrictions tabpanel within Licensing section
            // It contains heading "Will your activities trigger a licensing requirement?"
            const allTabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
            const restrictionsPanel = allTabpanels.find(panel => {
                const headings = panel.querySelectorAll('h4');
                return Array.from(headings).some(h => 
                    h.textContent?.includes('Will your activities trigger a licensing requirement')
                );
            });

            if (!restrictionsPanel) {
                return [];
            }

            // Get only service category headings (those that appear immediately after question headers)
            const headings = Array.from(restrictionsPanel.querySelectorAll('h4'));
            const services = ['Banking', 'Corporate Finance', 'General', 'Derivatives & FX', 'Lending', 'Securities', 'Funds'];
            const questionHeaders = [
                'Will your activities trigger a licensing requirement?',
                'Are there any exemptions to avoid triggering the restriction(s)?',
                'Will responding to an unsolicited approach avoid licensing?'
            ];
            
            const serviceHeadings = [];
            for (let i = 0; i < headings.length; i++) {
                const text = headings[i].textContent?.trim() || '';
                const isQuestionHeader = questionHeaders.some(q => text.includes(q));
                
                if (isQuestionHeader) {
                    for (let j = i + 1; j < headings.length; j++) {
                        const nextText = headings[j].textContent?.trim() || '';
                        const isService = services.some(service => nextText === service);
                        
                        if (isService) {
                            serviceHeadings.push(nextText);
                        } else {
                            if (nextText.endsWith(':') || !services.includes(nextText)) {
                                break;
                            }
                        }
                    }
                }
            }
            return serviceHeadings;
        });

        // Count occurrences
        const bankingCount = serviceHeadings.filter(s => s === 'Banking').length;
        const cfCount = serviceHeadings.filter(s => s === 'Corporate Finance').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        // Verify Banking and Corporate Finance appear
        expect(bankingCount).toBeGreaterThan(0);
        expect(cfCount).toBeGreaterThan(0);

        // BUG VERIFICATION: General should be SUPPRESSED in Licensing Restrictions section
        // When Banking OR Corporate Finance OR Lending is selected, General must be suppressed
        expect(generalCount).toBe(0);

        // Verify no other services appear
        const otherServices = serviceHeadings.filter(s => 
            !['Banking', 'Corporate Finance'].includes(s)
        );
        expect(otherServices.length).toBe(0);
    });

    test('Corporate Finance alone - General should be SUPPRESSED (BUG if visible)', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText3 = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText3.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText3.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Corporate Finance');
        await page.getByRole('button', { name: 'Corporate Finance' }).click();
        await page.keyboard.press('Escape');

        await page.getByRole('button', { name: 'Search' }).click();
        
        await page.waitForSelector('[role="tabpanel"]', { timeout: 15000 });
        await page.waitForTimeout(3000);

        const serviceHeadings = await page.evaluate(() => {
            const allTabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
            const restrictionsPanel = allTabpanels.find(panel => {
                const headings = panel.querySelectorAll('h4');
                return Array.from(headings).some(h => 
                    h.textContent?.includes('Will your activities trigger a licensing requirement')
                );
            });

            if (!restrictionsPanel) {
                return [];
            }

            // Find h4 elements that are service category headings
            // Strategy: Look for h4 elements that appear right after the main question headers
            // Service headings appear after: "Will your activities trigger...", "Are there any exemptions...", etc.
            const headings = Array.from(restrictionsPanel.querySelectorAll('h4'));
            const services = ['Banking', 'Corporate Finance', 'General', 'Derivatives & FX', 'Lending', 'Securities', 'Funds'];
            
            // Question headers that appear before service category headings
            const questionHeaders = [
                'Will your activities trigger a licensing requirement?',
                'Are there any exemptions to avoid triggering the restriction(s)?',
                'Will responding to an unsolicited approach avoid licensing?'
            ];
            
            // Filter to only include h4 elements that:
            // 1. Have exact service name text
            // 2. Are the IMMEDIATE next service name after a question header (no other non-service h4 between them)
            const serviceHeadings = [];
            for (let i = 0; i < headings.length; i++) {
                const text = headings[i].textContent?.trim() || '';
                
                // Check if this is a question header
                const isQuestionHeader = questionHeaders.some(q => text.includes(q));
                
                if (isQuestionHeader) {
                    // Collect all service names that immediately follow this question (until we hit a non-service h4)
                    for (let j = i + 1; j < headings.length; j++) {
                        const nextText = headings[j].textContent?.trim() || '';
                        const isService = services.some(service => nextText === service);
                        
                        if (isService) {
                            serviceHeadings.push(nextText);
                        } else {
                            // Stop when we hit a non-service h4 (like "Territorial application:", "Product:", etc.)
                            if (nextText.endsWith(':') || !services.includes(nextText)) {
                                break;
                            }
                        }
                    }
                }
            }
            
            return serviceHeadings;
        });

        const cfCount = serviceHeadings.filter(s => s === 'Corporate Finance').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        expect(cfCount).toBeGreaterThan(0);
        
        // BUG VERIFICATION: General should be SUPPRESSED in Licensing Restrictions section
        expect(generalCount).toBe(0);

        const otherServices = serviceHeadings.filter(s => 
            !['Corporate Finance'].includes(s)
        );
        expect(otherServices.length).toBe(0);
    });

    test('Derivatives & FX only - General SHOULD be visible (NOT suppressed)', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText4 = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText4.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText4.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Derivatives');
        await page.getByRole('button', { name: 'Derivatives & FX' }).click();
        await page.keyboard.press('Escape');

        await page.getByRole('button', { name: 'Search' }).click();
        
        await page.waitForSelector('[role="tabpanel"]', { timeout: 15000 });
        await page.waitForTimeout(3000);

        const serviceHeadings = await page.evaluate(() => {
            const allTabpanels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
            const restrictionsPanel = allTabpanels.find(panel => {
                const headings = panel.querySelectorAll('h4');
                return Array.from(headings).some(h => 
                    h.textContent?.includes('Will your activities trigger a licensing requirement')
                );
            });

            if (!restrictionsPanel) {
                return [];
            }

            const headings = Array.from(restrictionsPanel.querySelectorAll('h4'));
            const services = ['Banking', 'Corporate Finance', 'General', 'Derivatives & FX', 'Lending', 'Securities', 'Funds'];
            return headings
                .map(h => h.textContent?.trim() || '')
                .filter(text => services.includes(text));
        });

        const derivCount = serviceHeadings.filter(s => s === 'Derivatives & FX').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        expect(derivCount).toBeGreaterThan(0);
        
        // CORRECT BEHAVIOR: General SHOULD appear for Derivatives & FX only
        expect(generalCount).toBeGreaterThan(0);

        const otherServices = serviceHeadings.filter(s => 
            !['Derivatives & FX', 'General'].includes(s)
        );
        expect(otherServices.length).toBe(0);
    });
});
