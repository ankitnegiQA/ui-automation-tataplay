import { expect } from '@playwright/test';

export class PurchasePage {
  constructor(page) {
    this.page = page;

    // Navigation Locators
    this.navHome = page.locator('a[data-test="nav-home"]');
    this.navCart = page.locator('a[data-test="nav-cart"]');
    this.navUserMenu = page.locator('a[data-test="nav-menu"]');
    this.navMyInvoices = page.locator('a[data-test="nav-my-invoices"]');

    // Catalog & Product Locators
    this.productCards = page.locator('a.card, .card-img-top, [data-test="product-name"]');
    this.addToCartBtn = page.locator('[data-test="add-to-cart"]');

    // Cart Locators
    this.cartQuantityInput = page.locator('input.quantity, [data-test="quantity"], [data-test="product-quantity"]').first();
    this.proceedToCheckoutBtn = page.locator('[data-test="proceed-1"]');
    this.proceedToPaymentBtn = page.locator('[data-test="proceed-2"]');
    this.houseNumberInput = page.locator('[data-test="house_number"]');
    this.proceedToConfirmBtn = page.locator('[data-test="proceed-3"]');

    // Checkout Locators
    this.paymentMethodSelect = page.locator('[data-test="payment-method"]');
    this.confirmOrderBtn = page.locator('[data-test="finish"]');

    // Order Confirmation Locators
    this.orderConfirmation = page.locator('#order-confirmation');
    this.invoiceNumberSpan = page.locator('#order-confirmation span');
    
    // Invoice Locators
    this.invoiceRows = page.locator('table tbody tr');
  }

  async addProductsToCart() {
    // 1. Ensure homepage catalog is loaded
    await this.page.goto('https://practicesoftwaretesting.com/#/');
    await this.productCards.first().waitFor({ state: 'visible', timeout: 10000 });

    const count = await this.productCards.count();
    if (count < 2) {
      throw new Error(`Expected at least 2 products in catalog, found: ${count}`);
    }

    // 2. Select two distinct random indices
    const firstIndex = Math.floor(Math.random() * count);
    let secondIndex = Math.floor(Math.random() * count);
    while (secondIndex === firstIndex) {
      secondIndex = Math.floor(Math.random() * count);
    }

    // 3. Add first randomly selected product
    await this.productCards.nth(firstIndex).click();
    await this.page.waitForURL(/.*\/product\/.*/, { timeout: 10000 });
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.addToCartBtn.click();
    await this.page.waitForTimeout(1000);

    // 4. Return home and add second randomly selected product
    await this.navHome.click();
    await this.productCards.first().waitFor({ state: 'visible', timeout: 10000 });
    await this.productCards.nth(secondIndex).click();
    await this.page.waitForURL(/.*\/product\/.*/, { timeout: 10000 });
    await this.addToCartBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.addToCartBtn.click();
    await this.page.waitForTimeout(1000);
  }

  async updateCartQuantity(quantity = 2) {
    // Navigate via UI click to maintain active SPA cart state
    await this.navCart.click();
    
    // Wait for cart summary and quantity input field to render
    await this.cartQuantityInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.cartQuantityInput.clear();
    await this.cartQuantityInput.fill(String(quantity));
    await this.cartQuantityInput.press('Enter');
    
    // Allow state/totals recalculation
    await this.page.waitForTimeout(1000);
  }

  async checkoutWithCashOnDelivery() {
    // Step 1: Proceed from cart summary
    await this.proceedToCheckoutBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.proceedToCheckoutBtn.click();

    // Step 2: Proceed from address check
    await this.proceedToPaymentBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.proceedToPaymentBtn.click();

    if (await this.houseNumberInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.houseNumberInput.fill('42');
    }

    // Step 3: Proceed to payment selection
    await this.proceedToConfirmBtn.waitFor({ state: 'visible', timeout: 10000 });
    await this.proceedToConfirmBtn.click();

    // Step 4: Select COD and confirm order
    await this.paymentMethodSelect.waitFor({ state: 'visible', timeout: 10000 });
    await this.paymentMethodSelect.selectOption('cash-on-delivery');
    await this.confirmOrderBtn.click();
        await this.confirmOrderBtn.click();
  }

  async verifyInvoiceGenerated() {
    await this.orderConfirmation.waitFor({ state: 'visible', timeout: 10000 });
    const invoiceNumber = await this.invoiceNumberSpan.innerText();
    console.log(`\n====================================`);
    console.log(`📄 Generated Invoice Number: ${invoiceNumber.trim()}`);
    console.log(`====================================\n`);
  }
}

export default PurchasePage;