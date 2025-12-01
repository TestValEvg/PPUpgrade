import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';

test.describe('Navigator - General Service Visibility Rules', () => {
    test.beforeEach(async ({ page }) => {
        // Configure longer timeout for these tests since they involve navigation + filters + API calls
        test.setTimeout(120000);
    });

    /**
     * CORRECT RULE FROM NAVIGATOR TEAM:
     * General should NOT be visible when selecting ONLY Banking, CF, or Lending (or any combination of these 3)
     * General SHOULD be visible when adding Derivatives, Securities, Funds, or other non-suppressing services
     */

    test('Banking + Derivatives - General SHOULD be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        // Select Argentina jurisdiction
        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        // Select Banking service
        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Banking');
        await page.getByRole('button', { name: 'Banking' }).click();
        await page.keyboard.press('Escape');

        // Select Derivatives & FX service
        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Derivatives');
        await page.getByRole('button', { name: 'Derivatives & FX' }).click();
        await page.keyboard.press('Escape');

        // Click Search
        await page.getByRole('button', { name: 'Search' }).click();
        
        // Wait for results to load
        await page.waitForSelector('[role="tabpanel"]', { timeout: 15000 });
        await page.waitForTimeout(3000);

        // Extract service headings from Licensing Restrictions section
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

        const bankingCount = serviceHeadings.filter(s => s === 'Banking').length;
        const derivativesCount = serviceHeadings.filter(s => s === 'Derivatives & FX').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        expect(bankingCount).toBeGreaterThan(0);
        expect(derivativesCount).toBeGreaterThan(0);
        
        // CORRECT BEHAVIOR: General SHOULD be visible when selecting Banking + Derivatives
        // Derivatives is NOT a suppressing service, so General appears
        expect(generalCount).toBeGreaterThan(0);
    });

    test('Banking + Lending - General should NOT be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        // Select Banking
        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Banking');
        await page.getByRole('button', { name: 'Banking' }).click();
        await page.keyboard.press('Escape');

        // Select Lending
        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Lending');
        await page.getByRole('button', { name: 'Lending' }).click();
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

        const bankingCount = serviceHeadings.filter(s => s === 'Banking').length;
        const lendingCount = serviceHeadings.filter(s => s === 'Lending').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        expect(bankingCount).toBeGreaterThan(0);
        expect(lendingCount).toBeGreaterThan(0);
        
        // CORRECT BEHAVIOR: General should NOT be visible when selecting Banking + Lending
        // General is suppressed for ANY combination of ONLY Banking, CF, or Lending
        expect(generalCount).toBe(0);
    });

    test('Banking + CF + Lending - General should NOT be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        // Select Banking, CF, Lending
        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Banking');
        await page.getByRole('button', { name: 'Banking' }).click();
        await page.keyboard.press('Escape');

        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Corporate Finance');
        await page.getByRole('button', { name: 'Corporate Finance' }).click();
        await page.keyboard.press('Escape');

        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Lending');
        await page.getByRole('button', { name: 'Lending' }).click();
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

        const bankingCount = serviceHeadings.filter(s => s === 'Banking').length;
        const cfCount = serviceHeadings.filter(s => s === 'Corporate Finance').length;
        const lendingCount = serviceHeadings.filter(s => s === 'Lending').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        expect(bankingCount).toBeGreaterThan(0);
        expect(cfCount).toBeGreaterThan(0);
        expect(lendingCount).toBeGreaterThan(0);
        
        // CORRECT BEHAVIOR: General should NOT be visible - all 3 suppressing services selected
        expect(generalCount).toBe(0);
    });

    test('All services selected - General SHOULD be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        // Select all services
        const services = ['Banking', 'Corporate Finance', 'Derivatives & FX', 'Lending', 'Securities', 'Funds'];
        for (const service of services) {
            await page.getByText('Service', { exact: true }).click();
            await page.getByPlaceholder('Search items').fill(service);
            await page.getByRole('button', { name: service }).click();
            await page.keyboard.press('Escape');
        }

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

        const generalCount = serviceHeadings.filter(s => s === 'General').length;
        
        // CORRECT BEHAVIOR: General SHOULD be visible when multiple services selected
        expect(generalCount).toBeGreaterThan(0);
    });

    test('Banking only - General should NOT be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Banking');
        await page.getByRole('button', { name: 'Banking' }).click();
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

        const bankingCount = serviceHeadings.filter(s => s === 'Banking').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        expect(bankingCount).toBeGreaterThan(0);
        
        // CORRECT BEHAVIOR: General should NOT appear when ONLY Banking is selected
        expect(generalCount).toBe(0);

        const otherServices = serviceHeadings.filter(s => !['Banking'].includes(s));
        expect(otherServices.length).toBe(0);
    });

    test('Corporate Finance only - General should NOT be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
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

        const cfCount = serviceHeadings.filter(s => s === 'Corporate Finance').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        expect(cfCount).toBeGreaterThan(0);
        
        // CORRECT BEHAVIOR: General should NOT appear when ONLY CF is selected
        expect(generalCount).toBe(0);

        const otherServices = serviceHeadings.filter(s => !['Corporate Finance'].includes(s));
        expect(otherServices.length).toBe(0);
    });

    test('Lending only - General should NOT be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
        await page.getByPlaceholder('Search items').fill('Argentina');
        await page.getByRole('button', { name: 'Argentina Argentina' }).click();
        await page.keyboard.press('Escape');

        await page.getByText('Service', { exact: true }).click();
        await page.getByPlaceholder('Search items').fill('Lending');
        await page.getByRole('button', { name: 'Lending' }).click();
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

        const lendingCount = serviceHeadings.filter(s => s === 'Lending').length;
        const generalCount = serviceHeadings.filter(s => s === 'General').length;

        expect(lendingCount).toBeGreaterThan(0);
        
        // CORRECT BEHAVIOR: General should NOT appear when ONLY Lending is selected
        expect(generalCount).toBe(0);

        const otherServices = serviceHeadings.filter(s => !['Lending'].includes(s));
        expect(otherServices.length).toBe(0);
    });

    test('Derivatives & FX only - General SHOULD be visible', async ({ page }) => {
        const loginPage = new LoginPage(page);
        
        await loginPage.navigate();
        await loginPage.login();
        await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
        
        await page.goto('https://platform.test-simmons.com/navigator/compare/licensing');
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const jurisdictionText = page.getByText('Jurisdiction', { exact: true });
        await jurisdictionText.waitFor({ state: 'visible', timeout: 15000 });
        await jurisdictionText.click();
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
        
        // CORRECT BEHAVIOR: General SHOULD appear for Derivatives & FX
        expect(generalCount).toBeGreaterThan(0);

        const otherServices = serviceHeadings.filter(s => 
            !['Derivatives & FX', 'General'].includes(s)
        );
        expect(otherServices.length).toBe(0);
    });
});
