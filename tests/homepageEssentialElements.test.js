import { test, expect,chromium } from "@playwright/test";
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
    await baseTestHelper.handleCookieConsent();
    console.log("Successfully navigated and cookie consent handled.");
  });

  test.afterAll(async () => {
    console.log("Cleaning up after tests...");
    // Any necessary cleanup can be performed here.
  });

  test("Verify essential elements on homepage", async () => {
    console.log("Starting verification of essential elements on the homepage...");
    await homePage.verifyHomePageElements();
    console.log("Essential elements verification completed successfully.");
  });
});
