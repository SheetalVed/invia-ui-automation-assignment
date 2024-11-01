// tests/homePage.test.js
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import {CookiesBotDialogPage} from '../pages/CookiesBotDialogPage'

test('test', async ({ page }) => {
  const homePage = new HomePage(page);
  const cookiesBotDialogPage = new CookiesBotDialogPage(page);

  // Navigate to the homepage
  await homePage.navigateTo('https://www.ab-in-den-urlaub.de/');

  // Handle cookie consent
  await cookiesBotDialogPage.decline();

  // Select a destination
  await homePage.selectDestination('kreta');

  //await homePage.enterDate();

  // Select the travel period
  await homePage.selectTravelPeriod('02.11.2024', '15.11.2024');

  // Optionally, you can submit the form
  await homePage.submit();
  
  // Optionally, pause for debugging
  await page.pause();
});
