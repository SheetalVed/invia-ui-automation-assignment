import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

/**
 * Maps country codes to their corresponding URLs based on environment variables.
 */
const urls: Record<string, string> = {
  DE: process.env.URL_DE || 'https://default-url-for-de.com', // Default URL for Germany
  AT: process.env.URL_AT || 'https://default-url-for-at.com', // Default URL for Austria
  CH: process.env.URL_CH || 'https://default-url-for-ch.com', // Default URL for Switzerland
};

/**
 * Retrieves the country code from command-line arguments or environment variables.
 * Defaults to 'DE' if not specified.
 */
const countryCode = process.argv[2] || process.env.DEFAULT_COUNTRY || 'DE';

/**
 * Gets the base URL based on the provided country code.
 * Fallbacks to the URL for Germany if the provided code is invalid.
 */
let baseUrl: string;

try {
  baseUrl = urls[countryCode] || urls['DE']; // Fallback to 'DE' if the code is invalid
  console.log(`Using base URL: ${baseUrl}`);
} catch (error) {
  console.error(`Error determining base URL: ${error instanceof Error ? error.message : "Unknown error"}`);
  throw error; // Rethrow the error to ensure that the configuration fails
}

export default defineConfig({
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
