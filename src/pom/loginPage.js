import { Given, When, Then } from '@cucumber/cucumber';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { expect } from '@playwright/test';

import config from '../utility/Config.js';
import { tatautility } from '../utility/tataUtility.js';

// Define __dirname and load setLogin JSON for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const credentialsPath = path.join(__dirname, '../utility/credentials.json');
const setLogin = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

class LoginPage {

    constructor(page) {
        this.page = page;
        this.automationIDLoginEmail = '//input[@data-test="email"]';
        this.automationIDLoginPassword = '//input[@data-test="password"]';
        this.automationIDLoginSubmitBtn = '//input[@data-test="login-submit"]';
        this.dataFilePath = path.join(__dirname, '../utility/userData.json');

    // UI Input Locators based on data-test attributes
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.countryInput = page.locator('[data-test="country"]');
    }

    async navigateToLoginPage() {
        await this.page.goto(config.baseUrl);
        const loginBtn = this.page.locator('//a[@data-test="nav-sign-in"]');
        await loginBtn.click();
    }

    async enterMobileNumber() {
        let emailSigin = setLogin.email;
        console.log(emailSigin+" login email");
        await this.page.locator(this.automationIDLoginEmail).fill(emailSigin);
    }

    async clickGetOtp() {
        
        let emailPassword =setLogin.password;
        await this.page.locator(this.automationIDLoginPassword).fill(emailPassword);
    }

    async enterOtp() {
        await this.page.locator(this.automationIDLoginSubmitBtn).click();
    }
    async validateProfileNameAndEmail() {
        await this.page.locator('//a[@data-test="nav-profile"]').click();
        const expectedData = tatautility.getStoredCredentials();
let emailSigin = setLogin.email;

        console.log(emailSigin+"Validation login email" + expectedData.firstName + expectedData.lastName + expectedData.phone + expectedData.street + expectedData.postalCode + expectedData.city + expectedData.state);
    // Assert that the input values match the JSON values
    await expect(this.firstNameInput).toHaveValue(expectedData.firstName);
    await expect(this.lastNameInput).toHaveValue(expectedData.lastName);
    await expect(this.phoneInput).toHaveValue(expectedData.phone);
    await expect(this.postalCodeInput).toHaveValue(expectedData.postalCode);
    await expect(this.cityInput).toHaveValue(expectedData.city);
    await expect(this.stateInput).toHaveValue(expectedData.state);
    await expect(this.emailInput).toHaveValue(emailSigin);
    
        
    }
}

export default LoginPage;