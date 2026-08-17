import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { request as playwrightRequest } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import config from '../utility/Config.js';
import { launchBrowser, closeBrowser } from '../utility/browser/BrowserManager.js';

setDefaultTimeout(60 * 1000);

const SCREENSHOT_DIR = path.join('test-results', 'screenshots');

function safeFileName(value) {
  return value
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'scenario';
}

async function captureScenarioScreenshot(world, scenario) {
  if (!world.page || world.page.isClosed()) {
    return;
  }

  await mkdir(SCREENSHOT_DIR, { recursive: true });

  const scenarioName = safeFileName(scenario.pickle.name);
  const status = scenario.result?.status ?? Status.UNKNOWN;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const screenshotPath = path.join(
    SCREENSHOT_DIR,
    `${scenarioName}_${status.toLowerCase()}_${timestamp}.png`
  );

  const screenshot = await world.page.screenshot({
    path: screenshotPath,
    fullPage: true
  });

  await world.attach(screenshot, 'image/png');
}

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
  // Capture UI screenshot for every executed UI scenario before teardown.
  if (this.page) {
    try {
      await captureScenarioScreenshot(this, scenario);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await this.attach(`Screenshot capture failed: ${message}`, 'text/plain');
    }
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
