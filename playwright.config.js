// playwright.config.js

const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config(); // Load .env file

// Map URLs based on environment variables
const urls = {
  DE: process.env.URL_DE,
  AT: process.env.URL_AT,
  CH: process.env.URL_CH,
};

// Get the country code from command-line arguments, defaulting to the value in .env
const countryCode = process.argv[2] || process.env.DEFAULT_COUNTRY || 'DE';

// Check if the provided country code is valid and set the base URL
const baseUrl = urls[countryCode] || urls['DE']; // Fallback to 'DE' if the code is invalid

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Set baseURL dynamically based on the command-line argument
    baseURL: baseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
