import { expect, Page } from "@playwright/test";
import { DateUtils } from "../utils/dateUtils.js";

/**
 * Class representing the homepage of the application.
 * Provides methods to interact with and verify elements on the homepage.
 */
export class HomePage {
  constructor(page) {
    this.page = page;

    // Define selectors for elements on the homepage
    this.destinationSelector = page.getByTestId("destination-field");
    this.airportSelector = page.getByTestId("airports-field");
    this.dateSelector = page.getByTestId("travel-period-field");
    this.transportationSelector = page.getByTestId("travellers-field-multiroom");
    this.passengerSelector = page.getByTestId("travellers-field-multiroom"); // Check if this is intended to be the same
    this.loginButton = page.getByTestId("IconAccountCircle");
    this.submitButton = page.getByTestId("submit");
    this.loadMoreButtonSelector = 'button[data-testid="find-hotellist-loadMoreButton"]';
    this.searchResultsSelector = 'a[data-testid="find-hotellist-hotelbox-cta"]';
    this.findOfferButton = page.getByTestId("find-offerlist-offerbox-cta");
    this.iconArrowForward = page.getByTestId("IconArrowForward");
    this.takeOverButton = page.locator(".e9uklbu0");
  }

  /**
   * Navigate to a specified URL.
   * @param {string} url - The URL to navigate to.
   * @throws Will throw an error if navigation fails.
   */
  async navigateTo(url) {
    try {
      console.log(`Navigating to URL: ${url}`);
      await this.page.goto(url);
      console.log(`Successfully navigated to ${url}`);
    } catch (error) {
      console.error(`Failed to navigate to ${url}: ${error.message}`);
      throw error; // Fail the test if navigation fails
    }
  }

  /**
   * Verify essential elements on the homepage are visible.
   * Throws an error if any element is not visible.
   */
  async verifyHomePageElements() {
    console.log('Verifying homepage elements...');
    await expect(this.destinationSelector).toBeVisible();
    await expect(this.airportSelector).toBeVisible();
    await expect(this.dateSelector).toBeVisible();
    await expect(this.transportationSelector).toBeVisible();
    await expect(this.passengerSelector).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    console.log('All essential homepage elements are visible.');
  }

  /**
   * Select a destination from the destination input field.
   * @param {string} destination - The destination to select.
   * @throws Will throw an error if selection fails.
   */
  async selectDestination(destination) {
    try {
      console.log(`Selecting destination: ${destination}`);
      await this.destinationSelector.click();
      await this.destinationSelector.fill(destination);
      await this.page.waitForSelector('//div[@data-testid="destination-widget"]/div/div/div/ul/li/div[1]');
      
      const options = this.page.locator('//div[@data-testid="destination-widget"]/div/div/div/ul/li/div[1]');
      const optionCount = await options.count();

      for (let i = 0; i < optionCount; i++) {
        const optionText = await options.nth(i).textContent();

        if (optionText.trim().toLowerCase() === destination.toLowerCase()) {
          console.log(`Clicking option: ${optionText}`);
          await options.nth(i).hover();
          await options.nth(i).click({ force: true });
          console.log(`Successfully clicked on destination: ${destination}`);
          return; // Exit after successful selection
        }
      }
      console.warn(`Destination ${destination} not found in the options.`);
    } catch (error) {
      console.error(`Error selecting destination: ${error.message}`);
      throw error; // Fail the test if selection fails
    }
  }

  /**
   * Enter a predefined travel date range in the date selector.
   * @throws Will throw an error if entering the date fails.
   */
  async enterDate() {
    const travelPeriod = "01.11.2024 - 10.11.2024";
    console.log(`Entering travel period: ${travelPeriod}`);
    await this.dateSelector.click();
    await this.dateSelector.fill(travelPeriod);
    console.log(`Travel period entered: ${travelPeriod}`);
  }

  /**
   * Select a travel period given start and end dates.
   * @param {string} startDate - The start date of the travel period.
   * @param {string} endDate - The end date of the travel period.
   */
  async selectTravelPeriod(startDate, endDate) {
    console.log(`Selecting travel period from ${startDate} to ${endDate}`);
    await this.dateSelector.click();
    await this.selectTravelDateRange(startDate, endDate);
  }

  /**
   * Select a specific date range using utility function.
   * @param {string} startDate - The start date to select.
   * @param {string} endDate - The end date to select.
   */
  async selectTravelDateRange(startDate, endDate) {
    console.log(`Selecting date range: ${startDate} - ${endDate}`);
    await DateUtils.selectDateRange(this.page, startDate, endDate);
    console.log(`Date range selected: ${startDate} - ${endDate}`);
  }

  /**
   * Submit the form on the homepage.
   * @throws Will throw an error if submission fails.
   */
  async submit() {
    console.log("Submitting the form...");
    await this.submitButton.click();
    console.log("Form submitted.");
  
    // Wait briefly to allow time for the search results or message to load
    await this.page.waitForTimeout(2000);
  
    // Check for "0 Hotels" message or absence of hotel results
    const noResultsMessage = this.page.locator('text="0 Hotels"'); // Update with exact text if different
    const hotelResults = this.page.locator(this.searchResultsSelector); // Selector for hotel search results
    
    if (await noResultsMessage.isVisible()) {
      console.warn("No hotels found for the selected destination and date range.");
      return false; // Indicate no results found
    }
  
    if (await hotelResults.count() === 0) {
      console.warn("No hotel data available. Exiting without further actions.");
      return false; // Indicate no results found
    }
  
    console.log("Hotels found. Proceeding with further actions...");
    return true; // Indicate that results were found
  }
  /**
   * Click the forward arrow and takeover button.
   * @throws Will throw an error if clicking fails.
   */
  async clickForwardArrow() {
    console.log('Clicking forward arrow...');
    await this.iconArrowForward.click();
    await this.takeOverButton.click();
    console.log('Forward arrow and takeover button clicked.');
  }

  /**
   * Click the "Load More" button to load additional search results.
   * @throws Will throw an error if clicking fails.
   */
  async clickLoadMore() {
    console.log('Clicking "Load More" button...');
    await this.page.locator(this.loadMoreButtonSelector).click();
    console.log('"Load More" button clicked.');
  }

  /**
   * Click on a hotel from the search results based on the given index.
   * @param {number} index - The index of the hotel to find and click.
   * @throws Will throw an error if clicking fails.
   */
  async findHotel(index = 26) {
    console.log(`Finding hotel at index ${index}...`);
    await this.page.locator(this.searchResultsSelector).nth(index).click();
    console.log(`Hotel at index ${index} clicked.`);
  }

  /**
   * Click the first new result after loading more hotels.
   * @throws Will throw an error if clicking fails.
   */
  async clickFirstNewResultAfterLoadMore() {
    try {
      console.log(`Using selector: ${this.searchResultsSelector}`);
      await this.page.waitForSelector(this.searchResultsSelector);

      const initialResultsCount = await this.page.locator(this.searchResultsSelector).count();
      const isLoadMoreVisible = await this.page.locator(this.loadMoreButtonSelector).isVisible();

      if (isLoadMoreVisible) {
        console.log('"Load More" button is visible, clicking it...');
        await this.page.locator(this.loadMoreButtonSelector).click();
        await this.page.waitForTimeout(1000);

        await this.page.locator(this.searchResultsSelector).nth(initialResultsCount).click();
        console.log('Clicked on the first new result after loading more hotels.');
      } else {
        console.warn('"Load More" button is not visible or all results are already loaded.');
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      throw error;
    }
  }
}
