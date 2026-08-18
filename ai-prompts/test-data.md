# AI Prompts – Test Data

(Prompts used to generate test data for UI + API.)

---

## Entry 1

- **Prompt:** Generate test data for ToolShop user registration. I need: valid user data, invalid email format, short password, and the invoice billing data from the document (Zoey Shore, Hesselbury, Florida, TG, 1234AA). Format as JSON.
- **AI Response Summary:**
  - Created `PrismStructure/tests/test-data/registerData.json` with:
    - `validUser` — API registration fields (includes nested `address` object)
    - `validUserUi` — UI registration fields (country label, house number, street, etc.)
    - `invalidEmail` — `"not-an-email"` for negative reference
    - `shortPassword` — `"abc"` for negative API test
  - Created `PrismStructure/tests/test-data/checkoutData.json` with invoice billing fields from the assignment document
  - Added `PrismStructure/tests/helpers/apiTestData.js` to load JSON and expose builder functions
- **Validation Notes:**
  - Reviewed field names against ToolShop registration form (UI) and Swagger API schema (API)
  - UI country uses full label (e.g., `"India"`) in `validUserUi`
  - API address uses `"United States"` in `validUser.address.country`
  - API invoice uses `billing_country: "TG"` (ISO code) in `checkoutData.json`
  - `buildInvalidEmailPayload()` added but not automated — API accepts loose email format; `shortPassword` used in `TC_API_03b` instead

---

## Entry 2

- **Prompt:** I need dynamic email generation for registration tests that won't conflict on repeated runs. Show how to use `@faker-js/faker` in Playwright tests following the Prism Playwright Framework pattern.
- **AI Response Summary:**
  - Installed `@faker-js/faker` as dev dependency
  - Used CommonJS pattern (project uses `require`, not ES `import`):
    ```javascript
    const { faker } = require('@faker-js/faker/locale/en');
    email: faker.internet.email().toLowerCase()
    ```
  - Applied in:
    - `apiTestData.js` → `buildRegisterPayload()`, `buildShortPasswordPayload()`
    - `uiTestData.js` → `buildUiRegisterData()` for UI registration
  - Password kept dynamic via `TtnApi${Date.now()}!@#Xz` to avoid data-leak 422 errors
- **Validation Notes:**
  - `.toLowerCase()` added for consistent email format
  - `LoginPage.spec.js` uses `buildUiRegisterData()` (faker + `validUserUi` from JSON)
  - `uiAuth.js` uses `buildRegisterPayload()` to create fresh API users for `AddProduct` and `Checkout` UI tests
  - Faker not called directly inside spec files — kept in helper layer per Prism pattern

---

## Entry 3

- **Prompt:** What API request payload should I use for the ToolShop invoice POST call? The assignment document shows: `billing_street`, `billing_city`, `billing_state`, `billing_country: TG`, `billing_postal_code: 1234AA`, `payment_method: cash-on-delivery`, `cart_id`, `payment_details: {}`
- **AI Response Summary:**
  - Stored static billing fields in `checkoutData.json`
  - Added `createInvoiceBody(cartId)` in `apiTestData.js` — merges `checkoutData` + dynamic `cart_id`
  - `InvoiceApi.js` sends the payload via `POST /invoices` (HTTP client only, no test data logic)
  - Used in `TC_API_06` (`invoice.spec.js`) — full register → cart → invoice flow
- **Validation Notes:**
  - Payload matches assignment document exactly
  - `cart_id` set at runtime from `POST /carts` response (never hardcoded)
  - `payment_details: {}` required for cash-on-delivery
  - Live test returns `201` with `invoice_number` matching `/^INV-/`
  - `buildInvoicePayload` kept as alias for backward compatibility

---

## Implementation Map (prompt → code)

| Prompt output | File | Used by |
|---------------|------|---------|
| `registerData.json` | `tests/test-data/registerData.json` | `apiTestData.js`, `uiTestData.js` |
| `checkoutData.json` | `tests/test-data/checkoutData.json` | `apiTestData.js` → `createInvoiceBody()` |
| Faker emails | `apiTestData.js`, `uiTestData.js` | API + UI registration tests |
| `shortPassword` negative | `buildShortPasswordPayload()` | `TC_API_03b` in `auth.spec.js` |
| Invoice body | `createInvoiceBody(cartId)` | `TC_API_06` in `invoice.spec.js` |
