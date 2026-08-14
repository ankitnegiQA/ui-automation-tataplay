# AI Prompts – Requirements and Planning

## Overview
This document logs all prompt interactions, AI responses, and human review notes related to requirement analysis, risk identification, test strategy, and scope definition for the **PracticeSoftwareTesting (Toolshop)** application.

---

## Prompt Entry 1: SUT & Scope Analysis

### Prompt
> "I am testing the PracticeSoftwareTesting e-commerce application (https://practicesoftwaretesting.com/ and its API documentation at https://api.practicesoftwaretesting.com/api/documentation). Analyze the primary user flows: User Registration, Login, Product Catalog, Cart Management, Cash on Delivery Checkout, and Invoice Generation. Identify the critical testing paths, boundary conditions, and risks associated with each flow."

### AI Response Summary
* **Core Flows Identified:**
  1. **Authentication:** User registration with auto-generated valid data and login token retrieval (JWT bearer token).
  2. **E2E Purchase Flow (UI):** Browse catalog, add items, update quantities, execute Cash on Delivery (CoD) checkout, and double-confirm to generate the invoice ID under "My Invoices".
  3. **API Lifecycle Flow:** Register account → Obtain Bearer Token → Create Cart → Fetch Products → Add Product to Cart → Post Invoice Generation Request.
* **Key Risks & Boundary Conditions:**
  * **Double Confirm Requirement:** UI checkout requires clicking the confirmation button twice to finalize invoice generation; single click leaves the order in a pending state.
  * **Token Expiration/Header Validation:** API calls require proper `Authorization: Bearer <token>` header format.
  * **Cart ID Persistence:** Mismatch between session cart ID and API cart ID during checkout payload generation.

### Validation Notes & Edits
* Verified SUT application behavior on `https://practicesoftwaretesting.com/`.
* Confirmed that clicking confirm twice on UI is indeed a specific business logic requirement for this assessment.
* Refined risk list to include API HTTP status code validations (200, 201, 401, 422).

---

## Prompt Entry 2: Test Strategy & Suite Partitioning

### Prompt
> "Formulate a test strategy separating UI and API suites into Smoke and Regression tiers using Playwright BDD Cucumber JS (Prism POM Framework). Ensure test cases are capped between 5 to 8 per type to remain maintainable."

### AI Response Summary
* Proposed tag-based structure: `@ui`, `@api`, `@smoke`, `@regression`, `@auth`, `@cart`, `@purchase`.
* **Smoke Suite:** Core happy path tests (UI registration/login, API token & cart generation).
* **Regression Suite:** E2E purchase flow, quantity updates, negative authentication scenarios, API payload validations.

### Validation Notes & Edits
* Approved the tag strategy as it maps cleanly to `cucumber.js` profile execution flags (`npm run test:smoke` / `npm run test:regression`).