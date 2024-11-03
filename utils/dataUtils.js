// dataUtils.js
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Load test data from the JSON file
export function loadSearchData() {
  try {
    const filePath = path.join(__dirname, '../fixtures/searchData.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading search data: ${error.message}`);
    throw error;
  }
}

// Function to get URL based on environment
export function getUrlByCountry(countryCode) {
  switch (countryCode) {
    case 'DE':
      return process.env.URL_DE;
    case 'AT':
      return process.env.URL_AT;
    case 'CH':
      return process.env.URL_CH;
    default:
      throw new Error(`No URL configured for country code: ${countryCode}`);
  }
}
