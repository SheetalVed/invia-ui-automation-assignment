// pages/LoginPage.js
import { expect } from '@playwright/test';

export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Define selectors for elements on the login page
    this.accountIcon = page.getByTestId('IconAccountCircle');
    this.burgerMenuLogin = page.getByTestId('shared-header-headercontrol-burgermenu').getByText('Anmelden');
    this.emailField = page.getByTestId('shared-authentication-signinWidget-emailAddress-textfield');
    this.passwordField = page.getByTestId('shared-authentication-signinWidget-currentPassword-textfield');
    this.submitButton = page.getByTestId('shared-authentication-signinWidget-submit-button');
    
  }

  // Method to navigate to the login page URL
  async navigateTo(url) {
    await this.page.goto(url);
  }

  // Method to open the login form (clicks on account icon and "Anmelden" menu option)
  async openLoginPage() {
    await this.accountIcon.click();
    await this.burgerMenuLogin.click();
  }

  // Method to enter login credentials
  async enterCredentials(email, password) {
    await this.emailField.click();
    await this.emailField.fill(email);
    await this.passwordField.click();
    await this.passwordField.fill(password);
  }

  // Method to submit the login form
  async submitLogin() {
    await this.submitButton.click();
  }

  async verifyLoginFailure() {
    await expect(this.errorMessage).toBeVisible();
  }

  async verifyLoginSuccess() {
    // Add a check based on what indicates a successful login (e.g., a specific URL or element on the page)
    await expect(this.page).toHaveURL(/.*account/);
  }
}
