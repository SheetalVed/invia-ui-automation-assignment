import { Page, Locator } from "@playwright/test";

/**
 * Class representing the offers page of the application.
 * Provides methods to interact with and verify elements on the offers page.
 */
export class OfferPage {
  private page: Page;
  private offersHeadline: Locator; 
  private bookOffer: Locator;
  private bookingDetails: Locator;

  /**
   * Initializes the OfferPage with required selectors.
   * @param page - The Playwright Page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.offersHeadline = this.page.getByTestId("find-offerlist-headline");
    this.bookOffer = this.page.getByTestId("find-offerlist-offerbox-cta");
    this.bookingDetails = this.page.locator("[data-testid='book-checkout-travelDetails-box']>div>div");
  }

  /**
   * Verify that the offers headline is visible on the page.
   * @returns {Promise<boolean>} - Returns true if the headline is visible, otherwise false.
   */
  async isOffersHeadlineVisible(): Promise<boolean> {
    try {
      await this.offersHeadline.waitFor({ state: 'visible', timeout: 5000 });
      console.log("Offers headline is visible.");
      return true; // Return true if the element is visible within the timeout
    } catch (error) {
      console.error("Offers headline is not visible within the timeout:", error);
      return false; // Return false if the element does not become visible in time
    }
  }

  /**
   * Clicks the booking button of the first offer.
   * @returns {Promise<void>}
   */
  async clickFirstBookOffer(): Promise<void> {
    try {
      const offerButtons = await this.bookOffer.all();
      
      if (offerButtons.length > 0) {
        const firstButton = offerButtons[0];
        if (await firstButton.isVisible()) {
          await firstButton.click(); // Click the first button
          console.log("Clicked the first book offer successfully.");
        } else {
          throw new Error("The first book offer button is not visible.");
        }
      } else {
        throw new Error("No booking offer buttons found.");
      }
    } catch (error) {
      console.error("Error clicking the first book offer:", error);
      throw error; // Re-throw error for further handling if needed
    }
  }

  /**
   * Retrieves the text content of the first booking detail element.
   * @returns {Promise<string>} - The text content of the booking detail.
   */
  async getBookingDetailText(): Promise<string> {
    try {
      const bookingText = this.bookingDetails.first();
      await bookingText.waitFor({ state: 'visible', timeout: 5000 }); // Wait for the booking detail to be visible

      if (await bookingText.isVisible()) {
        const text = await bookingText.textContent();
        return text ? text : ""; // Return the text content, or an empty string if null
      } else {
        throw new Error("The first booking detail element is not visible.");
      }
    } catch (error) {
      console.error("Error retrieving booking detail text:", error);
      throw error; // Re-throw error for further handling if needed
    }
  }
}
