// pages/LoginPage.js
import { expect } from "@playwright/test";

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page - The Playwright page object
   */
  constructor(page) {
    this.page = page;

    // Define selectors for elements on the login page
    this.accountIcon = page.getByTestId("IconAccountCircle");
    this.burgerMenuLogin = page
      .getByTestId("shared-header-headercontrol-burgermenu")
      .getByText("Anmelden");
    this.emailField = page.getByTestId(
      "shared-authentication-signinWidget-emailAddress-textfield"
    );
    this.passwordField = page.getByTestId(
      "shared-authentication-signinWidget-currentPassword-textfield"
    );
    this.submitButton = page.getByTestId(
      "shared-authentication-signinWidget-submit-button"
    );
  }

  /**
   * Navigate to the specified login page URL.
   * @param {string} url - The URL of the login page.
   */
  async navigateTo(url) {
    console.log(`Navigating to login page: ${url}`);
    await this.page.goto(url);
  }

  /**
   * Open the login form by clicking on the account icon and the login menu option.
   */
  async openLoginPage() {
    console.log("Opening login page...");
    await this.accountIcon.click();
    await this.burgerMenuLogin.click();
    console.log("Login page opened successfully.");
  }

  /**
   * Enter the provided email and password into the respective fields.
   * @param {string} emailId - The email address to log in with.
   * @param {string} password - The password to log in with.
   */
  async enterCredentials(emailId, password) {
    console.log(`Entering credentials for: ${emailId}`);
    await this.emailField.click();
    await this.emailField.fill(emailId);
    await this.passwordField.click();
    await this.passwordField.fill(password);
    console.log("Credentials entered successfully.");
  }

  /**
   * Submit the login form.
   */
  async submitLogin() {
    console.log("Submitting login form...");
    await this.submitButton.click();
    console.log("Login form submitted.");
  }

  /**
   * Verify the login notification message against the expected message.
   * @param {string} notificationMessage - The expected notification message after login.
   */
  async verifyLoginNotificationMessage(notificationMessage) {
    console.log("Verifying login notification message...");
    const elements = this.page.locator(
      'div[data-testid="shared-authentication-migrateAccount-widget"] > div > div > div > div'
    );
    const texts = await elements.allTextContents();

    console.log("Retrieved notification messages:", texts);

    if (texts.length > 2) {
      const index2Text = texts[1]; // Access the text at index 2
      if (index2Text === notificationMessage) {
        console.log(
          `Verification successful: '${index2Text}' matches the baseline.`
        );
      } else {
        console.error(
          `Verification failed: '${index2Text}' does not match the baseline.`
        );
      }
    } else {
      console.error("Not enough elements found. Expected at least 3.");
    }
  }

  /**
   * Verify successful login by checking the current URL.
   */
  async verifyLoginSuccess() {
    console.log("Verifying successful login...");
    await expect(this.page).toHaveURL(/.*account/);
    console.log("Login success verified.");
  }
}
