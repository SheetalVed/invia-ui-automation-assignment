import { Page } from "@playwright/test";
import { CookiesBotDialogPage } from "../pages/CookiesBotDialogPage";

export class BaseTestHelper {
  private page: Page;
  private cookiesDialog: CookiesBotDialogPage;

  constructor(page: Page) {
    this.page = page;
    this.cookiesDialog = new CookiesBotDialogPage(page);
  }

  /**
   * Get the base URL for the application based on the country code.
   * @returns {string} - The base URL to navigate to.
   */
  getBaseUrl(): string {
    const countryCode = process.env.COUNTRY_CODE || "DE"; // Default to 'DE' if not set
    return process.env[`URL_${countryCode}`] || "https://www.ab-in-den-urlaub.de/"; // Fallback to default if undefined
  }

  /**
   * Navigate to the base URL.
   * @throws Will throw an error if the navigation fails.
   */
  async navigateToSite(): Promise<void> {
    const baseUrl = this.getBaseUrl();
    console.log(`Navigating to URL: ${baseUrl}`);
    try {
      await this.page.goto(baseUrl);
      console.log("Navigation successful.");
    } catch (error) {
      console.error(`Failed to navigate to ${baseUrl}: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw error;
    }
  }

  /**
   * Handle the cookie consent dialog with the specified action.
   * @param action - Action to take on the cookie consent dialog.
   * @throws Will throw an error if handling the cookie consent fails.
   */
  async handleCookieConsent(action: "decline" | "allowSelection" | "allowAll"): Promise<void> {
    console.log("Handling cookie consent...");
    try {
      switch (action) {
        case "decline":
          await this.cookiesDialog.decline();
          console.log("Cookie consent declined successfully.");
          break;
        case "allowSelection":
          await this.cookiesDialog.allowSelection();
          console.log("Cookie consent selection allowed successfully.");
          break;
        case "allowAll":
          await this.cookiesDialog.allowAll();
          console.log("All cookie consent allowed successfully.");
          break;
        default:
          console.warn(`Unknown action: ${action}. No changes made to cookie consent.`);
          break;
      }
    } catch (error) {
      console.error("Error handling cookie consent:", error instanceof Error ? error.message : "Unknown error");
      throw error;
    }
  }
}
