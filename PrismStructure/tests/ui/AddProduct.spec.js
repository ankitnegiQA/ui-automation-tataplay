const { test, expect } = require('@playwright/test');
const { PomManager } = require('../../Pages/PomManager');
const { createUiTestUser } = require('../helpers/uiAuth');

test('TC_UI_02 Add products to cart @Smoke', async ({ page, request }) => {
    await test.setTimeout(60000);
    const pomManager = new PomManager(page);
    const loginPage = pomManager.getLoginPage();
    const cart = pomManager.getCart();

    const user = await createUiTestUser(request);
    await loginPage.login(user.email, user.password);

    const productsToAdd = ['Pliers', 'Hammer', 'Pliers'];

    await cart.addProductInCart(productsToAdd);
    await page.waitForLoadState();
    await cart.openCart();

    await expect(page).toHaveURL(/.*checkout/);
    await cart.verifyProductInCart(productsToAdd);
});
