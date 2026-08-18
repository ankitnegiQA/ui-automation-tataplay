const { buildRegisterPayload } = require('./apiTestData');

const API_BASE = 'https://api.practicesoftwaretesting.com';

/**
 * Creates a fresh user via API (fast) for UI tests that need login.
 * Avoids stale/locked seeded accounts in testUser.js.
 */
async function createUiTestUser(request) {
    const payload = buildRegisterPayload();
    const registerRes = await request.post(`${API_BASE}/users/register`, { data: payload });
    if (registerRes.status() !== 201) {
        throw new Error(`UI test user registration failed: ${registerRes.status()}`);
    }
    return { email: payload.email, password: payload.password };
}

module.exports = { createUiTestUser };
