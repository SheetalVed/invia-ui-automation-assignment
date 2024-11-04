# Automation QA Engineer Assignment

This project is designed to ensure the quality and functionality of the **ab-in-denurlaub.de** website through automated testing, enabling efficient verification of its features across different regional domains, including **ab-in-den-urlaub.at** and **ab-in-denurlaub.ch**. The test suite uses Playwright to automate the verification of key functionalities of the website.

## Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [Running the Tests](#running-the-tests)
- [Directory Structure](#Directory-Structure)
- [Error Handling, Logging, and Reporting](#error-handling-logging-and-reporting)

## Project Overview

This project uses Playwright for UI automation with TypeScript. The tests cover essential functionalities such as homepage verification, login attempts, destination selection, and offer selection.

## Objectives

The automated tests cover the following functionalities:

1. **Basic functionalities check on the homepage**: Verify the presence of essential elements including selectors for destination, date, transportation, and passenger, as well as the login button.
2. **Login functionality**: Test the login process using incorrect credentials, ensuring that the user receives a notification or error message.
3. **Destination and date selection**: Input a test destination and select travel dates using the date picker.
4. **Offer selection**: Navigate through search results and select an offer.
5. **Offer page**: Confirm that the offer details load correctly.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/get-npm)

## Setup and Installation

Follow these steps to set up and run the project locally:

1. **Install Dependencies**
```bash
npm install
```

2. **Install Playwright Browsers**
```bash
npx playwright install
```

## Configuration

1. **Create a .env File**

In the root directory of the project, create a .env file and add the following environment variable:

```bash
URL_DE=https://www.ab-in-denurlaub.de
URL_AT=https://www.ab-in-den-urlaub.at
URL_CH=https://www.ab-in-denurlaub.ch
DEFAULT_COUNTRY=DE
```

2. **Update Test Data**

Ensure any required JSON files for test data are correctly placed in the fixtures directory.
Here’s an example of the searchData.json file structure:

```bash
searchData.json
{
    "destination":"kreta",
    "travelPeriodFrom":"06.11.2024",
    "travelPeriodTo":"15.11.2024"
}
```

## Running the Tests

To execute the test suite 

🔹To run the tests on the **DE** domain using the Chrome browser in headed mode (for visibility during execution) and ensure that they run serially (one at a time), use the following command:

```bash
$env:COUNTRY_CODE = "DE"; npx playwright test tests --project=chromium --headed --workers=1
```

Or, you can run it using the npm script:
```
npm run test:headed:de
```

🔹To run the tests on the **AT** domain using the Chrome browser in headed mode (for visibility during execution) and ensure that they run serially (one at a time), use the following command:

```bash
$env:COUNTRY_CODE = "AT"; npx playwright test tests --project=chromium --headed --workers=1
```

Or, you can run it using the npm script:
```
npm run test:headed:at
```

🔹To run the tests on the **CH** domain using the Chrome browser in headed mode (for visibility during execution) and ensure that they run serially (one at a time), use the following command:

```bash
$env:COUNTRY_CODE = "CH"; npx playwright test tests --project=chromium --headed --workers=1
```

Or, you can run it using the npm script:
```
npm run test:headed:ch
```


# Directory Structure

The following is the directory structure of the project:

```bash
📦 Project Root
 ┣ 📂 tests
 ┃ ┣ 📄 homepageTests.spec.ts            # Test file for homepage functionality
 ┃ ┣ 📄 loginTests.spec.ts               # Test file for login functionality
 ┃ ┗ 📄 destinationTests.spec.ts         # Test file for destination selection functionality
 ┣ 📂 pages
 ┃ ┣ 📄 HomePage.ts                      # Page object model for the homepage
 ┃ ┣ 📄 LoginPage.ts                     # Page object model for the login page
 ┃ ┣ 📄 OfferPage.ts                     # Page object model for the offer page
 ┃ ┗ 📄 CookiesBotDialogPage.ts          # Page object model for consent page
 ┣ 📂 utils
 ┃ ┣ 📄 baseTestHelper.ts                # Functions for essential browser setup and navigation.
 ┃ ┣ 📄 dataUtils.ts                     # Functions for loading test data
 ┃ ┗ 📄 dateUtils.ts                     # Functions for date manipulations
 ┣ 📂 fixtures
 ┃ ┣ 📄 loginData.json                   # JSON file containing test data for loginTests
 ┃ ┗ 📄 searchData.json                  # JSON file containing test data for destinationTests
 ┣ 📄 .env                               # File for environment variables
 ┣ 📄 playwright.config.ts                # Playwright configuration file for setting the base URL.
 ┗ 📄 README.md                          # Documentation for the project            
```

## Error Handling, Logging, and Reporting

### Error Handling

#### Each function includes try-catch blocks to handle and log errors.
Error messages and stack traces are logged to provide insights into issues.

### Logging
Logs are added at key points in the test execution and utility functions to trace the flow and identify issues.

### Reporting

- **Test Reports**: Automated test reports are generated to summarize test execution results. These reports include:
  - **Test Outcomes**: Information on which tests passed, failed, or were skipped.
  - **Error Details**: Specifics on any errors encountered during test execution.
  - **Execution Time**: Metrics on the duration of test runs.

- **Viewing Reports**: Test reports can be viewed by running the following command:
  ```bash
  npx playwright show-report
  ```

  ## Troubleshooting

If you encounter issues while setting up or running the tests, consider the following tips:

- **Environment Variables**: Ensure all environment variables in the `.env` file are correctly set. Missing or incorrect URLs can lead to failed tests.
- **JSON File Formatting**: Verify that the required JSON files (e.g., `loginData.json`, `searchData.json`) are correctly formatted and placed in the `fixtures` directory.
- **Test Failures**: If a test fails, check the error logs for specific details. Common issues include incorrect selectors or unavailable elements on the page.
- **Browser Installation**: Make sure the Playwright browsers are installed properly by running `npx playwright install`.
- **Network Issues**: If your tests involve network requests, ensure that your network is stable and the target URLs are accessible.

For further assistance, refer to the [Playwright documentation](https://playwright.dev/docs/intro) or check community forums.




