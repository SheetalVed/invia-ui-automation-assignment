// tests/multiSiteHomepageElements.test.js
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CookiesBotDialogPage } from '../pages/CookiesBotDialogPage';

test.describe('Multi-Site Homepage Essential Elements Check', () => {
  // URLs for each site’s homepage
  const siteUrls = [
    'https://www.ab-in-den-urlaub.de/',
    'https://www.ab-in-den-urlaub.at/',
    'https://www.ab-in-den-urlaub.ch/',
  ];

  siteUrls.forEach((url) => {
    test(`Verify essential elements on homepage: ${url}`, async ({ page }) => {
      const homePage = new HomePage(page);
      const cookiesDialog = new CookiesBotDialogPage(page);

      // Navigate to each site’s homepage
      await homePage.navigateTo(url);

      // Handle cookie consent (decline or allow)
      await cookiesDialog.decline();

      // Verify the presence of essential elements
      await homePage.verifyHomePageElements();
    });
  });
});
