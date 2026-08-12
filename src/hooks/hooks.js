import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { request as playwrightRequest } from '@playwright/test';
import config from '../utility/Config.js';
import { launchBrowser, closeBrowser } from '../utility/browser/BrowserManager.js';

setDefaultTimeout(60 * 1000);

Before(async function (scenario) {
  const isApi = scenario.pickle.tags.some(tag => tag.name === '@api');
  const isUi = scenario.pickle.tags.some(tag => tag.name === '@ui');

  // Initialize API context if tagged @api OR as safe default
  if (isApi || !isUi) {
    this.request = await playwrightRequest.newContext({
      baseURL: config.apiBaseUrl
    });
  }

  // Initialize UI context if tagged @ui
  if (isUi) {
    const browserObj = await launchBrowser();
    this.page = browserObj.page;
  }
});

After(async function (scenario) {
  // Capture UI screenshot on failure
  if (scenario.result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({
      path: `test-results/screenshots/${scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_')}.png`,
      fullPage: true
    });
    await this.attach(screenshot, 'image/png');
  }

  // Clean up UI context
  if (this.page) {
    await closeBrowser(this.page);
  }

  // Clean up API context
  if (this.request) {
    await this.request.dispose();
  }
});