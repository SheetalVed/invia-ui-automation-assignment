import { expect, Page, Locator } from "@playwright/test";
import { DateUtils } from "../utils/dateUtils";

/**
 * Class representing the homepage of the application.
 * Provides methods to interact with and verify elements on the homepage.
 */
export class HomePage {
  private page: Page;
  private destinationSelector: Locator;
  private airportSelector: Locator;
  private dateSelector: Locator;
  private transportationSelector: Locator;
  private passengerSelector: Locator;
  private loginButton: Locator;
  private submitButton: Locator;
  private loadMoreButtonSelector: string;
  private searchResultsSelector: string;
  private findOfferButton: Locator;

  /**
   * Initializes the HomePage with the necessary page locators.
   * @param page - The Playwright Page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.destinationSelector = page.getByTestId("destination-field");
    this.airportSelector = page.getByTestId("airports-field");
    this.dateSelector = page.getByTestId("travel-period-field");
    this.transportationSelector = page.getByTestId("travellers-field-multiroom");
    this.passengerSelector = page.getByTestId("travellers-field-multiroom");
    this.loginButton = page.getByTestId("IconAccountCircle");
    this.submitButton = page.getByTestId("submit");
    this.loadMoreButtonSelector = 'button[data-testid="find-hotellist-loadMoreButton"]';
    this.searchResultsSelector = 'a[data-testid="find-hotellist-hotelbox-cta"]';
    this.findOfferButton = page.getByTestId("find-offerlist-offerbox-cta");
  }

  /**
   * Getter for the page property.
   * @returns The Playwright page instance.
   */
  public getPage(): Page {
    return this.page;
  }

  public getDestinationSelector(): Locator {
    return this.destinationSelector;
  }

  public getsubmitButtonSelector(): Locator {
    return this.submitButton;
  }

  /**
   * Navigate to a specified URL.
   * @param url - The URL to navigate to.
   */
  async navigateTo(url: string): Promise<void> {
    try {
      console.log(`Navigating to URL: ${url}`);
      await this.page.goto(url);
      console.log(`Successfully navigated to ${url}`);
    } catch (error) {
      console.error(`Failed to navigate to ${url}: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Verify essential elements on the homepage are visible.
   * Throws an error if any element is not visible.
   */
  async verifyHomePageElements(): Promise<void> {
    try {
      console.log("Verifying homepage elements...");
      await expect(this.destinationSelector).toBeVisible();
      await expect(this.airportSelector).toBeVisible();
      await expect(this.dateSelector).toBeVisible();
      await expect(this.transportationSelector).toBeVisible();
      await expect(this.passengerSelector).toBeVisible();
      await expect(this.loginButton).toBeVisible();
      console.log("All essential homepage elements are visible.");
    } catch (error) {
      console.error("Error verifying homepage elements:", error);
      throw error;
    }
  }

  /**
   * Select a destination from the destination input field.
   * @param destination - The destination to select.
   */
  async selectDestination(destination: string): Promise<void> {
    try {
      console.log(`Selecting destination: ${destination}`);
      await this.destinationSelector.click();
      await this.destinationSelector.fill(destination);
      await this.page.waitForSelector('//div[@data-testid="destination-widget"]/div/div/div/ul/li/div[1]');
  
      const options = this.page.locator('//div[@data-testid="destination-widget"]/div/div/div/ul/li/div[1]');
      const optionCount = await options.count();
  
      for (let i = 0; i < optionCount; i++) {
        const optionText = await options.nth(i).textContent();
  
        if (optionText?.trim().toLowerCase() === destination.toLowerCase()) {
          console.log(`Clicking option: ${optionText}`);
          await options.nth(i).hover();
          await options.nth(i).click({ force: true });
          console.log(`Successfully clicked on destination: ${destination}`);
          return;
        }
      }
      console.warn(`Destination ${destination} not found in the options.`);
    } catch (error) {
      console.error(`Error selecting destination: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Select a travel period given start and end dates.
   * @param startDate - The start date of the travel period.
   * @param endDate - The end date of the travel period.
   */
  async selectTravelPeriod(startDate: string, endDate: string): Promise<void> {
    try {
      console.log(`Selecting travel period from ${startDate} to ${endDate}`);
      await this.dateSelector.click();
      await this.selectTravelDateRange(startDate, endDate);
    } catch (error) {
      console.error("Error selecting travel period:", error);
      throw error;
    }
  }

  /**
   * Select a specific date range using a utility function.
   * @param startDate - The start date to select.
   * @param endDate - The end date to select.
   */
  async selectTravelDateRange(startDate: string, endDate: string): Promise<void> {
    try {
      console.log(`Selecting date range: ${startDate} - ${endDate}`);
      await DateUtils.selectDateRange(this.page, startDate, endDate);
      console.log(`Date range selected: ${startDate} - ${endDate}`);
    } catch (error) {
      console.error("Error selecting date range:", error);
      throw error;
    }
  }

  /**
   * Submit the form on the homepage.
   * Returns a boolean indicating if results were found.
   */
  async submit(): Promise<boolean> {
    try {
      console.log("Submitting the form...");
      await this.submitButton.click();
      console.log("Form submitted.");

      // Wait for results to load
      await this.page.waitForTimeout(5000);

      const noResultsMessage = this.page.locator('text="0 Hotels"');
      const hotelResults = this.page.locator(this.searchResultsSelector);

      if (await noResultsMessage.isVisible()) {
        console.warn("No hotels found for the selected destination and date range.");
        return false;
      }

      if (await hotelResults.count() === 0) {
        console.warn("No hotel data available. Exiting without further actions.");
        return false;
      }

      console.log("Hotels found. Proceeding with further actions...");
      return true;
    } catch (error) {
      console.error("Error during form submission:", error);
      throw error;
    }
  }

  /**
   * Click the "Load More" button to load additional search results.
   */
  async clickLoadMore(): Promise<void> {
    try {
      console.log('Clicking "Load More" button...');
      await this.page.locator(this.loadMoreButtonSelector).click();
      console.log('"Load More" button clicked.');
    } catch (error) {
      console.error("Error clicking 'Load More' button:", error);
      throw error;
    }
  }

  /**
   * Click on a hotel from the search results based on the given index.
   * @param index - The index of the hotel to find and click.
   */
  async findHotel(index = 26): Promise<void> {
    try {
      console.log(`Finding hotel at index ${index}...`);
      await this.page.locator(this.searchResultsSelector).nth(index).click();
      console.log(`Hotel at index ${index} clicked.`);
    } catch (error) {
      console.error(`Error finding hotel at index ${index}:`, error);
      throw error;
    }
  }

  /**
   * Click the first new result after loading more hotels.
   */
  async clickFirstNewResultAfterLoadMore(): Promise<void> {
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
        console.log("Clicked on the first new result after loading more hotels.");
      } else {
        console.warn('"Load More" button is not visible or all results are already loaded.');
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      throw error;
    }
  }
}
