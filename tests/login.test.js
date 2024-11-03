import { test, expect, chromium } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { BaseTestHelper } from '../utils/BaseTestHelper';
import { loadLoginData } from '../utils/dataUtils';

let baseTestHelper;
let loginPage;
let browserContext;

test.describe("Login Functionality Tests", () => {
  test.beforeAll(async () => {
    // Launch the browser and create a new context
    const browser = await chromium.launch();
    browserContext = await browser.newContext();
    
    // Initialize page and helper classes
    const page = await browserContext.newPage();
    baseTestHelper = new BaseTestHelper(page);
    loginPage = new LoginPage(page);

    console.log('Navigating to the site and handling cookie consent...');
    await baseTestHelper.navigateToSite();
    await baseTestHelper.handleCookieConsent();
    console.log('Successfully navigated to the site and handled cookie consent.');
  });

  test('Login test with cookie consent', async () => {
    // Load test data from loginData.json
    const { emailId, password, notificationMessage } = loadLoginData();

    console.log(`Attempting to log in with email: ${emailId}`);
    await loginPage.openLoginPage();
    await loginPage.enterCredentials(emailId, password);
    await loginPage.submitLogin();

    console.log('Verifying login notification message...');
    await loginPage.verifyLoginNotificationMessage(notificationMessage);
    console.log('Login test completed successfully.');
  });

  test.afterAll(async () => {
    await browserContext.close(); // Close the browser context
    console.log('Browser context closed.');
  });
});
