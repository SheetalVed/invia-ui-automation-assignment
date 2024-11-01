import { expect } from "@playwright/test";
import { DateUtils } from "../utils/DateUtils.js";

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
    // Click on the destination field to activate it
    await this.destinationSelector.click();
    // Type the destination name
    await this.destinationSelector.fill(destination);

    await this.page.pause();

    // await this.page
    //   .getByRole("option", { name: "kreta" })
    //   .getByRole("mark")
    //   .click({ force: true });
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
}
