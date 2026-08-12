import { Given, When, Then } from '@cucumber/cucumber';
import { RegistrationPage } from '../pom/registrationPage.js';
import LoginPage from '../pom/loginPage.js';

let loginPage;
let registrationPageInstance;

Given('the user opens the registration page', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.navigateToLoginPage();
  registrationPageInstance = new RegistrationPage(this.page);
  await registrationPageInstance.clickRegistrationLink();
});

When('the user completes and submits the registration form', async function () {
  await registrationPageInstance.completeRegistrationForm();
  await registrationPageInstance.submitForm();
});

Then('the user should be registered successfully', async function () {
  // Post-registration assertion logic goes here
});