import { Given, When, Then } from '@cucumber/cucumber';
import { expect, request as playwrightRequest } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import AuthenticationPage from '../pom/AuthenticationPage.js';
import { tatautility } from '../utility/tataUtility.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userDataPath = path.join(__dirname, '../utility/userData.json');

let authPage;
let generatedEmail;
let generatedPassword;

async function getRequestContext(world) {
  if (world.request) return world.request;
  if (world.page && world.page.request) return world.page.request;
  world.request = await playwrightRequest.newContext();
  return world.request;
}

Given('User registers a new account via API', async function () {
  const reqContext = await getRequestContext(this);
  authPage = new AuthenticationPage(reqContext);

  let storedData = {};
  if (fs.existsSync(userDataPath)) {
    storedData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
  }

  generatedEmail = tatautility.generateEmail();
  generatedPassword = tatautility.generatePassword();
  tatautility.saveCredentials(generatedEmail, generatedPassword);

  const registrationPayload = {
    first_name: storedData.firstName || 'Olivia',
    last_name: storedData.lastName || 'Smith',
    dob: storedData.dob || '1992-05-15',
    address: [`${storedData.houseNumber || '350'} ${storedData.street || '5th Ave'}`.trim()],
    postcode: (storedData.postalCode || '10118').replace(/[^a-zA-Z0-9]/g, ''),
    city: storedData.city || 'New York',
    state: storedData.state || 'NY',
    country: storedData.countryCode || 'US',
    phone: (storedData.phone || '2127363100').replace(/[^0-9]/g, ''),
    email: generatedEmail,
    password: generatedPassword
  };

  this.apiResponse = await authPage.registerUser(registrationPayload);
});

Then('User registration should be successful', async function () {
  expect([200, 201]).toContain(this.apiResponse.status());
});

When('User logs in via API with registered credentials', async function () {
  const reqContext = await getRequestContext(this);
  authPage = new AuthenticationPage(reqContext);

  this.apiResponse = await authPage.loginUser(generatedEmail, generatedPassword);
});

Then('User should receive a valid bearer token', async function () {
  expect(this.apiResponse.status()).toBe(200);
  const body = await this.apiResponse.json();
  this.authToken = body.access_token || body.token || body.result?.access_token;
  expect(this.authToken).toBeTruthy();
});

When('User creates a new cart via API', async function () {
  const reqContext = await getRequestContext(this);
  authPage = new AuthenticationPage(reqContext);

  this.apiResponse = await authPage.createCart(this.authToken);
});

Then('Cart should be created successfully with a valid cart ID', async function () {
  expect([200, 201]).toContain(this.apiResponse.status());
  const body = await this.apiResponse.json();
  this.cartId = body.id;
  expect(this.cartId).toBeTruthy();
});