$env:COUNTRY_CODE = "CH"; npx playwright test tests/login.test.js --project=chromium --headed    

$env:COUNTRY_CODE = "CH"; npx playwright test --project=chromium --headed --workers=1

npx playwright test --project=chromium --headed --workers=1