const { test, expect } = require('@playwright/test');
const { ApiManager } = require('../../api/ApiManager');
const { buildRegisterPayload, buildInvalidEmailPayload, buildShortPasswordPayload } = require('../helpers/apiTestData');

test('TC_API_01 Register new user with valid payload @Smoke', async ({ request }) => {
    const api = new ApiManager(request);
    const payload = buildRegisterPayload();

    const response = await api.auth.register(payload);

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.email).toBe(payload.email);
    expect(body.id).toBeTruthy();
});

test('TC_API_02 Login and receive bearer token @Smoke', async ({ request }) => {
    const api = new ApiManager(request);
    const payload = buildRegisterPayload();

    await api.auth.register(payload);
    const response = await api.auth.login(payload.email, payload.password);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.access_token).toBeTruthy();
    expect(body.token_type).toBe('bearer');
});

test('TC_API_03 Login with invalid password @Regression', async ({ request }) => {
    const api = new ApiManager(request);
    const payload = buildRegisterPayload();

    await api.auth.register(payload);
    const response = await api.auth.login(payload.email, 'ssss1234!@#$%^&');

    expect(response.status()).toBe(401);
});

test('TC_API_03b Register with short password returns 422 @Regression', async ({ request }) => {
    const api = new ApiManager(request);
    const payload = buildShortPasswordPayload();

    const response = await api.auth.register(payload);

    expect(response.status()).toBe(422);
});
