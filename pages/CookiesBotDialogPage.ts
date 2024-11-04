import { Page, Locator } from "@playwright/test";

export class CookiesBotDialogPage {
  private page: Page;
  private declineButton: Locator;
  private allowSelectionButton: Locator;
  private allowAllButton: Locator;

  /**
   * Initializes the CookiesBotDialogPage with necessary locators for cookie consent options.
   * @param page - The Playwright page instance.
   */
  constructor(page: Page) {
    this.page = page;
    this.declineButton = page.locator('#CybotCookiebotDialogBodyButtonDecline');
    this.allowSelectionButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection');
    this.allowAllButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  }

  /**
   * Declines all cookies by clicking the "Decline" button in the cookie consent dialog.
   * Logs the action and handles any potential errors.
   */
  async decline(): Promise<void> {
    try {
      console.log("Attempting to decline cookies...");
      await this.declineButton.click();
      console.log("Cookies successfully declined.");
    } catch (error) {
      console.error("Error declining cookies:", error);
      throw new Error("Failed to decline cookies.");
    }
  }

  /**
   * Allows only selected cookies by clicking the "Allow Selection" button.
   * Logs the action and handles any potential errors.
   */
  async allowSelection(): Promise<void> {
    try {
      console.log("Attempting to allow selected cookies...");
      await this.allowSelectionButton.click();
      console.log("Selected cookies allowed.");
    } catch (error) {
      console.error("Error allowing selected cookies:", error);
      throw new Error("Failed to allow selected cookies.");
    }
  }

  /**
   * Allows all cookies by clicking the "Allow All" button.
   * Logs the action and handles any potential errors.
   */
  async allowAll(): Promise<void> {
    try {
      console.log("Attempting to allow all cookies...");
      await this.allowAllButton.click();
      console.log("All cookies allowed.");
    } catch (error) {
      console.error("Error allowing all cookies:", error);
      throw new Error("Failed to allow all cookies.");
    }
  }
}
