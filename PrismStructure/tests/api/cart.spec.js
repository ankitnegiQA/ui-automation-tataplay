const { test, expect } = require('@playwright/test');
const { ApiManager } = require('../../api/ApiManager');
const { buildRegisterPayload } = require('../helpers/apiTestData');

async function registerAndLogin(api) {
    const payload = buildRegisterPayload();
    await api.auth.register(payload);
    const loginRes = await api.auth.login(payload.email, payload.password);
    const { access_token } = await loginRes.json();
    return { token: access_token, payload };
}

test('TC_API_04 Create empty cart @Smoke', async ({ request }) => {
    const api = new ApiManager(request);
    const { token } = await registerAndLogin(api);

    const response = await api.cart.createCart(token);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
});

test('TC_API_05 Add product and verify cart contents @Regression', async ({ request }) => {
    const api = new ApiManager(request);
    const { token } = await registerAndLogin(api);
    const cartRes = await api.cart.createCart(token);

    const { id: cartId } = await cartRes.json();

    const productId = await api.product.getFirstProductId();

    const addRes = await api.cart.addItem(cartId, productId, 2, token);
    expect(addRes.status()).toBe(200);

    const getCartRes = await api.cart.getCart(cartId, token);
    expect(getCartRes.status()).toBe(200);

    const cart = await getCartRes.json();
    expect(cart.cart_items).toHaveLength(1);
    expect(cart.cart_items[0].product_id).toBe(productId);
    expect(cart.cart_items[0].quantity).toBe(2);
});
