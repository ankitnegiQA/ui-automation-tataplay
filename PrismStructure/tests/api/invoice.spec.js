const { test, expect } = require('@playwright/test');
const { ApiManager } = require('../../api/ApiManager');
const { buildRegisterPayload, createInvoiceBody } = require('../helpers/apiTestData');

test('TC_API_06 End-to-end register to invoice @Regression', async ({ request }) => {
    const api = new ApiManager(request);
    const payload = buildRegisterPayload();

    const regRes = await api.auth.register(payload);
    expect(regRes.status()).toBe(201);

    const loginRes = await api.auth.login(payload.email, payload.password);
    expect(loginRes.status()).toBe(200);

    const { access_token: token } = await loginRes.json();

    const cartRes = await api.cart.createCart(token);
    const { id: cartId } = await cartRes.json();

    const productId = await api.product.getFirstProductId();
    await api.cart.addItem(cartId, productId, 1, token);

    const cartCheck = await api.cart.getCart(cartId, token);
    const cartBody = await cartCheck.json();
    expect(cartBody.cart_items.length).toBeGreaterThan(0);

    const invoicePayload = createInvoiceBody(cartId);
    const invoiceRes = await api.invoice.createInvoice(invoicePayload, token);

    expect(invoiceRes.status()).toBe(201);
    const invoice = await invoiceRes.json();
    expect(invoice.invoice_number).toMatch(/^INV-/);
    expect(invoice.id).toBeTruthy();
});
