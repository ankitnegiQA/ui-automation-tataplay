# AI Prompts – Automation and Debugging

(Prompts used for automation structure, assertions, and analyzing failures/logs.)

---

## Entry 1

- **Prompt:** `TC_UI_03` checkout test fails on invoice creation with `422`: `{"billing_country":["The billing_country does not match the entered address. The city does not belong to the selected country."]}`. The test fills billing address on the UI checkout page. How should `Checkout.js` `fillBillingAddress()` be fixed?
- **AI Response Summary:**
  - Identified that overwriting autofilled street/city/state after postal-code lookup clears or mismatches address data sent to `POST /invoices`
  - Recommended filling only **country**, **postal code**, and **house number** — let the app autofill street/city/state from postcode lookup
  - Added `waitFor` on autofilled fields before proceeding and before clicking house number (rerender clears values)
  - Suggested waiting for invoice API response in `confirmOrder()` to fail clearly on non-201 status
- **Debugging Outcome:**
  - Updated `PrismStructure/Pages/Checkout.js` — `fillBillingAddress()` no longer overwrites street/city/state
  - `TC_UI_03` passes; invoice screenshot saved to `PrismStructure/screenshots/`
  - **Lesson:** UI billing autofill and API validation are coupled — don't fight the autofill

---

## Entry 2

- **Prompt:** All 6 API tests fail immediately with `TypeError: CartApi is not a constructor` at `ApiManager.js:10`. Also check `InvoiceApi` and `productApi` imports. Full error from `npm run test:api` attached.
- **AI Response Summary:**
  - Found class named `cartApi` (lowercase) but exported/imported as `CartApi`
  - Found `InvoiceApi` calling `this.autApi.authHeader(token)` — typo; correct method is `authHeaders()`
  - Found `createCart()` using undefined `token` variable — missing method parameter
  - Found `getCart` URL as `/cart/{id}` instead of `/carts/{id}`
  - Found `ApiManager` importing `productApi` but file exports `ProductApi`
- **Debugging Outcome:**
  - Renamed class to `CartApi` with `module.exports = { CartApi }`
  - Fixed `createCart(token)`, `getCart` URL, `authHeaders()` in `InvoiceApi.js`
  - Fixed `ProductApi` import in `ApiManager.js`
  - All 6 API tests passed on next run

---

## Entry 3

- **Prompt:** `TC_API_02` login test fails — using `expect(request.status()).toBe(200)` but `request` is the Playwright HTTP client, not the response. What is the correct assertion?
- **AI Response Summary:**
  - Explained `request` = Playwright fixture (sends HTTP calls); `response` = return value from `api.auth.login()`
  - Correct pattern: `const response = await api.auth.login(...); expect(response.status()).toBe(200)`
  - Also flagged unused imports `require('node:http')` and `require('node:console')` in spec files
- **Debugging Outcome:**
  - Fixed `auth.spec.js` line 25: `response.status()` instead of `request.status()`
  - Removed conflicting `node:http` imports from `auth.spec.js` and `cart.spec.js`
  - `TC_API_02` passes

---

## Entry 4

- **Prompt:** `TC_API_05` cart test fails with `ReferenceError: cartId is not defined`. Code has `const { id: cardId }` but later uses `cartId`. Also `expect(cart.cart_item).toHavelength(1)` — test won't compile.
- **AI Response Summary:**
  - Typo: destructured as `cardId` but referenced as `cartId` in `getCart()` call
  - Typo: `cart.cart_item` should be `cart.cart_items` (API response field name)
  - Typo: `toHavelength` should be `toHaveLength`
- **Debugging Outcome:**
  - Fixed all three typos in `cart.spec.js`
  - `TC_API_05` passes; cart contents verified with `product_id` and `quantity: 2`

---

## Entry 5

- **Prompt:** `TC_UI_02` and `TC_UI_03` fail with `Login failed for shubh.1785751327098@example.com: Invalid email or password`. `TEST_USER` in `testUser.js` is a seeded account on the shared demo DB. How to fix without hardcoding new credentials?
- **AI Response Summary:**
  - Explained shared public demo DB resets / account lockout makes static `TEST_USER` unreliable
  - Suggested `uiAuth.js` helper: register fresh user via API (`POST /users/register`) before UI login — fast and avoids UI registration overhead in cart/checkout tests
  - For `LoginPage.spec.js` keep UI registration flow; use faker email from `uiTestData.js`
- **Debugging Outcome:**
  - Created `PrismStructure/tests/helpers/uiAuth.js` with `createUiTestUser(request)`
  - Updated `AddProduct.spec.js` and `Checkout.spec.js` to use `createUiTestUser` instead of `TEST_USER`
  - All 3 UI tests pass on repeated runs

---

## Entry 6

- **Prompt:** API register with `invalidEmail: "not-an-email"` expected `422` but got `201`. Should the negative test use invalid email or short password from `registerData.json`?
- **AI Response Summary:**
  - ToolShop API accepts loose email format — `"not-an-email"` registers successfully
  - `shortPassword: "abc"` correctly returns `422` (password policy validation)
  - Recommended `TC_API_03b` use `buildShortPasswordPayload()` instead of invalid email
  - Keep `invalidEmail` in JSON for manual test reference only
- **Debugging Outcome:**
  - Renamed test to `TC_API_03b Register with short password returns 422`
  - Uses `buildShortPasswordPayload()` from `apiTestData.js`
  - Test passes; `invalidEmail` documented as non-automated in `ai-prompts/test-data.md`

---

## Entry 7

- **Prompt:** Fix all failures in API automation result. `npm run test:api` output attached — 6 failed, all `CartApi is not a constructor`. Provide fixes across all API client files and spec files.
- **AI Response Summary:**
  - Consolidated all API client fixes (Entries 2–4 above) into one pass
  - Standardised test IDs: `TC_API_01` through `TC_API_06`
  - Standardised `@Smoke` / `@Regression` tag casing
  - Verified `invoice.spec.js` expects login status `200` not `201`
- **Debugging Outcome:**
  - Full API suite green: **7 passed** (added `TC_API_03b` on test-data branch)
  - Full project green: **10 passed** (`npm test`) after UI auth fix

---

## Debugging Patterns Used

| Technique | When applied |
|-----------|--------------|
| Paste full Playwright error + stack trace | All entries |
| Paste API response body (`422` JSON) | Entry 1, Entry 6 |
| Share specific file with `@Checkout.js` reference | Entry 1 |
| Run `npm run test:api` and share output | Entry 2, Entry 7 |
| One bug per focused chat (Caveman approach) | All entries |
| Re-run tests after each fix — not all at once | All entries |
| Document outcome in `ai-prompts/` before next chat | End of each session |

---

## Files Modified During Debugging

| File | Issues fixed |
|------|--------------|
| `Pages/Checkout.js` | Billing 422, invoice response wait |
| `api/CartApi.js` | Class name, `createCart(token)`, `/carts/` URL |
| `api/InvoiceApi.js` | `authHeaders` typo |
| `api/ApiManager.js` | `ProductApi` import |
| `tests/api/auth.spec.js` | `response.status()`, removed bad imports |
| `tests/api/cart.spec.js` | `cartId`, `cart_items`, `toHaveLength` |
| `tests/helpers/uiAuth.js` | Created — stale credential fix |
| `tests/ui/AddProduct.spec.js` | Uses `createUiTestUser` |
| `tests/ui/Checkout.spec.js` | Uses `createUiTestUser` |
