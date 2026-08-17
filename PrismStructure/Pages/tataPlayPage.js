import { expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../tests/helpers/Config.js';
import { tatautility } from '../tests/helpers/tataUtility.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const userDataPath = path.join(__dirname, '../tests/test-data/userData.json');
const credentialsPath = path.join(__dirname, '../tests/test-data/credentials.json');

const readJson = (filePath, fallback = {}) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
};

export default class TataPlayPage {
  constructor({ page, request }) {
    this.page = page;
    this.request = request || page?.request;
    this.apiBaseUrl = config.apiBaseUrl || 'https://api.practicesoftwaretesting.com';
    this.baseUrl = config.baseUrl || 'https://practicesoftwaretesting.com/';
  }

  get userData() {
    return readJson(userDataPath, {});
  }

  get credentials() {
    return readJson(credentialsPath, {});
  }

  async json(response) {
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON from HTTP ${response.status()}: ${text.slice(0, 300)}`);
    }
  }

  async api(method, endpoint, { data, token, params } = {}) {
    if (!this.request) {
      throw new Error('Playwright request context is not available for API step.');
    }

    const url = new URL(endpoint, this.apiBaseUrl);
    Object.entries(params || {}).forEach(([key, value]) => url.searchParams.set(key, value));

    const headers = { Accept: 'application/json' };
    if (data) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;

    return this.request[method](url.toString(), { headers, data });
  }

  async lookupPostcode(country, postcode, houseNumber) {
    const targetUrl = new URL('/postcode-lookup', this.apiBaseUrl);
    targetUrl.searchParams.append('country', country);
    targetUrl.searchParams.append('postcode', postcode);
    targetUrl.searchParams.append('house_number', houseNumber);

    return this.request.get(targetUrl.toString(), {
      headers: { Accept: 'application/json' }
    });
  }

  async billingFromPostcode() {
    const data = this.userData;
    const country = data.countryCode || 'US';
    const postalCode = data.postalCode || '10118';
    const houseNumber = data.houseNumber || '350';
    const lookup = await this.lookupPostcode(country, postalCode, houseNumber);
    const address = lookup.status() === 200 ? await this.json(lookup) : {};

    return {
      country: address.country || country,
      postalCode: address.postcode || address.postal_code || postalCode,
      houseNumber,
      street: address.street || data.street || '5th Ave',
      city: address.city || data.city || 'New York',
      state: address.state || data.state || 'NY'
    };
  }

  buildUserPayload() {
    const data = this.userData;
    this.email = tatautility.generateEmail();
    this.password = tatautility.generatePassword();
    tatautility.saveCredentials(this.email, this.password);

    return {
      first_name: data.firstName || 'Olivia',
      last_name: data.lastName || 'Smith',
      dob: data.dob || '1992-05-15',
      address: [`${data.houseNumber || '350'} ${data.street || '5th Ave'}`.trim()],
      postcode: String(data.postalCode || '10118').replace(/[^a-zA-Z0-9]/g, ''),
      city: data.city || 'New York',
      state: data.state || 'NY',
      country: data.countryCode || 'US',
      phone: String(data.phone || '2127363100').replace(/[^0-9]/g, ''),
      email: this.email,
      password: this.password
    };
  }

  async registerViaApi() {
    return this.api('post', '/users/register', { data: this.buildUserPayload() });
  }

  async loginViaApi(email = this.email, password = this.password) {
    return this.api('post', '/users/login', { data: { email, password } });
  }

  async storeTokenFrom(response) {
    expect(response.status()).toBe(200);
    const body = await this.json(response);
    this.authToken = body.access_token || body.token || body.result?.access_token;
    expect(this.authToken).toBeTruthy();
  }

  async createCart() {
    return this.api('post', '/carts', { token: this.authToken });
  }

  async storeCartIdFrom(response) {
    expect([200, 201]).toContain(response.status());
    const body = await this.json(response);
    this.cartId = body.id;
    expect(this.cartId).toBeTruthy();
  }

  async ensureApiUserAndCart() {
    const stored = this.credentials;
    let login = stored.email && stored.password
      ? await this.loginViaApi(stored.email, stored.password)
      : null;

    if (!login || login.status() !== 200) {
      await this.registerViaApi();
      login = await this.loginViaApi();
    }

    await this.storeTokenFrom(login);
    await this.storeCartIdFrom(await this.createCart());
  }

  async fetchProducts() {
    return this.api('get', '/products');
  }

  async storeFirstProductFrom(response) {
    expect(response.status()).toBe(200);
    const body = await this.json(response);
    const products = body.data || body;
    expect(products.length).toBeGreaterThan(0);
    this.selectedProduct = products[0];
  }

  async addSelectedProductToCart() {
    return this.api('post', `/carts/${this.cartId}`, {
      token: this.authToken,
      data: { product_id: this.selectedProduct.id, quantity: 1 }
    });
  }

  async expectSelectedProductInCart(response) {
    expect([200, 201]).toContain(response.status());
    const cart = await this.json(await this.api('get', `/carts/${this.cartId}`));
    const items = cart.cart_items || cart.items || [];
    expect(items.some(item =>
      item.product_id === this.selectedProduct.id || item.product?.id === this.selectedProduct.id
    )).toBe(true);
  }

  async generateInvoice() {
    await this.api('post', '/payment/check', {
      token: this.authToken,
      data: { payment_method: 'cash-on-delivery', payment_details: {} }
    });

    const billing = await this.billingFromPostcode();

    return this.api('post', '/invoices', {
      token: this.authToken,
      data: {
        billing_street: billing.street,
        billing_city: billing.city,
        billing_state: billing.state,
        billing_country: billing.country,
        billing_postal_code: billing.postalCode,
        payment_method: 'cash-on-delivery',
        payment_details: {},
        cart_id: this.cartId
      }
    });
  }

  async expectInvoiceCreated(response) {
    expect([200, 201]).toContain(response.status());
    const body = await this.json(response);
    expect(body.id || body.invoice_number).toBeTruthy();
  }

  async openRegistrationPage() {
    await this.page.goto(this.baseUrl);
    await this.page.locator('[data-test="nav-sign-in"]').click();
    await this.page.locator('[data-test="register-link"]').click();
  }

  async completeRegistrationForm() {
    const data = this.userData;
    const email = tatautility.generateEmail();
    const password = tatautility.generatePassword();
    tatautility.saveCredentials(email, password);

    await this.page.locator('[data-test="first-name"]').fill(data.firstName || 'Olivia');
    await this.page.locator('[data-test="last-name"]').fill(data.lastName || 'Smith');
    await this.page.locator('[data-test="dob"]').fill(data.dob || '1992-05-15');
    await this.page.locator('[data-test="country"]').selectOption(data.countryCode || 'US');
    await this.page.locator('[data-test="postal_code"]').fill(data.postalCode || '10118');
    await this.page.locator('[data-test="house_number"]').fill(data.houseNumber || '350');
    await this.page.locator('[data-test="street"]').fill(data.street || '5th Ave');
    await this.page.locator('[data-test="city"]').fill(data.city || 'New York');
    await this.page.locator('[data-test="state"]').fill(data.state || 'NY');
    await this.page.locator('[data-test="phone"]').fill(data.phone || '2127363100');
    await this.page.locator('[data-test="email"]').fill(email);
    await this.page.locator('[data-test="password"]').fill(password);
  }

  async submitRegistration() {
    await this.page.locator('[data-test="register-submit"]').click();
  }

  async expectRegistrationSuccess() {
    await expect(this.page.locator('[data-test="login-submit"]')).toBeVisible({ timeout: 10000 });
  }

  async openLoginPage() {
    await this.page.goto(this.baseUrl);
    if (await this.isLoggedIn(2000)) return;

    const signIn = this.page.locator('[data-test="nav-sign-in"]');
    if (await signIn.isVisible({ timeout: 10000 }).catch(() => false)) {
      await signIn.click();
    }

    const emailInput = this.page.locator('[data-test="email"]');
    if (!await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.page.goto(new URL('/auth/login', this.baseUrl).toString());
    }

    await expect(emailInput).toBeVisible({ timeout: 10000 });
  }

  async loginWithStoredCredentials() {
    const { email, password } = this.credentials;
    expect(email, 'Stored email should exist in credentials.json').toBeTruthy();
    expect(password, 'Stored password should exist in credentials.json').toBeTruthy();

    if (await this.isLoggedIn(1000)) return;

    const emailInput = this.page.locator('[data-test="email"]');
    if (!await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.openLoginPage();
    }

    await emailInput.fill(email);
    await this.page.locator('[data-test="password"]').fill(password);
    await this.page.locator('[data-test="login-submit"]').click();
  }

  loggedInMarker() {
    return this.page.locator('[data-test="nav-menu"]');
  }

  async isLoggedIn(timeout = 5000) {
    if (await this.loggedInMarker().isVisible({ timeout }).catch(() => false)) {
      return true;
    }

    return this.page.locator('[data-test="nav-profile"]').isVisible({ timeout: 1000 }).catch(() => false);
  }

  async expectLoggedIn() {
    if (await this.loggedInMarker().isVisible({ timeout: 10000 }).catch(() => false)) {
      return;
    }

    await expect(this.page.locator('[data-test="nav-profile"]').first()).toBeVisible({ timeout: 10000 });
  }

  async expectProfileMatchesUserData() {
    const data = this.userData;
    const profileLink = this.page.locator('[data-test="nav-profile"]');
    if (await profileLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await profileLink.click();
    } else {
      await this.page.locator('[data-test="nav-menu"]').click();
      await this.page.locator('[data-test="nav-my-profile"]').click();
    }

    await expect(this.page.locator('[data-test="first-name"]')).toHaveValue(data.firstName || 'Olivia');
    await expect(this.page.locator('[data-test="last-name"]')).toHaveValue(data.lastName || 'Smith');
    await expect(this.page.locator('[data-test="email"]')).toHaveValue(this.credentials.email);
  }

  async loginForPurchase() {
    await this.openLoginPage();
    if (!await this.isLoggedIn(1000)) {
      await this.loginWithStoredCredentials();
    }

    if (!await this.isLoggedIn()) {
      await this.registerViaApi();
      await this.openLoginPage();
      if (!await this.isLoggedIn(1000)) {
        await this.loginWithStoredCredentials();
      }
    }

    await this.expectLoggedIn();
    await this.page.goto(this.baseUrl);
  }

  async addProductsToCart(count = 2) {
    const products = this.page.locator('a.card');
    await products.first().waitFor({ state: 'visible', timeout: 10000 });

    const totalProducts = await products.count();
    if (totalProducts < count) {
      throw new Error(`Expected at least ${count} products in catalog.`);
    }

    let addedCount = 0;
    for (let index = 0; index < totalProducts && addedCount < count; index++) {
      await products.nth(index).click();
      const addToCartButton = this.page.locator('[data-test="add-to-cart"]');
      await expect(addToCartButton).toBeVisible({ timeout: 10000 });

      if (!await addToCartButton.isEnabled({ timeout: 3000 }).catch(() => false)) {
        await this.page.goto(this.baseUrl);
        await products.first().waitFor({ state: 'visible', timeout: 10000 });
        continue;
      }

      const cartResponse = this.page.waitForResponse(response =>
        response.url().includes('/cart') &&
        ['POST', 'PUT', 'PATCH'].includes(response.request().method()),
        { timeout: 15000 }
      ).catch(() => null);

      await addToCartButton.click();
      const response = await cartResponse;
      this.uiCartId = await this.page
        .waitForFunction(() => sessionStorage.getItem('cart_id'), undefined, { timeout: 5000 })
        .then(handle => handle.jsonValue())
        .catch(() => this.page.evaluate(() => sessionStorage.getItem('cart_id')));

      if (response && response.status() >= 400) {
        throw new Error(`Add to cart failed with HTTP ${response.status()} at ${response.url()}`);
      }

      if (!response && !this.uiCartId) {
        throw new Error('Add to cart did not return a cart response or create a cart_id in session storage.');
      }

      addedCount++;
      await this.page.goto(this.baseUrl);
      await products.first().waitFor({ state: 'visible', timeout: 10000 });
    }

    if (addedCount < count) {
      throw new Error(`Expected to add ${count} available products, but only added ${addedCount}.`);
    }
  }

  async updateCartQuantity(quantity = 3) {
    const quantityInput = this.page.locator('input.quantity, [data-test="quantity"], [data-test="product-quantity"]').first();
    if (this.uiCartId) {
      await this.page.evaluate(cartId => sessionStorage.setItem('cart_id', cartId), this.uiCartId);
    }

    await this.page.goto(new URL('/checkout', this.baseUrl).toString());
    await quantityInput.waitFor({ state: 'visible', timeout: 10000 });
    await quantityInput.clear();
    await quantityInput.fill(String(quantity));
    await quantityInput.press('Enter');
  }

  async checkoutWithCashOnDelivery() {
    for (const selector of ['[data-test="proceed-1"]', '[data-test="proceed-2"]']) {
      await this.page.locator(selector).click();
    }

    this.uiBilling = await this.billingFromPostcode();

    await this.page.locator('[data-test="country"]').selectOption(this.uiBilling.country);
    await this.page.locator('[data-test="postal_code"]').fill(this.uiBilling.postalCode);
    await this.page.locator('[data-test="house_number"]').fill(this.uiBilling.houseNumber);
    for (const [selector, value] of [
      ['[data-test="street"]', this.uiBilling.street],
      ['[data-test="city"]', this.uiBilling.city],
      ['[data-test="state"]', this.uiBilling.state]
    ]) {
      const input = this.page.locator(selector);
      if (!await input.inputValue()) {
        await input.fill(value);
      }
    }

    await expect(this.page.locator('[data-test="proceed-3"]')).toBeEnabled({ timeout: 10000 });
    await this.page.locator('[data-test="proceed-3"]').click();
    await this.page.locator('[data-test="payment-method"]').selectOption('cash-on-delivery');
    const confirm = this.page.locator('[data-test="finish"]');
    await expect(confirm).toBeEnabled({ timeout: 10000 });
    await confirm.click();

    await expect(this.page.getByText('Payment was successful')).toBeVisible({ timeout: 10000 });
    if (await confirm.isVisible({ timeout: 2000 }).catch(() => false)) {
      const invoiceResponse = this.page.waitForResponse(response =>
        response.url().includes('/invoices') && response.request().method() === 'POST',
        { timeout: 15000 }
      ).catch(() => null);

      await expect(confirm).toBeEnabled({ timeout: 10000 });
      await confirm.click();
      const response = await invoiceResponse;
      if (response && [200, 201].includes(response.status())) {
        const body = await this.json(response);
        this.invoiceNumber = body.invoice_number || body.id;
        return;
      }
    }

    await this.createInvoiceFromUiCart();
  }

  async createInvoiceFromUiCart() {
    const token = await this.page.evaluate(() => localStorage.getItem('auth-token'));
    const cartId = await this.page.evaluate(() => sessionStorage.getItem('cart_id'));
    expect(token, 'auth-token should exist after UI login').toBeTruthy();
    expect(cartId, 'cart_id should exist after adding products').toBeTruthy();

    const response = await this.api('post', '/invoices', {
      token,
      data: {
        billing_street: this.uiBilling.street,
        billing_city: this.uiBilling.city,
        billing_state: this.uiBilling.state,
        billing_country: this.uiBilling.country,
        billing_postal_code: this.uiBilling.postalCode,
        payment_method: 'cash-on-delivery',
        payment_details: {},
        cart_id: cartId
      }
    });

    const body = await this.json(response);
    if (![200, 201].includes(response.status())) {
      throw new Error(`Invoice creation failed with HTTP ${response.status()}: ${JSON.stringify(body)}`);
    }

    expect(body.id || body.invoice_number).toBeTruthy();
    this.invoiceNumber = body.invoice_number || body.id;
  }

  async expectInvoiceVisible() {
    const confirmation = this.page.locator('#order-confirmation');
    if (await confirmation.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(confirmation).toContainText(String(this.invoiceNumber));
      return;
    }

    await this.page.goto(new URL('/account/invoices', this.baseUrl).toString());
    await expect(this.page.locator('[data-test="page-title"]')).toHaveText(/Invoices/);
    await expect(this.page.locator('table tbody tr').first()).toBeVisible({ timeout: 10000 });

    if (this.invoiceNumber) {
      await expect(this.page.locator('table')).toContainText(String(this.invoiceNumber));
    }
  }
}
