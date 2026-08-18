const { test, expect } = require('@playwright/test');
const { PomManager } = require('../../Pages/PomManager');
const { createUiTestUser } = require('../helpers/uiAuth');

test('TC_UI_03 End-to-end checkout and invoice @Regression', async ({ page, request }) => {
    await test.setTimeout(60000);
    const pomManager = new PomManager(page);
    const loginPage = pomManager.getLoginPage();
    const cart = pomManager.getCart();
    const checkout = pomManager.getCheckout();
    const orderHistory = pomManager.getOrderHistory();

    const user = await createUiTestUser(request);
    await loginPage.login(user.email, user.password);

    const productsToAdd = ['Pliers', 'Hammer'];

    await cart.addProductInCart(productsToAdd);
    await page.waitForLoadState();
    await cart.openCart();
    await expect(page).toHaveURL(/.*checkout/);

    await checkout.proceedToBilling();
    await checkout.fillBillingAddress();
    await checkout.selectPaymentMethod('Cash on Delivery');
    await checkout.verifyPaymentSuccess();

    await checkout.confirmOrder();
    await checkout.verifyOrderConfirmation();
    const invoice = await checkout.getInvoiceNumber();

    await orderHistory.openInvoice(invoice);
    await page.screenshot({
        path: `PrismStructure/screenshots/invoice-${invoice}.png`,
        fullPage: true,
    });
});
