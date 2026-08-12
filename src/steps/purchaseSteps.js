import { Given, When, Then } from '@cucumber/cucumber';
import LoginPage from '../pom/loginPage.js';
import PurchasePage from '../pom/purchasePage.js';
import credentials from '../utility/credentials.json' with { type: 'json' };

let loginPage;
let purchasePage;

Given('User is logged in with valid credentials', async function () {
  loginPage = new LoginPage(this.page);
  purchasePage = new PurchasePage(this.page);

  await loginPage.navigateToLoginPage();
  await loginPage.enterMobileNumber();
  await loginPage.clickGetOtp();
  await loginPage.enterOtp();
  await loginPage.validateProfileNameAndEmail();
  await this.page.goto('https://practicesoftwaretesting.com/account');
  await this.page.goto(' https://practicesoftwaretesting.com/');

  
});

When('User browses catalog and adds multiple products to the cart', async function () {
  await purchasePage.addProductsToCart();
});

When('User updates the quantity of an item in the cart', async function () {
  await purchasePage.updateCartQuantity(3);
});

When('User completes the checkout process using Cash on Delivery', async function () {
  await purchasePage.checkoutWithCashOnDelivery();
});

Then('User should see the generated invoice under My Invoices', async function () {
  await purchasePage.verifyInvoiceGenerated();
});