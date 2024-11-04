import { Page } from "@playwright/test";

export class DateUtils {
  /**
   * Selects a date range from the calendar by navigating to the specified start and end month and year.
   * @param page - The Playwright page object used for browser interactions.
   * @param startDateInput - Start date in DD.MM.YYYY format (e.g., "02.11.2024").
   * @param endDateInput - End date in DD.MM.YYYY format (e.g., "15.11.2024").
   * @throws Will throw an error if unable to select the date range.
   */
  static async selectDateRange(page: Page, startDateInput: string, endDateInput: string): Promise<void> {
    const monthNames = [
      "Januar", "Februar", "März", "April", "Mai", "Juni",
      "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];

    const [startDay, startMonth, startYear] = startDateInput.split(".");
    const [endDay, endMonth, endYear] = endDateInput.split(".");

    const startFormattedDate = `${startYear}-${startMonth.padStart(2, "0")}-${startDay.padStart(2, "0")}`;
    const endFormattedDate = `${endYear}-${endMonth.padStart(2, "0")}-${endDay.padStart(2, "0")}`;

    const targetStartMonthYear = `${monthNames[Number(startMonth) - 1]} ${startYear}`;
    const targetEndMonthYear = `${monthNames[Number(endMonth) - 1]} ${endYear}`;

    try {
      // Wait for the calendar to appear
      await page.waitForSelector(".css-mk9c0l.eq2dyh00");

      // Start index for the month displayed as "current" (e.g., Juni 2025 at index 7)
      let currentIndex = 7;

      // Function to update the visible month text at the adjusted index
      const updateCurrentMonthYear = async (): Promise<string | null> => {
        return await page.locator(".css-mk9c0l.eq2dyh00").nth(currentIndex).textContent();
      };

      // Function to navigate to the specified month and year
      const navigateToMonthYear = async (targetMonthYear: string): Promise<void> => {
        let currentMonthYear = await updateCurrentMonthYear();

        // Loop until we find the target month in the displayed index
        while (currentMonthYear && !currentMonthYear.includes(targetMonthYear)) {
          const [currentMonthName, currentYear] = currentMonthYear.split(" ");
          const currentDate = new Date(`${currentYear}-${monthNames.indexOf(currentMonthName) + 1}-01`);
          const [targetMonthName, targetYear] = targetMonthYear.split(" ");
          const targetDate = new Date(`${targetYear}-${monthNames.indexOf(targetMonthName) + 1}-01`);

          if (targetDate < currentDate) {
            await page.getByTestId("IconChevronLeft").click();
            currentIndex -= 1; // Move index to left
          } else {
            await page.locator("div:nth-child(2) > .e1o0070i0>svg[data-testid='IconChevronRight']").click();
            currentIndex += 1; // Move index to right
          }

          // Wait for calendar to update and refresh current month/year
          await page.waitForTimeout(500);
          currentMonthYear = await updateCurrentMonthYear();
        }
      };

      // Navigate to start date month and select the day
      await navigateToMonthYear(targetStartMonthYear);
      await page.locator(`button[data-date='${startFormattedDate}']`).click();

      // Navigate to end date month if it’s different and select the day
      if (targetStartMonthYear !== targetEndMonthYear) {
        await navigateToMonthYear(targetEndMonthYear);
      }
      await page.locator(`button[data-date='${endFormattedDate}']`).click();
      console.log(`Successfully selected date range: ${startDateInput} to ${endDateInput}`);
      
    } catch (error) {
      console.error(`Error selecting date range: ${error instanceof Error ? error.message : "Unknown error"}`);
      throw error; // Rethrow the error for further handling
    }
  }
}
