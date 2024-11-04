// utils/BaseTestHelper.js
import { CookiesBotDialogPage } from '../pages/CookiesBotDialogPage';

export class BaseTestHelper {
  constructor(page) {
    this.page = page;
    this.cookiesDialog = new CookiesBotDialogPage(page);
  }

  /**
   * Get the base URL for the application based on the country code.
   * @returns {string} The base URL to navigate to.
   */
  getBaseUrl() {
    const countryCode = process.env.COUNTRY_CODE || 'DE'; // Default to 'DE' if not set
    return process.env[`URL_${countryCode}`] || 'https://www.ab-in-den-urlaub.de/'; // Fallback to default if undefined
  }

  /**
   * Navigate to the base URL.
   */
  async navigateToSite() {
    const baseUrl = this.getBaseUrl();
    console.log(`Navigating to URL: ${baseUrl}`);
    try {
      await this.page.goto(baseUrl);
    } catch (error) {
      console.error(`Failed to navigate to ${baseUrl}: ${error.message}`);
      throw error; // Rethrow the error to handle it in the calling test
    }
  }

  /**
   * Handle the cookie consent dialog by declining all cookies.
   */
  async handleCookieConsent(action) {
    console.log("Handling cookie consent...");
    try {
      switch (action) {
        case 'decline':
          await this.cookiesDialog.decline();
          console.log("Cookie consent declined successfully.");
          break;
        case 'allowSelection':
          await this.cookiesDialog.allowSelection();
          console.log("Cookie consent selection allowed successfully.");
          break;
        case 'allowAll':
          await this.cookiesDialog.allowAll();
          console.log("All cookie consent allowed successfully.");
          break;
        default:
          console.warn(`Unknown action: ${action}. No changes made to cookie consent.`);
          break;
      }
    } catch (error) {
      console.error("Error handling cookie consent:", error.message);
      throw error; // Rethrow to handle in calling test if needed
    }
  }
}
