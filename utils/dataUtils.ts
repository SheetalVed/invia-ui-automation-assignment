import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Define types for data returned by JSON files
interface SearchData {
  [key: string]: any; // Adjust based on the actual structure in `searchData.json`
}

interface LoginData {
  [key: string]: any; // Adjust based on the actual structure in `loginData.json`
}

/**
 * Load search data from a JSON file.
 * @returns {SearchData} - Parsed search data as a JSON object.
 * @throws Will throw an error if the data loading fails.
 */
export function loadSearchData(): SearchData {
  try {
    const filePath = path.join(__dirname, "../fixtures/searchData.json");
    const data = fs.readFileSync(filePath, "utf8");
    console.log("Search data loaded successfully.");
    return JSON.parse(data) as SearchData;
  } catch (error) {
    console.error(`Error loading search data: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error; // Rethrow the error for handling upstream
  }
}

/**
 * Load login data from a JSON file.
 * @returns {LoginData} - Parsed login data as a JSON object.
 * @throws Will throw an error if the data loading fails.
 */
export function loadLoginData(): LoginData {
  try {
    const filePath = path.join(__dirname, "../fixtures/loginData.json");
    const data = fs.readFileSync(filePath, "utf8");
    console.log("Login data loaded successfully.");
    return JSON.parse(data) as LoginData;
  } catch (error) {
    console.error(`Error loading login data: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error; // Rethrow the error for handling upstream
  }
}

/**
 * Get URL based on the country code from environment variables.
 * @param {string} countryCode - The country code to get the URL for.
 * @returns {string} - The URL associated with the specified country code.
 * @throws Will throw an error if the country code is not configured.
 */
export function getUrlByCountry(countryCode: string): string {
  const url = process.env[`URL_${countryCode}`];
  if (!url) {
    throw new Error(`No URL configured for country code: ${countryCode}`);
  }
  console.log(`URL retrieved for country code ${countryCode}: ${url}`);
  return url;
}
