# Project Info: AI-Driven QA Automation Workflow

This document outlines the **AI Workflow Foundation** and project specifications for the automated and manual testing suite targeting **Practice Software Testing** (eCommerce SUT). It covers how AI (Claude integrated with VS Code and OpenSpec) is practically and governed-ly leveraged across the entire Quality Assurance lifecycle.

---

## 1. Project Overview & System Under Test (SUT)

### System Under Test
* **UI Application:** [https://practicesoftwaretesting.com/](https://practicesoftwaretesting.com/)
* **API Documentation:** [https://api.practicesoftwaretesting.com/api/documentation](https://api.practicesoftwaretesting.com/api/documentation)
* **Application Type:** eCommerce web application for tools, hardware, and home improvement equipment.

### Business & Functional Scope
* **User Authentication & Profile:** User registration, login, profile verification, and authorization token handling.
* **Product Catalog & Search:** Product browsing, searching, filtering by category/brand, and view detail pages.
* **Cart & Checkout Flow:** Item addition, quantity update, stock validation, checkout via Cash on Delivery (COD) / Credit Card.
* **Order & Invoice Lifecycle:** Double-confirmation requirement for invoice generation (`press confirm twice` rule for SUT invoice generation), order history viewing under "My Invoices".
* **Backend API Integration:** Direct REST API consumption for user creation, token generation, cart management, and invoice creation.

---

## 2. Primary AI Tools & Setup Integration

* **Primary AI Engine:** **Claude** (Claude 3.5 Sonnet / Claude 3 Opus) integrated natively into **Visual Studio Code** via **Cursor / OpenSpec**.
* **Framework Architecture:** **Playwright + Cucumber JS (BDD)** in JavaScript following the Page Object Model (POM) pattern.
* **Control & Governance Mechanism:** **OpenSpec Standard Operating Procedures (SOP)** to strictly control AI behavior before code modification, proposals, or pull requests.

---

## 3. System Context & SUT Grounding

To prevent hallucinations and secure deterministic outputs, context is provided to Claude/Cursor using structured local repository context:

1. **System Architecture Rules (`.cursorrules` / `.cursor/rules`):**
   * Pre-loads the BDD directory structure (`src/feature`, `src/pom`, `src/steps`, `src/utility`).
   * Enforces coding standards (JavaScript ES6+, async/await Playwright locators, strict Page Object Model encapsulation).
2. **OpenSpec Proposal Framework:**
   * AI is strictly forbidden from editing source files directly without an approved proposal spec (`openspec proposal`).
   * Context includes SUT quirks (e.g., *Double Confirm button click required for Invoice Generation*).
3. **API & DOM Documentation Injection:**
   * OpenAPI/Swagger JSON specs provided to AI for precise payload structure.
   * Captured DOM snapshots passed for accurate Playwright locators (`data-test` attributes prioritized).

---

## 4. AI for Requirement & Risk Analysis

AI is utilized to extract state-machine transitions and potential failure points from user stories:

* **Acceptance Criteria Parsing:** Converts business ACs into structured boundary matrices and state transition diagrams.
* **SUT Risk Assessment:**
  * **Critical Risk:** Invoice generation failure due to single click vs. double click logic.
  * **Cart Session Risk:** Token expiry during checkout transitions.
  * **Concurrency Risk:** Stock inventory updates when placing simultaneous orders.
* **Scope Optimization:** Automatically categorizes scenarios into `@Smoke` and `@Regression` tags while enforcing the strict cap of **5–8 high-impact test cases per suite**.

---

## 5. AI for Test Planning & Strategy

AI aids in defining a balanced pyramid strategy for UI vs API:

| Category | UI Tier (Playwright BDD) | API Tier (Playwright Request) |
| :--- | :--- | :--- |
| **Smoke Suite** (5–8 cases) | Critical E2E path (Login -> Add Cart -> Double Confirm Invoice) | User Registration -> Token Generation -> Health Check |
| **Regression Suite** (5–8 cases) | Edge cases, form field validation, cart manipulation | Detailed payload verification, status codes, field-level assertions |
| **Execution Trigger** | BDD tags (`@Smoke`, `@Regression`) via `cucumber.js` | Direct API Request Context via `src/utility` |

---

## 6. AI for Manual Test Case Design

AI prompts generate standard CSV-formatted manual test cases covering:
* **Positive Flows:** Successful registration, multi-item checkout with Cash on Delivery.
* **Negative Flows:** Login with invalid credentials, checkout with empty cart, checkout with missing mandatory billing fields.
* **Edge Cases & SUT Specifics:**
  * Single-click invoice submission (verifying invoice is NOT created until 2nd click).
  * Rapid double-clicking on payment submission buttons.
  * Out-of-bounds postal code formats (`1234AA` vs invalid string).

---

## 7. AI for Automation Design & Architecture

AI is used to enforce architectural integrity in the Playwright-Cucumber framework:

```
ui-practice-software-testing/
├── package.json
├── cucumber.js
├── playwright.config.js
├── src/
│   ├── feature/               # Gherkin .feature files (@Smoke, @Regression)
│   ├── pom/                   # Page Object Models (LoginPage, CartPage, CheckoutPage)
│   ├── steps/                 # Step Definitions mapping Gherkin to POM
│   ├── hooks/                 # hooks.js (Browser lifecycle, failure screenshots/videos)
│   └── utility/               # Config.js, BrowserManager.js, Helper.js, ReportGenerator.js
└── test-results/             # Screenshots, videos, HTML reports, logs
```

### Automation Guidelines Enforced by AI
* **Page Object Model (POM):** Dynamic locators using `page.locator('[data-test="..."]')`. No hardcoded selectors in step definitions.
* **Explicit Waits:** Replaces arbitrary timeouts (`page.waitForTimeout`) with Playwright auto-waiting and state assertions.
* **Reusable API Utilities:** Playwright `request` context for direct REST API calls.

---

## 8. AI Output Validation & Iterative Refinement Process

To guarantee code quality and prevent breaking changes, an **Iterative Refinement SOP** is enforced:

1. **Prompt & Proposal:** Request AI to generate a spec proposal before touching any code.
2. **Review Proposal:** Verify locator strategies and BDD step mappings.
3. **Controlled Apply:** Approve proposal for AI code generation.
4. **Dry Run Execution:** Execute `npm test` / `npx cucumber-js` locally.
5. **Human Code Review:**
   * Check for hardcoded credentials (must use `Config.js`).
   * Ensure screenshot capture on failure is preserved in `hooks.js`.
   * Verify double-confirm step logic on invoice completion.

---

## 9. AI for Test Data Generation & Environment Configuration

AI generates realistic mock data conforming to SUT API constraints:

* **Dynamic Data Generation:** Standardized Faker-like payload templates for street, city, state, postal code, and cart dynamic IDs.
* **Sample API Payload (Invoice Post Call):**
  ```json
  {
    "billing_street": "Zoey Shore",
    "billing_city": "Hesselbury",
    "billing_state": "Florida",
    "billing_country": "TG",
    "billing_postal_code": "1234AA",
    "payment_method": "cash-on-delivery",
    "cart_id": "01kx0dctdxxg6sm4wtt1t0nf9r",
    "payment_details": {}
  }
  ```
* **Config Encapsulation:** Centralizing environments, base URLs, and test accounts inside `src/utility/Config.js`.

---

## 10. AI for Debugging & Log Interpretation

* **Trace & Log Parsing:** AI reads Playwright failure traces, console logs, and Cucumber report outputs from `test-results/logs`.
* **Root Cause Analysis (RCA):**
  * Identifies flaky locators or timing issues.
  * Pinpoints exact assertions failing (e.g., `assert.strictEqual(content.vodId, 3358624)` vs actual returned ID).
* **Automated Fix Generation:** Proposes minimal patch diffs to fix selectors or step definitions without rewriting full files.

---

## 11. Data Privacy & AI Governance (What NOT to Share)

To ensure security and compliance, the following information is strictly masked/redacted before sending context to AI tools:

1. **Live Production Credentials:** Real user passwords, API tokens, production database strings.
2. **PII (Personally Identifiable Information):** Real customer data or payment information.
3. **Proprietary Security Keys:** Internal certificates, JWT secret keys, and CI/CD secret tokens.
4. **Internal Network Maps:** Internal IP addresses, non-public staging domain architectures.

---

## 12. Reusability & Scalability in Real-World Enterprise Projects

This AI-driven QA framework and workflow can be re-used across projects by:

1. **Standardizing OpenSpec Prompt Rules:** Copying `.cursorrules` and AI prompt templates (`ai-prompts/`) to new repositories.
2. **Modular Utility Layer:** Reusing core helper classes (`BrowserManager.js`, `ReportGenerator.js`, Playwright API Request wrapper).
3. **Standard SOP Execution:** Standardizing the developer/QA workflow: **Proposal -> Human Review -> Iterative Apply -> Local Run -> Commit/PR**.
4. **CI/CD Integration Pipeline:** Integrating headless Playwright execution into GitHub Actions/Jenkins with automated HTML report artifact generation.
