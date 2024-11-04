// utils/DateUtils.js
export class DateUtils {
  /**
   * Selects a date range from the calendar by navigating to the specified start and end month and year.
   * @param {import('@playwright/test').Page} page - The Playwright page object.
   * @param {string} startDateInput - Start date in DD.MM.YYYY format (e.g., "02.11.2024").
   * @param {string} endDateInput - End date in DD.MM.YYYY format (e.g., "15.11.2024").
   */
  static async selectDateRange(page, startDateInput, endDateInput) {
    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const [startDay, startMonth, startYear] = startDateInput.split('.');
    const [endDay, endMonth, endYear] = endDateInput.split('.');

    const startFormattedDate = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
    const endFormattedDate = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;

    // Define target start and end month-year for comparison
    const targetStartMonthYear = `${monthNames[Number(startMonth) - 1]} ${startYear}`;
    const targetEndMonthYear = `${monthNames[Number(endMonth) - 1]} ${endYear}`;

    // Wait for the calendar to appear
    await page.waitForSelector('.css-mk9c0l.eq2dyh00');

    // Start index for the month displayed as "current" (Juni 2025 at index 7)
    let currentIndex = 7;

    // Function to update the visible month text at the adjusted index
    const updateCurrentMonthYear = async () => {
      return await page.locator('.css-mk9c0l.eq2dyh00').nth(currentIndex).textContent();
    };

    // Function to navigate to the specified month and year
    const navigateToMonthYear = async (targetMonthYear) => {
      let currentMonthYear = await updateCurrentMonthYear();

      // Loop until we find the target month in the displayed index
      while (!currentMonthYear.includes(targetMonthYear)) {
        const [currentMonthName, currentYear] = currentMonthYear.split(' ');
        const currentDate = new Date(`${currentYear}-${monthNames.indexOf(currentMonthName) + 1}-01`);
        const targetDate = new Date(`${targetMonthYear.split(' ')[1]}-${monthNames.indexOf(targetMonthYear.split(' ')[0]) + 1}-01`);

        if (targetDate < currentDate) {
          // Navigate left if target is earlier
          await page.getByTestId('IconChevronLeft').click();
          currentIndex -= 1; // Move index to left
        } else {
          // Navigate right if target is later
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
  }
}
