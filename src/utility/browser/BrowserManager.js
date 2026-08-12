import { chromium } from 'playwright';

let browser;
let context;
let page;

export async function launchBrowser() {
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

export async function closeBrowser() {
    if (context) {
        await context.close();
    }

    if (browser) {
        await browser.close();
    }
}