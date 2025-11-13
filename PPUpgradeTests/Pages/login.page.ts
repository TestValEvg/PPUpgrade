import { Page, expect } from '@playwright/test';
import { credentials } from '../Utilits/credentials';
import { SELECTORS } from '../Utilits/selectors';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://platform.qa-simmons.com/');
    }

    async login() {
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
    }

    async isLoginSuccessful() {
        const platformTitle = this.page.locator(SELECTORS.platformTitle);
        await platformTitle.waitFor({ state: 'visible', timeout: 20000 });
        return await platformTitle.isVisible();
    }

    async logout() {
        const logoutButton = this.page.locator(SELECTORS.logoutButton);
        await logoutButton.waitFor({ state: 'visible' });
        await logoutButton.click();
        const authHeader = this.page.locator(SELECTORS.authenticateHeader);
        await authHeader.waitFor({ state: 'visible', timeout: 15000 });

        await expect(authHeader).toHaveText('Authenticate');
    }
}