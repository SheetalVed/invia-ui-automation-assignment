import { test, expect, chromium } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { BaseTestHelper } from "../utils/BaseTestHelper";
import { loadSearchData } from "../utils/dataUtils";

test.describe("Search Functionality Tests", () => {
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
    const title = await page.title();
    console.log("Page title:", title);
    expect(title).toBe(
      "Urlaub mit bis zu 60% Rabatt sichern ▷ ab in den urlaub!"
    );
    console.log(
      "Successfully navigated to the site and handled cookie consent."
    );
  });

  test.afterAll(async () => {
    // This should be inside the describe block to have access to browserContext
    await browserContext.close(); // Close the browser context
    console.log('Browser context closed.');
  });

  test("Search test with destination and date selection", async () => {
    // Load test data from searchData.json
    const { destination, travelPeriodFrom, travelPeriodTo } = loadSearchData();

    console.log(`Searching for destination: ${destination} with travel period from ${travelPeriodFrom} to ${travelPeriodTo}`);
    
    // Use the loaded data for your test steps
    await homePage.selectDestination(destination);
    await homePage.selectTravelPeriod(travelPeriodFrom, travelPeriodTo);
    
    await homePage.submit();
    await homePage.clickFirstNewResultAfterLoadMore();

    console.log("Search test completed successfully.");
  });
});
