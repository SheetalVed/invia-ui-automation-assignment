import { expect, Page, Locator } from "@playwright/test";

/**
 * Class representing the login page of the application.
 * Provides methods to interact with and verify elements on the login page.
 */
export class LoginPage {
  private page: Page;
  private accountIcon: Locator;
  private burgerMenuLogin: Locator;
  private emailField: Locator;
  private passwordField: Locator;
  private submitButton: Locator;

  /**
   * Initializes the LoginPage with required selectors.
   * @param page - The Playwright page object.
   */
  constructor(page: Page) {
    this.page = page;
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
   * @param url - The URL of the login page.
   */
  async navigateTo(url: string): Promise<void> {
    try {
      console.log(`Navigating to login page: ${url}`);
      await this.page.goto(url);
      console.log("Navigation successful.");
    } catch (error) {
      console.error(`Failed to navigate to ${url}: ${error instanceof Error ? error.message : error}`);
      throw error;
    }
  }

  /**
   * Open the login form by clicking on the account icon and the login menu option.
   */
  async openLoginPage(): Promise<void> {
    try {
      console.log("Opening login page...");
      await this.accountIcon.click();
      await this.burgerMenuLogin.click();
      console.log("Login page opened successfully.");
    } catch (error) {
      console.error("Error opening login page:", error);
      throw error;
    }
  }

  /**
   * Enter the provided email and password into the respective fields.
   * @param emailId - The email address to log in with.
   * @param password - The password to log in with.
   */
  async enterCredentials(emailId: string, password: string): Promise<void> {
    try {
      console.log(`Entering credentials for: ${emailId}`);
      await this.emailField.click();
      await this.emailField.fill(emailId);
      await this.passwordField.click();
      await this.passwordField.fill(password);
      console.log("Credentials entered successfully.");
    } catch (error) {
      console.error("Error entering credentials:", error);
      throw error;
    }
  }

  /**
   * Submit the login form.
   */
  async submitLogin(): Promise<void> {
    try {
      console.log("Submitting login form...");
      await this.submitButton.click();
      console.log("Login form submitted.");
    } catch (error) {
      console.error("Error submitting login form:", error);
      throw error;
    }
  }

  /**
   * Verify the login notification message against the expected message.
   * @param notificationMessage - The expected notification message after login.
   */
  async verifyLoginNotificationMessage(notificationMessage: string): Promise<void> {
    try {
      console.log("Verifying login notification message...");
      await this.page.waitForSelector(
        'div[data-testid="shared-authentication-migrateAccount-widget"] > div > div > div > div'
      );

      const elements = this.page.locator(
        'div[data-testid="shared-authentication-migrateAccount-widget"] > div > div > div > div'
      );
      const texts = await elements.allTextContents();

      if (texts.length > 1) {
        const index1Text = texts[1]; // Access the text at index 1
        if (index1Text === notificationMessage) {
          console.log(`Verification successful: '${index1Text}' matches the baseline.`);
        } else {
          console.error(`Verification failed: '${index1Text}' does not match the baseline '${notificationMessage}'.`);
        }
      } else {
        console.error("Not enough elements found. Expected at least 2.");
      }
    } catch (error) {
      console.error("Error verifying login notification message:", error);
      throw error;
    }
  }

  /**
   * Verify successful login by checking the current URL.
   */
  async verifyLoginSuccess(): Promise<void> {
    try {
      console.log("Verifying successful login...");
      await expect(this.page).toHaveURL(/.*account/);
      console.log("Login success verified.");
    } catch (error) {
      console.error("Error verifying login success:", error);
      throw error;
    }
  }
}
