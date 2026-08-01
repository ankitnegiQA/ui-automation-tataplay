const { Given, When, Then } = require('@cucumber/cucumber');
const LoginPage = require('../pom/LoginPage');
const config = require('../utility/Config');

let loginPage;

Given('User launches the application', async function () {
    loginPage = new LoginPage(this.page);

    await loginPage.navigateToLoginPage();
});

When('User logs in with valid credentials', async function () {

    await loginPage.enterMobileNumber(config.mobileNumber);

    await loginPage.clickGetOtp();

    await loginPage.enterOtp(config.otp);
});

Then('User should be logged in successfully', async function () {

    await this.page.waitForLoadState('networkidle');
});