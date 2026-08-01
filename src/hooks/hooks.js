const { Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { launchBrowser, closeBrowser } = require('../utility/browser/BrowserManager');

setDefaultTimeout(60 * 1000); // 60 seconds

Before(async function () {
    const browserObj = await launchBrowser();
    this.page = browserObj.page;
});

After(async function (scenario) {

    if (
        scenario.result.status === Status.FAILED &&
        this.page
    ) {
        const screenshot = await this.page.screenshot({
            path: `test-results/screenshots/${scenario.pickle.name}.png`,
            fullPage: true
        });

        await this.attach(screenshot, 'image/png');
    }

    await closeBrowser();
});