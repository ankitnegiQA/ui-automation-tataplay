const { chromium } = require('playwright');

let browser;
let context;
let page;

async function launchBrowser() {

    browser = await chromium.launch({
        headless: false,
    slowMo: 1000
    });

    context = await browser.newContext({
        recordVideo: {
            dir: 'test-results/videos/'
        }
    });

    page = await context.newPage();

    return { browser, context, page };
}

async function closeBrowser() {

    if (context) {
        await context.close();
    }

    if (browser) {
        await browser.close();
    }
}

module.exports = {
    launchBrowser,
    closeBrowser
};