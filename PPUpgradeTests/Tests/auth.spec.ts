import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { SELECTORS } from '../Utilits/selectors';

test.describe('Authentication Tests', () => {
  test('User can login', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login();

    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();
  });

  test('User can logout', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login();
    await loginPage.logout();

    const authHeader = page.locator(SELECTORS.authenticateHeader);
    await authHeader.waitFor({ state: 'visible', timeout: 15000 });
    await expect(authHeader).toHaveText('Authenticate');
  });
});

test.describe('Authentication Visual Regression Tests', () => {
  test('Login page should render correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await page.waitForLoadState('networkidle');

    // Capture full login page screenshot
    await expect(page).toHaveScreenshot('auth-login-page.png', {
      fullPage: true,
      animations: 'disabled'
    });
  });

  test('Crypto dashboard after login should render correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login();
    await expect(await loginPage.isLoginSuccessful()).toBeTruthy();

    // Wait for dashboard to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Mask dynamic elements (user info, timestamps, notifications)
    await page.addStyleTag({
      content: `
        [data-testid="user-name"],
        .user-profile,
        .current-time,
        .notification-badge {
          visibility: hidden !important;
        }
      `
    });

    // Capture dashboard screenshot with masked elements
    await expect(page).toHaveScreenshot('auth-dashboard-after-login.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 50,
      threshold: 0.2
    });
  });

  test('Logout confirmation page should render correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login();
    await loginPage.logout();

    // Wait for logout page to load
    const authHeader = page.locator(SELECTORS.authenticateHeader);
    await authHeader.waitFor({ state: 'visible', timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // Capture logout page screenshot
    await expect(page).toHaveScreenshot('auth-logout-confirmation.png', {
      fullPage: false,
      animations: 'disabled'
    });
  });
});