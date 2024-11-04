import { test, expect, chromium, BrowserContext, Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { BaseTestHelper } from "../utils/baseTestHelper";
import { loadLoginData } from "../utils/dataUtils";

let baseTestHelper: BaseTestHelper;
let loginPage: LoginPage;
let browserContext: BrowserContext;

test.describe("Login Functionality Tests", () => {
  test.beforeAll(async () => {
    try {
      // Launch the browser and create a new context
      const browser = await chromium.launch();
      browserContext = await browser.newContext();
      const page: Page = await browserContext.newPage();

      // Initialize helper classes with the page instance
      baseTestHelper = new BaseTestHelper(page);
      loginPage = new LoginPage(page);

      // Navigate to the site and handle cookie consent
      await baseTestHelper.navigateToSite();
      await baseTestHelper.handleCookieConsent("decline");

      // Verify the page title
      const title = await page.title();
      expect(title).toBe("Urlaub mit bis zu 60% Rabatt sichern ▷ ab in den urlaub!");
      console.log("Successfully navigated to the site and verified title.");
    } catch (error) {
      console.error("Error during setup in beforeAll:", error);
      throw error;
    }
  });

  test("Login test with incorrect credentials", async () => {
    try {
      // Load test data from loginData.json
      const { emailId, wrongPassword, notificationMessage } = loadLoginData();

      console.log(`Attempting to log in with email: ${emailId}`);
      await loginPage.openLoginPage();
      await loginPage.enterCredentials(emailId, wrongPassword);
      await loginPage.submitLogin();

      console.log("Verifying login notification message for incorrect credentials...");
      await loginPage.verifyLoginNotificationMessage(notificationMessage);
      console.log("Login test completed successfully.");
    } catch (error) {
      console.error("Error during login test:", error);
      throw error;
    }
  });

  test.afterAll(async () => {
    try {
      await browserContext.close();
      console.log("Browser context closed.");
    } catch (error) {
      console.error("Error closing browser context:", error);
    }
  });
});
