# AI Prompts – Test Design

## Overview
This document logs AI prompts and outputs used to generate manual functional test cases, UI BDD scenarios, and API lifecycle test scenarios.

---

## Prompt Entry 1: Manual Test Case Generation (CSV)

### Prompt
> "Generate 6-8 structured test cases covering UI and API flows for PracticeSoftwareTesting in CSV format. Include Test ID, Feature, Scenario, Type (UI/API), Suite (Smoke/Regression), Steps, Expected Result, and Tags."

### AI Response Summary
* Generated 6 distinct test cases:
  1. `TC-UI-01`: UI User Registration (`@ui`, `@smoke`, `@reg`)
  2. `TC-UI-02`: UI Login Verification (`@ui`, `@smoke`, `@login`)
  3. `TC-UI-03`: UI E2E Purchase with CoD & Double Confirm (`@ui`, `@regression`, `@purchase`)
  4. `TC-API-01`: API User Registration & Token Retrieval (`@api`, `@smoke`, `@auth`)
  5. `TC-API-02`: API Product Retrieval & Cart Addition (`@api`, `@smoke`, `@cart`)
  6. `TC-API-03`: API Invoice Generation with Valid Payload (`@api`, `@regression`, `@invoice`)

### Validation Notes & Edits
* Ensured step-by-step clarity in `TC-UI-03` specifically noting the "press confirm button twice" requirement.
* Formatted directly into `FunctionalTestCase.csv`.

---

## Prompt Entry 2: Feature File Gherkin Design

### Prompt
> "Convert the test scenarios into BDD Gherkin syntax (.feature files) compatible with Cucumber JS and Playwright."

### AI Response Summary
* Generated two feature files:
  * `user_auth_cart.feature` (API Scenarios)
  * `e2e_purchase.feature` (UI Scenarios)

### Validation Notes & Edits
* Verified background setup hooks (`Given User is authenticated...`) for clean scenario isolation.