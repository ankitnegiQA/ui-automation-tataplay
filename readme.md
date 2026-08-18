# ToolShop E-Commerce — Playwright Automation

Playwright automation framework (Prism POM pattern) for [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/), covering **UI** and **API** test tiers with `@Smoke` and `@Regression` tags.


| Application        | URL                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| UI (ToolShop)      | [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/)                                           |
| API                | [https://api.practicesoftwaretesting.com/](https://api.practicesoftwaretesting.com/)                                   |
| API Docs (Swagger) | [https://api.practicesoftwaretesting.com/api/documentation](https://api.practicesoftwaretesting.com/api/documentation) |


---

## Project Structure

```
qa-ai-practical-assessment/
├── FunctionalTestCase.csv              # Manual test cases
├── requirements-and-risk-assessment.md # Requirements & risk analysis
├── project-info.md                     # AI workflow & project summary
├── readme.md                           # This file
├── ai-prompts/                         # Cursor AI prompt history
├── PrismStructure/                     # Playwright framework (Prism)
│   ├── Pages/                          # UI Page Object Model
│   │   ├── BasePage.js
│   │   ├── LoginPage.js
│   │   ├── UserRegestration.js
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   ├── OrderHistory.js
│   │   └── PomManager.js
│   ├── api/                            # API client layer
│   │   ├── ApiManager.js
│   │   ├── AuthApi.js
│   │   ├── CartApi.js
│   │   ├── InvoiceApi.js
│   │   └── productApi.js
│   ├── tests/
│   │   ├── ui/                         # UI specs (@Smoke / @Regression)
│   │   ├── api/                        # API specs (@Smoke / @Regression)
│   │   ├── helpers/                    # Test data & setup helpers
│   │   └── test-data/                  # JSON test data files
│   └── execution-reports/
│       └── final-run-evidence/         # Lightweight pass evidence (README + 2 PNGs)
├── playwright.config.ts
└── package.json
```

---

## Prerequisites

- **Node.js** 18 or higher
- **npm** 9+
- Internet access (tests run against the public ToolShop demo environment)

---

## Installation

```bash
# 1. Clone the repository
git clone <https://github.com/ShubhToTheNew/TTN_Assesment.git>
cd qa-ai-practical-assessment

# 2. Install dependencies
npm install

# 3. Install Playwright browser (Chromium only — sufficient for this project)
npx playwright install chromium
```

---

## Running Tests

### All tests

```bash
npm test
```

Runs all **10** automated tests (3 UI + 7 API).

### Smoke tests

```bash
npm run test:smoke
```

Runs tests tagged `@Smoke` — core happy-path checks (5 tests: 2 UI + 3 API).


| ID        | Test                        | Layer |
| --------- | --------------------------- | ----- |
| TC_UI_01  | User registration and login | UI    |
| TC_UI_02  | Add products to cart        | UI    |
| TC_API_01 | Register new user           | API   |
| TC_API_02 | Login and bearer token      | API   |
| TC_API_04 | Create empty cart           | API   |


### Regression tests

```bash
npm run test:regression
```

Runs tests tagged `@Regression` — full flows and negative cases (5 tests: 1 UI + 4 API).


| ID         | Test                               | Layer |
| ---------- | ---------------------------------- | ----- |
| TC_UI_03   | End-to-end checkout and invoice    | UI    |
| TC_API_03  | Login with invalid password (401)  | API   |
| TC_API_03b | Register with short password (422) | API   |
| TC_API_05  | Add product and verify cart        | API   |
| TC_API_06  | End-to-end register to invoice     | API   |


### UI only

```bash
npm run test:ui
```

Runs all 3 UI tests in Chromium.

### API only

```bash
npm run test:api
```

Runs all 7 API tests (no browser — uses Playwright `request` fixture).

---

## Test Data Location


| File                                               | Purpose                                                                |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| `PrismStructure/tests/test-data/registerData.json` | Valid API/UI user data, `invalidEmail`, `shortPassword`                |
| `PrismStructure/tests/test-data/checkoutData.json` | Invoice billing payload (assignment document values)                   |
| `PrismStructure/tests/helpers/apiTestData.js`      | API payload builders — `buildRegisterPayload()`, `createInvoiceBody()` |
| `PrismStructure/tests/helpers/uiTestData.js`       | UI registration builder — `buildUiRegisterData()`                      |
| `PrismStructure/tests/helpers/uiAuth.js`           | Creates fresh API user for UI cart/checkout tests                      |
| `PrismStructure/tests/helpers/testUser.js`         | Legacy seeded user (fallback reference only)                           |


**Dynamic data:** emails are generated with `@faker-js/faker` (`faker.internet.email().toLowerCase()`) to avoid duplicate-registration conflicts on repeated runs.

**API invoice payload example** (from `checkoutData.json`):

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "payment_details": {}
}
```

`cart_id` is injected at runtime by `createInvoiceBody(cartId)`.

---

## Reports & Evidence

### Final run evidence (Allure — 10/10 passed)

```
PrismStructure/execution-reports/final-run-evidence/
```


| File                            | Description                               |
| ------------------------------- | ----------------------------------------- |
| `README.md`                     | Run summary (date, suite list, 100% pass) |
| `allure-overview-10-passed.png` | Allure overview dashboard                 |
| `allure-suites-10-passed.png`   | API + Chromium suite breakdown            |


### Playwright HTML report

After test execution, the HTML report is generated locally at `PrismStructure/execution-reports/playwright-report/` (not committed — keeps the repo small).

Open the report:

```bash
npm run report
```

Allure reports (`allure-report/`, `allure-results/`) and UI invoice screenshots are also generated locally when you run tests; they are listed in `.gitignore`.

---

## Portal submission (small zip)

**Do not upload `node_modules/`** — evaluators run `npm install` themselves.

To create a lightweight zip from git-tracked files only (~250 KB):

```powershell
git archive -o TTN_Assessment.zip HEAD
```

Or zip the folder manually after excluding: `node_modules/`, `allure-report/`, `allure-results/`, `screenshots/`, `PrismStructure/screenshots/`, `PrismStructure/execution-reports/playwright-report/`, `.git/`.

---

## Important Notes

1. **Double confirm for invoice** — The ToolShop checkout requires pressing **Confirm twice**: once after selecting Cash on Delivery, and again to generate the invoice. This is handled in `Checkout.js` via `selectPaymentMethod()` and `confirmOrder()`.
2. **Fresh users per run** — UI cart/checkout tests create a new user via API (`uiAuth.js`) before login. Registration tests use faker-generated emails. Do not rely on hardcoded credentials.
3. **Billing address (UI)** — Only country, postal code, and house number are filled manually. Street/city/state are autofilled by postal-code lookup. Overwriting them can cause invoice API `422` errors.
4. **API product IDs** — Product IDs are fetched at runtime via `GET /products`. Never hardcode IDs — they change when the demo database resets.
5. **Password policy (API)** — Passwords must be strong and unique. Common passwords return `422` (data-leak check). Dynamic passwords use `TtnApi${Date.now()}!@#Xz`.
6. **Add to cart API endpoint** — Items are added via `POST /carts/{cartId}` with `{ product_id, quantity }`, not a separate `/products` sub-endpoint.
7. **Test tags** — Every automated test includes `@Smoke` or `@Regression` in its title for tiered execution via `npm run test:smoke` and `npm run test:regression`.
8. **Manual test cases** — See `FunctionalTestCase.csv` for manual functional coverage mapped to automation IDs.
9. **AI prompt history** — See `ai-prompts/` for requirement analysis, test design, test data, debugging, and documentation prompts used with Cursor AI.

---

## Test Coverage Summary


| Layer                | Smoke | Regression | Total  |
| -------------------- | ----- | ---------- | ------ |
| UI                   | 2     | 1          | 3      |
| API                  | 3     | 4          | 7      |
| **Automation total** | **5** | **5**      | **10** |
| Manual (CSV)         | 4     | 4          | 8      |


---

## Troubleshooting


| Issue                                        | Likely cause                       | Fix                                                        |
| -------------------------------------------- | ---------------------------------- | ---------------------------------------------------------- |
| Login fails with "Invalid email or password" | Stale seeded user in `testUser.js` | Tests use `uiAuth.js` / faker — pull latest code           |
| Invoice `422` on checkout                    | Billing country/address mismatch   | Use `fillBillingAddress()` defaults in `Checkout.js`       |
| API register `422` on password               | Weak or leaked password            | Use dynamic password from `apiTestData.js`                 |
| `CartApi is not a constructor`               | Import/export name mismatch        | Ensure `CartApi` class name matches `ApiManager.js` import |


---

## Tech Stack

- [Playwright](https://playwright.dev/) — UI + API automation
- [Prism POM](https://github.com/) pattern — Page Objects + API clients
- [@faker-js/faker](https://fakerjs.dev/) — dynamic test data
- [Cursor AI](https://cursor.com/) — test design & automation assistance

