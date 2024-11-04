import { test, expect, chromium } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { BaseTestHelper } from "../utils/BaseTestHelper";

test.describe("Homepage Elements Verification", () => {
  let homePage;
  let baseTestHelper;
  let browserContext;

  test.beforeAll(async () => {
    // Launch the browser and create a new context
    const browser = await chromium.launch();
    browserContext = await browser.newContext();
    
    // Initialize page and helper classes
    const page = await browserContext.newPage();
    homePage = new HomePage(page);
    baseTestHelper = new BaseTestHelper(page);

    console.log("Navigating to the website and handling cookie consent...");
    await baseTestHelper.navigateToSite();
    await baseTestHelper.handleCookieConsent('decline');
    console.log("Successfully navigated and cookie consent handled.");
  });

  test.afterAll(async () => {
    await browserContext.close(); // Ensure the browser context is closed
    console.log("Browser context closed.");
  });

  test("Verify essential elements on homepage", async () => {
    console.log("Starting verification of essential elements on the homepage...");
    try {
      // Verify that essential elements are present on the homepage
      await homePage.verifyHomePageElements();

      // Additional assertions
      await expect(homePage.submitButton).toBeEnabled();
      
      // Check the count of specific items if applicable
      const destinationCount = await homePage.destinationSelector.count();
      expect(destinationCount).toBeGreaterThan(0);

      console.log("Essential elements verification completed successfully.");
    } catch (error) {
      console.error("Error during verification:", error);
      await homePage.page.screenshot({ path: 'homepage_error.png' }); // Capture screenshot on failure
      throw error; // Rethrow to fail the test
    }
  });
});
