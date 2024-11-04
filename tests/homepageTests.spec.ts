import { test, expect, chromium, BrowserContext, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { BaseTestHelper } from "../utils/baseTestHelper";

test.describe("Homepage Elements Verification", () => {
  let homePage: HomePage;
  let baseTestHelper: BaseTestHelper;
  let browserContext: BrowserContext;

  test.beforeAll(async () => {
    try {
      // Launch the browser and create a new context
      const browser = await chromium.launch();
      browserContext = await browser.newContext();
      const page: Page = await browserContext.newPage();

      // Initialize page and helper classes
      homePage = new HomePage(page);
      baseTestHelper = new BaseTestHelper(page);

      await baseTestHelper.navigateToSite();
      await baseTestHelper.handleCookieConsent("decline");
      console.log("Successfully navigated to the homepage and handled cookie consent.");
    } catch (error) {
      console.error("Error during setup in beforeAll:", error);
      throw error; // Rethrow to fail the test suite if there's an issue
    }
  });

  test.afterAll(async () => {
    try {
      await browserContext.close(); // Ensure the browser context is closed
      console.log("Browser context closed.");
    } catch (error) {
      console.error("Error closing browser context:", error);
    }
  });

  test("Verify essential elements on homepage", async () => {
    console.log("Starting verification of essential elements on the homepage...");
    try {
      // Verify that essential elements are present on the homepage
      await homePage.verifyHomePageElements();
      console.log("Essential elements verification completed successfully.");
    } catch (error) {
      console.error("Error during homepage verification:", error);
      await homePage.getPage().screenshot({ path: "homepage_error.png" }); // Capture a screenshot on error
      throw error;
    }
  });
});
