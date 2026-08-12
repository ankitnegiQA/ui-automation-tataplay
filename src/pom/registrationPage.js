import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tatautility } from '../utility/tataUtility.js';

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class RegistrationPage {
  constructor(page) {
    this.page = page;
    this.dataFilePath = path.join(__dirname, '../utility/userData.json');
    this.registerLink = page.locator('a[data-test="register-link"]');
    this.firstNameInput = page.locator('[data-test="first-name"]');
    this.lastNameInput = page.locator('[data-test="last-name"]');
    this.dobInput = page.locator('[data-test="dob"]');
    this.countrySelect = page.locator('[data-test="country"]');
    this.postalCodeInput = page.locator('[data-test="postal_code"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.streetInput = page.locator('[data-test="street"]');
    this.cityInput = page.locator('[data-test="city"]');
    this.stateInput = page.locator('[data-test="state"]');
    this.phoneInput = page.locator('[data-test="phone"]');
    this.emailInput = page.locator('[data-test="email"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.submitBtn = page.locator('[data-test="register-submit"]');
  }

  /**
   * Navigates to the registration page via link click
   */
  async clickRegistrationLink() {
    await this.registerLink.click();
  }

  /**
   * Reads stored data from JSON file
   */
  getStoredUserData() {
    const rawData = fs.readFileSync(this.dataFilePath, 'utf8');
    return JSON.parse(rawData);
  }

  /**
   * Generates a dynamic email and updates the stored JSON file
   */
  generateAndUpdateEmail() {
    const userData = this.getStoredUserData();
    userData.email = `john.doe.${Date.now()}@example.com`;
    fs.writeFileSync(this.dataFilePath, JSON.stringify(userData, null, 2));
    return userData;
  }

  /**
   * Fills out all input fields in the registration form
   * @param {Object} [overrideUserData] - Optional custom data object
   */
  async completeRegistrationForm(overrideUserData) {
    const userData = overrideUserData || this.generateAndUpdateEmail();

    await this.firstNameInput.fill(userData.firstName);
    await this.lastNameInput.fill(userData.lastName);
    await this.dobInput.fill(userData.dob);
    await this.countrySelect.selectOption(userData.countryCode);
    await this.postalCodeInput.fill(userData.postalCode);
    await this.houseNumberInput.fill(userData.houseNumber);
    await this.streetInput.fill(userData.street);
    await this.cityInput.fill(userData.city);
    await this.stateInput.fill(userData.state);
    await this.phoneInput.fill(userData.phone);

    const userEmail = tatautility.generateEmail();
    const userPassword = tatautility.generatePassword();

    await this.emailInput.fill(userEmail);
    await this.passwordInput.fill(userPassword);

    // Call saveCredentials directly through tatautility
    tatautility.saveCredentials(userEmail, userPassword);
  }

  /**
   * Submits the registration form
   */
  async submitForm() {
    await this.submitBtn.click();
  }
}

// Set default export for ES module system
export default RegistrationPage;