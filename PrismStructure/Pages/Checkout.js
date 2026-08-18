const { expect } = require('@playwright/test');
const { BasePage } = require('./BasePage');

class Checkout extends BasePage {
    constructor(page) {
        super(page);
        this.proceedCart = page.locator('[data-test="proceed-1"]');
        this.proceedSignIn = page.locator('[data-test="proceed-2"]');
        this.proceedBilling = page.locator('[data-test="proceed-3"]');

        this.billingStreet = page.locator('[data-test="street"], [data-test="address"]');
        this.houseNumber = page.getByLabel('House number');
        this.city = page.locator('[data-test="city"]');
        this.state = page.locator('[data-test="state"]');
        this.country = page.locator('[data-test="country"]');
        this.postcode = page.getByLabel('Postal code');
        this.paymentOptions = page.locator('[data-test="payment-method"]');
        this.confirmBttn = page.locator('[data-test="finish"]');
        this.paymentSuccessMessage = page.locator('[data-test="payment-success-message"]');
        this.orderConfirmation = page.locator('#order-confirmation');
        this.invoiceNumber = page.locator('#order-confirmation span');
    }

    async proceedFromCart() {
        await this.proceedCart.click();
    }

    async proceedFromSignPage() {
        await this.proceedSignIn.click();
    }

    async proceedToBilling() {
        await this.proceedFromCart();
        await this.proceedFromSignPage();
        await expect(this.country).toBeVisible();
    }

    /**
     * Only fill country + postal code + house number.
     * Overwriting autofilled street/city/state can clear postal_code → invoice API 422.
     */
    async fillBillingAddress({
        houseNumber = '42',
        // Postcode lookup returns US fake addresses for "12345"
        country = 'United States of America (the)',
        postcode = '12345',
    } = {}) {
        await this.country.selectOption({ label: country });
        await this.postcode.fill(postcode);
        await expect(this.postcode).toHaveValue(postcode);

        // Postal-code lookup rerenders the form. Wait for it before filling
        // house number, otherwise the rerender clears the entered value.
        await expect(this.billingStreet).not.toHaveValue('', { timeout: 10000 });
        await expect(this.city).not.toHaveValue('');
        await expect(this.state).not.toHaveValue('');

        await this.houseNumber.fill(houseNumber);
        await this.houseNumber.press('Tab');
        await expect(this.houseNumber).toHaveValue(houseNumber);
        await expect(this.proceedBilling).toBeEnabled({ timeout: 10000 });
        await this.proceedBilling.click();
    }

    async selectPaymentMethod(paymentOption) {
        await this.paymentOptions.selectOption(paymentOption);
        await expect(this.confirmBttn).toBeEnabled();
        await this.confirmBttn.click();
    }

    async verifyPaymentSuccess() {
        await expect(this.paymentSuccessMessage).toBeVisible();
        await expect(this.paymentSuccessMessage).toHaveText('Payment was successful');
    }

    async confirmOrder() {
        await expect(this.paymentSuccessMessage).toBeVisible();
        await expect(this.confirmBttn).toBeEnabled();

        // Fail clearly if API rejects the order (better than try/catch or blind retries)
        const invoiceResponse = this.page.waitForResponse(
            (resp) => resp.url().includes('/invoices') && resp.request().method() === 'POST'
        );

        await this.confirmBttn.click();
        const response = await invoiceResponse;

        if (response.status() !== 201) {
            const body = await response.text();
            throw new Error(`Invoice create failed (${response.status()}): ${body}`);
        }

        await expect(this.orderConfirmation).toBeVisible({ timeout: 15000 });
    }

    async getInvoiceNumber() {
        await expect(this.invoiceNumber).toBeVisible();
        return (await this.invoiceNumber.textContent()).trim();
    }

    async verifyOrderConfirmation() {
        await expect(this.orderConfirmation).toContainText('Thanks for your order!');
        await expect(this.invoiceNumber).toHaveText(/^INV-/);
    }
}

module.exports = { Checkout };
