import { test, expect } from '@playwright/test';
import { LoginPage } from '../Pages/login.page';
import { SELECTORS } from '../Utilits/selectors';

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