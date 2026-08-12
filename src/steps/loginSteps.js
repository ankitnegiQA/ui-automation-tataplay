import { Given, When, Then } from '@cucumber/cucumber';
import LoginPage from '../pom/loginPage.js';

Given('User launches the application', async function () {
  if (!this.page) {
    throw new Error("Playwright 'page' is undefined. Ensure the scenario has the @ui tag.");
  }
  // Store page object on Cucumber's World instance ('this')
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.navigateToLoginPage();
});

When('User logs in with valid credentials', async function () {
  // Methods pull credentials internally from setLogin
  await this.loginPage.enterMobileNumber();
  await this.loginPage.clickGetOtp();
  await this.loginPage.enterOtp();
});

Then('User should be logged in successfully', async function () {
  await this.page.waitForLoadState('networkidle');
});

Then('Validate profile name and email on the profile page', async function () {
  await this.loginPage.validateProfileNameAndEmail();
});