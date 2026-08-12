import { Given, When, Then } from '@cucumber/cucumber';
import { expect, request as playwrightRequest } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import config from '../utility/Config.js';
import AuthenticationPage from '../pom/AuthenticationPage.js';
import CartPage from '../pom/cartPage.js';
import { tatautility } from '../utility/tataUtility.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const userDataPath = path.join(__dirname, '../utility/userData.json');

async function parseJsonResponse(response) {
  const rawText = await response.text();
  try {
    return JSON.parse(rawText);
  } catch (error) {
    throw new Error(
      `Failed to parse JSON response (HTTP ${response.status()}). Raw body:\n${rawText.slice(0, 300)}`
    );
  }
}

function getUserData() {
  if (fs.existsSync(userDataPath)) {
    try {
      return JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
    } catch (e) {
      console.warn('⚠️ Could not parse userData.json, fallback values will be used.');
    }
  }
  return {};
}

Given('User is authenticated and has an active cart', { timeout: 30000 }, async function () {
  if (!this.request) {
    const requestContext = this.page ? this.page.request : await playwrightRequest.newContext({
      baseURL: config.apiBaseUrl || 'https://api.practicesoftwaretesting.com'
    });
    this.request = requestContext;
  }

  this.authPage = new AuthenticationPage(this.request);
  this.cartPage = new CartPage(this.request);

  if (!this.authToken) {
    let email, password;

    if (tatautility.getStoredCredentials) {
      const stored = tatautility.getStoredCredentials();
      email = stored?.email;
      password = stored?.password;
    }

    let loginRes = email && password ? await this.authPage.loginUser(email, password) : null;
    let loginBody = (loginRes && loginRes.status() === 200) ? await parseJsonResponse(loginRes) : null;

    if (!loginBody) {
      const storedData = getUserData();

      email = tatautility.generateEmail();
      password = tatautility.generatePassword();
      tatautility.saveCredentials(email, password);

      const houseNo = storedData.houseNumber || '123';
      const street = storedData.street || 'Main Street';
      const streetAddress = `${houseNo} ${street}`.trim();

      const newUserPayload = {
        first_name: storedData.firstName || 'John',
        last_name: storedData.lastName || 'Doe',
        dob: storedData.dob || '1990-01-01',
        address: [streetAddress],
        postcode: (storedData.postalCode || '10001').replace(/[^a-zA-Z0-9]/g, ''),
        city: storedData.city || 'New York',
        state: storedData.state || 'NY',
        country: 'US',
        phone: (storedData.phone || '1234567890').replace(/[^0-9]/g, ''),
        email: email,
        password: password
      };

      await this.authPage.registerUser(newUserPayload);
      loginRes = await this.authPage.loginUser(email, password);
      loginBody = await parseJsonResponse(loginRes);
    }

    this.authToken = loginBody?.access_token || loginBody?.token || loginBody?.result?.access_token;

    if (this.authToken) {
      const profileRes = await this.authPage.getUserProfile(this.authToken);
      if (profileRes.status() === 200) {
        const profileData = await parseJsonResponse(profileRes);

        let rawAddr = profileData.address || profileData.street;
        if (Array.isArray(rawAddr)) {
          const item = rawAddr[0];
          this.userStreet = typeof item === 'object' ? (item.street || item.address || '123 Main Street') : item;
        } else if (typeof rawAddr === 'object' && rawAddr !== null) {
          this.userStreet = rawAddr.street || rawAddr.address || '123 Main Street';
        } else {
          this.userStreet = rawAddr || '123 Main Street';
        }

        this.userCity = profileData.city || 'New York';
        this.userState = profileData.state || 'NY';
        this.userCountry = profileData.country || 'US';
        this.userPostcode = profileData.postcode || '10001';

        this.formattedAddress = `${this.userStreet}, ${this.userCity}, ${this.userState} ${this.userPostcode} ${this.userCountry}`;
        console.log(this.formattedAddress + " <<--- User Address Retrieved from Profile");
      }
    }
  }

  if (!this.cartId) {
    const cartRes = await this.authPage.createCart(this.authToken);
    const cartBody = await parseJsonResponse(cartRes);
    this.cartId = cartBody.id;
  }

  expect(this.authToken, 'authToken should be defined').toBeTruthy();
  expect(this.cartId, 'cartId should be defined').toBeTruthy();
});

When('User fetches the product list via API', async function () {
  this.apiResponse = await this.cartPage.getProducts();
});

Then('Product list should be retrieved successfully', async function () {
  expect(this.apiResponse.status()).toBe(200);

  const body = await parseJsonResponse(this.apiResponse);
  const products = body.data || body;
  expect(products.length).toBeGreaterThan(0);

  this.selectedProduct = products[0];
});

When('User adds the first available product to the cart', async function () {
  this.apiResponse = await this.cartPage.addProductToCart(
    this.cartId,
    this.selectedProduct.id,
    1,
    this.authToken
  );
});

Then('Product should be present in the cart contents', async function () {
  expect([200, 201]).toContain(this.apiResponse.status());

  const cartDetailsRes = await this.cartPage.getCartDetails(this.cartId);
  expect(cartDetailsRes.status()).toBe(200);

  const cartData = await parseJsonResponse(cartDetailsRes);
  const items = cartData.cart_items || cartData.items || [];

  const itemFound = items.some(
    (item) => item.product_id === this.selectedProduct.id || item.product?.id === this.selectedProduct.id
  );
  expect(itemFound).toBe(true);
});
When('User generates an invoice with valid billing details', async function () {
  const paymentCheckRes = await this.cartPage.checkPayment('cash-on-delivery', this.authToken);
  expect([200, 201]).toContain(paymentCheckRes.status());

  const storedData = getUserData();
  const country = storedData.countryCode || this.userCountry || 'US';
  const postcode = storedData.postalCode || this.userPostcode || '10001';
  const houseNumber = storedData.houseNumber || '10';

  // 1. Fetch valid address from the API
  const lookupRes = await this.cartPage.lookupPostcode(country, postcode, houseNumber);
  let addressInfo = {};

  if (lookupRes.status() === 200) {
    addressInfo = await parseJsonResponse(lookupRes);
  }

  // 2. Build invoice payload strictly using response data with fallbacks
  const invoicePayload = {
    billing_street: addressInfo.street || `${houseNumber} ${storedData.street || this.userStreet}`,
    billing_city: addressInfo.city || storedData.city || this.userCity,
    billing_state: addressInfo.state || storedData.state || this.userState,
    billing_country: addressInfo.country || country,
    billing_postal_code: addressInfo.postcode || addressInfo.postal_code || postcode,
    payment_method: 'cash-on-delivery',
    payment_details: {},
    cart_id: this.cartId
  };

  // 3. Submit invoice
  this.apiResponse = await this.cartPage.generateInvoice(invoicePayload, this.authToken);
});
Then('Invoice should be created successfully', async function () {
  const status = this.apiResponse.status();
  const body = await parseJsonResponse(this.apiResponse);

  if (status === 422) {
    console.error('\n❌ --- INVOICE 422 VALIDATION ERROR DETAILS --- ❌');
    console.error(JSON.stringify(body, null, 2));
    console.error('--------------------------------------------------\n');
  }

  expect([200, 201]).toContain(status);
  expect(body.id || body.invoice_number).toBeTruthy();
});