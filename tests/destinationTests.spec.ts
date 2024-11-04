import { test, expect, chromium, BrowserContext, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { BaseTestHelper } from "../utils/baseTestHelper";
import { loadSearchData } from "../utils/dataUtils";
import { OfferPage } from "../pages/OfferPage"; 

let homePage: HomePage;
let offerPage: OfferPage;
let baseTestHelper: BaseTestHelper;
let browserContext: BrowserContext;

test.describe("Search Functionality and Offer Verification Tests", () => {
  test.beforeAll(async () => {
    try {
      const browser = await chromium.launch();
      browserContext = await browser.newContext();
      const page: Page = await browserContext.newPage();
      
      homePage = new HomePage(page);
      offerPage = new OfferPage(page);
      baseTestHelper = new BaseTestHelper(page);

      await baseTestHelper.navigateToSite();
      await baseTestHelper.handleCookieConsent('decline');
      const title = await page.title();
      expect(title).toBe("Urlaub mit bis zu 60% Rabatt sichern ▷ ab in den urlaub!");

      console.log("Successfully navigated to the site and handled cookie consent.");
    } catch (error) {
      console.error("Error during setup in beforeAll:", error);
      throw error; // Re-throw to fail the test suite if there's an issue
    }
  });

  test.afterAll(async () => {
    try {
      await browserContext.close();
      console.log('Browser context closed.');
    } catch (error) {
      console.error("Error closing browser context:", error);
    }
  });

  test("Search test with destination and verify offers", async () => {
    try {
      const { destination, travelPeriodFrom, travelPeriodTo } = loadSearchData();
      console.log(`Searching for destination: ${destination} from ${travelPeriodFrom} to ${travelPeriodTo}`);

      await homePage.selectDestination(destination);
      await homePage.selectTravelPeriod(travelPeriodFrom, travelPeriodTo);
      
      const hasResults = await homePage.submit();
      if (hasResults) {
        const [newTab] = await Promise.all([
          browserContext.waitForEvent('page'),
          homePage.clickFirstNewResultAfterLoadMore()
        ]);
  
        offerPage = new OfferPage(newTab);
  
        const isVisible = await offerPage.isOffersHeadlineVisible();
        expect(isVisible).toBe(true); // Assert that the offers headline is visible

        const [bookingTab] = await Promise.all([
          browserContext.waitForEvent('page', { timeout: 10000 }),
          offerPage.clickFirstBookOffer()
        ]);
        
        console.log("Clicked the first book offer successfully.");
        
        offerPage = new OfferPage(bookingTab);
        
        const bookingDetailText = await offerPage.getBookingDetailText();
        console.log("Booking detail text:", bookingDetailText);
        expect(bookingDetailText).toContain('Deine Reise');
      } else {
        console.log("No results were found for the search.");
      }
    } catch (error) {
      console.error("Error during search test execution:", error);
      throw error; // Re-throw to fail the test case
    }
  });
});
