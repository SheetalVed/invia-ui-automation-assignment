// tests/login.test.js
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CookiesBotDialogPage } from '../pages/CookiesBotDialogPage';

test('Login test with cookie consent', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const cookiesDialog = new CookiesBotDialogPage(page);

  // Navigate to the website
  await loginPage.navigateTo('https://www.ab-in-den-urlaub.ch/');

  // Handle cookie consent (e.g., decline cookies)
  await cookiesDialog.decline();

  // Open login page
  await loginPage.openLoginPage();

  // Fill in credentials
  await loginPage.enterCredentials('test@test.com', 'sasas');

  // Submit login
  await loginPage.submitLogin();

  // Verify successful login (optional)
  await loginPage.verifyLoginFailure();
});
