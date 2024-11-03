import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { CookiesBotDialogPage } from "../pages/CookiesBotDialogPage";
import { loadSearchData, getUrlByCountry } from "../utils/dataUtils";

test("test", async ({ page }) => {
  const homePage = new HomePage(page);
  const cookiesBotDialogPage = new CookiesBotDialogPage(page);

  // Choose the country code, e.g., 'DE', 'AT', or 'CH'
  const countryCode = 'AT';
  const url = getUrlByCountry(countryCode);

  // Load test data from searchData.json
  const { destination, travelPeriodFrom, travelPeriodTo } = loadSearchData();

  // Navigate to the appropriate homepage based on the URL
  await homePage.navigateTo(url);

  // Handle cookie consent
  await cookiesBotDialogPage.decline();

  // Use the loaded data for your test steps
  await homePage.selectDestination(destination);
  await homePage.selectTravelPeriod(travelPeriodFrom, travelPeriodTo);

  await homePage.submit();
  await homePage.clickFirstNewResultAfterLoadMore();
});
