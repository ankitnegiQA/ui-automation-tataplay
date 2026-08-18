# AI Prompts – Requirements and Planning

(Record prompts and responses used for understanding the Toolshop flow, identifying risks, and drafting the test plan.)

---

## Entry 1

- **Prompt:** Act as a Senior SDET. I have a QA assignment to automate tests for https://practicesoftwaretesting.com (ToolShop e-commerce). The assignment requires Playwright automation. Analyze the following acceptance criteria and identify all testable scenarios: **AC1:** User should be able to register with valid details, log in using the registered credentials, and verify their profile successfully. **AC2:** User should be able to browse products, add multiple items to the cart, complete checkout using Cash on Delivery, and successfully view the generated invoice under My Invoices. **Note:** press confirm button twice to generate invoice.
- **AI Response Summary:**
  - Identified UI scenarios across registration, login, cart, checkout, and invoice verification
  - Flagged the **double-confirm** requirement as a critical checkout detail (first confirm = payment step, second confirm = invoice generation)
  - Suggested `@Smoke` for core happy paths and `@Regression` for full E2E
  - Scoped automation to assessment limit (5–8 tests per tier) — prioritised highest-value flows over exhaustive edge-case coverage
- **Validation Notes:**
  - Cross-checked scenarios against the live application at practicesoftwaretesting.com
  - Confirmed double-confirm flow manually and encoded in `Checkout.js` (`selectPaymentMethod` → `confirmOrder`)
  - **Automated UI mapping (3 tests):**

    | Scenario | Automation ID | Tag |
    |----------|---------------|-----|
    | Register + login with valid details | `TC_UI_01` | @Smoke |
    | Add multiple products to cart (Pliers, Hammer) | `TC_UI_02` | @Smoke |
    | Full checkout COD + invoice in My Invoices | `TC_UI_03` | @Regression |

  - **Descoped from automation** (covered in manual `FunctionalTestCase.csv` or deferred):
    - Separate profile-page verification (login success assertion used instead)
    - Product search and standalone product-detail tests
    - Dedicated quantity-update test (quantity covered implicitly in cart flow)
    - Additional negative UI registration cases (covered at API layer)

---

## Entry 2

- **Prompt:** For the same ToolShop assignment, analyze the API documentation at https://api.practicesoftwaretesting.com/api/documentation and identify the full API test flow for: 1) User Auth (register + login + token), 2) Product listing, 3) Cart creation and product addition, 4) Invoice generation. Map each to specific HTTP endpoints.
- **AI Response Summary:**
  - Mapped auth lifecycle:
    - `POST /users/register` → `201`
    - `POST /users/login` → `200` + `access_token` (Bearer token)
  - Mapped product + cart:
    - `GET /products?per_page=1` → retrieve `product_id` at runtime
    - `POST /carts` → `cartId`
    - `POST /carts/{cartId}` with `{ product_id, quantity }` → add item
    - `GET /carts/{cartId}` → verify cart contents
  - Mapped invoice:
    - `POST /invoices` with assignment billing payload + dynamic `cart_id` → `201` + `invoice_number`
  - Identified negative scenarios: invalid login (`401`), short password on register (`422`)
- **Validation Notes:**
  - Verified endpoints against Swagger and live API calls
  - Corrected add-to-cart endpoint to `POST /carts/{cartId}` (not `/carts/{id}/products` as initially suggested)
  - Confirmed invoice payload fields match assignment example (`billing_country: "TG"`, `1234AA`)
  - **Automated API mapping (7 tests):**

    | Scenario | Automation ID | Tag |
    |----------|---------------|-----|
    | Register with valid payload | `TC_API_01` | @Smoke |
    | Login and receive bearer token | `TC_API_02` | @Smoke |
    | Login with invalid password | `TC_API_03` | @Regression |
    | Register with short password | `TC_API_03b` | @Regression |
    | Create empty cart | `TC_API_04` | @Smoke |
    | Add product and verify cart | `TC_API_05` | @Regression |
    | End-to-end register → invoice | `TC_API_06` | @Regression |

  - Framework structure: `api/AuthApi.js`, `CartApi.js`, `InvoiceApi.js`, `productApi.js` managed via `ApiManager.js`

---

## Entry 3

- **Prompt:** Create a risk analysis for the ToolShop application. What are the highest-risk areas for regression?
- **AI Response Summary:**
  - **Critical Risk:** Checkout flow — double-confirm, billing address validation, invoice API `422` on mismatched country/address
  - **High Risk:** Authentication — token handling, duplicate registration, invalid credentials, password policy (`422` on weak/leaked passwords)
  - **Medium Risk:** Cart persistence — product ID changes after DB reset, cart item quantity accuracy
  - **Low Risk:** Static navigation, product listing page layout
- **Validation Notes:**
  - Agreed with AI risk ranking and aligned test priority accordingly
  - Prioritised **`TC_UI_03`** (full E2E checkout + invoice) as Critical — tagged `@Regression`
  - Prioritised **`TC_API_06`** (full API invoice lifecycle) as Critical — tagged `@Regression`
  - Negative auth covered in regression: `TC_API_03` (401), `TC_API_03b` (422)
  - Checkout billing fix validated — only fill country/postcode/house number to avoid overwriting autofilled address (prevents invoice `422`)

---

## AC Traceability Summary

| Acceptance Criteria | UI Automation | API Automation | Manual CSV |
|---------------------|---------------|----------------|------------|
| AC1 — Register, login, verify user | `TC_UI_01` | `TC_API_01`, `TC_API_02`, `TC_API_03`, `TC_API_03b` | `TC_MAN_01`, `TC_MAN_02` |
| AC2 — Browse, cart, checkout, invoice | `TC_UI_02`, `TC_UI_03` | `TC_API_04`, `TC_API_05`, `TC_API_06` | `TC_MAN_03`, `TC_MAN_04` |

**Smoke total:** 5 automated (2 UI + 3 API)  
**Regression total:** 5 automated (1 UI + 4 API)  
**Grand total:** 10 automated + 8 manual cases
