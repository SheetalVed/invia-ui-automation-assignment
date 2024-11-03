import { expect } from "@playwright/test";
import { DateUtils } from "../utils/dateUtils.js";

export class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Define selectors for elements on the homepage
    this.destinationSelector = page.getByTestId("destination-field");
    this.airportSelector = page.getByTestId("airports-field");
    this.dateSelector = page.getByTestId("travel-period-field");
    this.transportationSelector = page.getByTestId(
      "travellers-field-multiroom"
    );
    this.passengerSelector = page.getByTestId("travellers-field-multiroom");
    this.loginButton = page.getByTestId("IconAccountCircle");
    this.submitButton = page.getByTestId("submit");
    this.loadMoreButtonSelector =
      'button[data-testid="find-hotellist-loadMoreButton"]';
    this.searchResultsSelector = 'a[data-testid="find-hotellist-hotelbox-cta"]';
    this.findOfferButton = page.getByTestId("find-offerlist-offerbox-cta");
    this.iconArrowForward = page.getByTestId("IconArrowForward");
    this.takeOverButton = page.locator(".e9uklbu0");
  }

  // Method to navigate to a specific URL
  async navigateTo(url) {
    await this.page.goto(url);
  }

  // Method to verify the presence of essential homepage elements
  async verifyHomePageElements() {
    await expect(this.destinationSelector).toBeVisible();
    await expect(this.airportSelector).toBeVisible();
    await expect(this.dateSelector).toBeVisible();
    await expect(this.transportationSelector).toBeVisible();
    await expect(this.passengerSelector).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  // Method to select a destination
  async selectDestination(destination) {
    try {
      // Click on the destination field to activate it
      await this.destinationSelector.click();
      // Type the destination name
      await this.destinationSelector.fill(destination);

      // Wait for the dropdown list to appear
      await this.page.waitForSelector(
        '//div[@data-testid="destination-widget"]/div/div/div/ul/li/div[1]'
      );

      // Get all the dropdown options into a list of locators
      const options = this.page.locator(
        '//div[@data-testid="destination-widget"]/div/div/div/ul/li/div[1]'
      );

      // Iterate through the list of options and click the matching one
      for (let i = 0; i < (await options.count()); i++) {
        const optionText = await options.nth(i).textContent();

        // Check if the option text matches the desired destination
        if (optionText.trim().toLowerCase() === destination.toLowerCase()) {
          console.log(`Clicking option: ${optionText}`);
          // Attempt to click the matching option
          try {
            await this.page.pause();
            await this.page.waitForLoadState("networkidle");
            const optiontoSelect = this.page.locator(
              '//div[@data-testid="destination-widget"]/div/div/div/ul/li/div[1]/parent::li'
            );
            //await optiontoSelect.nth(i).click();
            await options.nth(i).hover();
            await options.nth(i).click({ force: true });
            break; // Exit loop after clicking the matching option
          } catch (clickError) {
            console.error(`Failed to click option at index ${i}:`, clickError);
          }
        }
      }
    } catch (error) {
      console.error("Error selecting destination:", error);
    }
  }

  async selectDestination123(destination) {
    try {
      await this.page.pause();
      // Click on the destination field to activate it
      await this.destinationSelector.click();
      // Type the destination name
      await this.destinationSelector.fill(destination);

      // Wait for the dropdown list to appear
      await this.page.waitForSelector(
        '//div[@data-testid="destination-widget"]/div/div/div/ul/li'
      );

      // Use `getByTestId` to locate the `destination-widget`, then filter options by matching text
      const option = this.page
        .getByTestId("destination-widget")
        .locator("div")
        .filter({ hasText: new RegExp(`^${destination}$`, "i") }); // Use regex to match exact text, case-insensitive

      // Check if the option is visible and click it
      if (await option.isVisible()) {
        // Scroll the option into view if needed
        await option.scrollIntoViewIfNeeded();

        // Optional: Wait for a short time to ensure everything is rendered correctly
        await this.page.waitForTimeout(300);
        await this.page.waitForLoadState("networkidle"); // Wait for all network requests to finish

        try {
          // Click the option
          await this.page.waitForLoadState("networkidle");
          console.log(option);
          await option.click();
          console.log(`Successfully clicked on option: ${destination}`);
        } catch (error) {
          console.error(
            `Failed to click on option: ${destination}. Error: ${error.message}`
          );
        }
      } else {
        console.warn(`Option "${destination}" is not visible in the dropdown.`);
      }
    } catch (error) {
      console.error("Error selecting destination:", error);
    }
  }

  // Method to enter a travel period directly (for quick input in tests)
  async enterDate() {
    await this.dateSelector.click();
    await this.dateSelector.fill("01.11.2024 - 10.11.2024");
  }

  // Method to select a travel period from the calendar widget by using start and end dates
  async selectTravelPeriod(startDate, endDate) {
    await this.dateSelector.click();
    await this.selectTravelDateRange(startDate, endDate); // Pass dates to the range selector
  }

  // Method to select a travel date range using DateUtils
  async selectTravelDateRange(startDate, endDate) {
    // Calls DateUtils' date range selector method
    await DateUtils.selectDateRange(this.page, startDate, endDate);
  }

  // Method to submit the form
  async submit() {
    await this.submitButton.click();
  }

  //click forwardArrow
  async clickForwardArrow() {
    await this.iconArrowForward.click();
    await this.takeOverButton.click();
  }

  async clickLoadMore() {
    await this.loadMoreButtonSelector.click();
  }

  async findHotel() {
    await this.findHotelButton().nth(26).click();
  }

  async selectOffer() {
    await this.findOfferButton().nth(26);
  }

  //select offer
  async clickFirstNewResultAfterLoadMore() {
    try {
      console.log(`Using selector: ${this.searchResultsSelector}`);

      // Check the selector type before passing it to `waitForSelector`
      if (typeof this.searchResultsSelector !== "string") {
        throw new Error("searchResultsSelector is not a string");
      }

      // Wait for the initial results to load
      await this.page.waitForSelector(this.searchResultsSelector);

      // Count existing results before clicking "Load More"
      const initialResultsCount = await this.page
        .locator(this.searchResultsSelector)
        .count();

      // Click "Load More" if it is visible
      const isLoadMoreVisible = await this.page
        .locator(this.loadMoreButtonSelector)
        .isVisible();
      if (isLoadMoreVisible) {
        await this.page.locator(this.loadMoreButtonSelector).click();
        // Wait for new results to load after clicking
        await this.page.waitForTimeout(1000); // Adjust based on loading time if needed

        // Wait until more results are available than the initial count
        // await this.page.waitForFunction(
        //   (selector, initialCount) =>
        //     document.querySelectorAll(selector).length > initialCount,
        //   this.searchResultsSelector,
        //   initialResultsCount
        // );

        // Locate the first newly loaded result and click it
        await this.page
          .locator(this.searchResultsSelector)
          .nth(initialResultsCount)
          .click();
      } else {
        console.warn(
          `"Load More" button is not visible or all results are already loaded.`
        );
      }
    } catch (error) {
      console.error("Error fetching initial results count:", error);
    }
  }
}
