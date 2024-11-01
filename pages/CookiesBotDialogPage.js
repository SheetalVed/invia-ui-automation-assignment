export class CookiesBotDialogPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
      this.page = page;
      this.declineButton = page.locator('#CybotCookiebotDialogBodyButtonDecline');
      this.allowSelectionButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection');
      this.allowAllButton = page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    }
  
    async decline() {
      await this.declineButton.click();
    }
  
    async allowSelection() {
      await this.allowSelectionButton.click();
    }
  
    async allowAll() {
      await this.allowAllButton.click();
    }
  }
  