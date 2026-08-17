import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import TataPlayPage from '../pom/tataPlayPage.js';

const app = world => world.tataPlayPage ||= new TataPlayPage(world);

Given('User registers a new account via API', async function () {
  this.apiResponse = await app(this).registerViaApi();
});

Then('User registration should be successful', async function () {
  expect([200, 201]).toContain(this.apiResponse.status());
});

When('User logs in via API with registered credentials', async function () {
  this.apiResponse = await app(this).loginViaApi();
});

Then('User should receive a valid bearer token', async function () {
  await app(this).storeTokenFrom(this.apiResponse);
});

When('User creates a new cart via API', async function () {
  this.apiResponse = await app(this).createCart();
});

Then('Cart should be created successfully with a valid cart ID', async function () {
  await app(this).storeCartIdFrom(this.apiResponse);
});

Given('User is authenticated and has an active cart', async function () {
  await app(this).ensureApiUserAndCart();
});

When('User fetches the product list via API', async function () {
  this.apiResponse = await app(this).fetchProducts();
});

Then('Product list should be retrieved successfully', async function () {
  await app(this).storeFirstProductFrom(this.apiResponse);
});

When('User adds the first available product to the cart', async function () {
  this.apiResponse = await app(this).addSelectedProductToCart();
});

Then('Product should be present in the cart contents', async function () {
  await app(this).expectSelectedProductInCart(this.apiResponse);
});

When('User generates an invoice with valid billing details', async function () {
  this.apiResponse = await app(this).generateInvoice();
});

Then('Invoice should be created successfully', async function () {
  await app(this).expectInvoiceCreated(this.apiResponse);
});

Given('the user opens the registration page', async function () {
  await app(this).openRegistrationPage();
});

When('the user completes and submits the registration form', async function () {
  await app(this).completeRegistrationForm();
  await app(this).submitRegistration();
});

Then('the user should be registered successfully', async function () {
  await app(this).expectRegistrationSuccess();
});

Given('User launches the application', async function () {
  await app(this).openLoginPage();
});

When('User logs in with valid credentials', async function () {
  await app(this).loginWithStoredCredentials();
});

Then('User should be logged in successfully', async function () {
  await app(this).expectLoggedIn();
});

Then('Validate profile name and email on the profile page', async function () {
  await app(this).expectProfileMatchesUserData();
});

Given('User is logged in with valid credentials', async function () {
  await app(this).loginForPurchase();
});

When('User browses catalog and adds multiple products to the cart', async function () {
  await app(this).addProductsToCart();
});

When('User updates the quantity of an item in the cart', async function () {
  await app(this).updateCartQuantity();
});

When('User completes the checkout process using Cash on Delivery', async function () {
  await app(this).checkoutWithCashOnDelivery();
});

Then('User should see the generated invoice under My Invoices', async function () {
  await app(this).expectInvoiceVisible();
});
