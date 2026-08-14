# AI Prompts – Documentation and Summary

## Overview
This document records all AI prompt interactions, responses, human edits, and reflections used while generating overall project documentation, system setup guides, framework summaries, and reporting artifacts for the **ui-automation-tataplay** repository testing the Practice Software Testing e-commerce application.

---

## Prompt Entry 1: Framework Setup & Architectural Documentation

### Prompt
> "Generate documentation for the framework architecture and setup guide for the UI Automation TataPlay repository. The project uses Playwright, Cucumber BDD, JavaScript, and Page Object Model (POM) testing https://practicesoftwaretesting.com/. Outline prerequisites, folder structure, environment config in src/utility/Config.js, execution commands for @Smoke and @Regression, and report generation in test-results/."

### AI Response Summary
* Drafted initial project overview listing core capabilities: UI automation, API validation, screenshot/video capture on failure, and Cucumber JSON/HTML reporting.
* Provided framework directory layout detailing `src/feature`, `src/pom`, `src/steps`, `src/hooks/hooks.js`, and `src/utility` (`BrowserManager.js`, `Config.js`, `Helper.js`, `ReportGenerator.js`).
* Formatted execution commands (`npm run test:smoke`, `npm run test:regression`, `npx cucumber-js`).

### Edits Made & Validation
* **Edits Made:** Updated feature file names and Page Object Model (POM) files to match the exact project explorer layout:
  * **Feature Files:** `Authentication-Cart-Creation.feature`, `Bisect-Product-Selection-Invoice-...feature`, `First-Registration-Login.feature`, and `Second-End-to-EndPurchaseFlow.feature`.
  * **POM Files:** `AuthenticationPage.js`, `cartPage.js`, `loginPage.js`, `purchasePage.js`, and `registrationPage.js`.
  * **Prompts Directory:** Corrected folder naming to `ai-promts/` (as mapped in repository tree).
* **Reason for Edits:** Aligned documentation explicitly with actual project repository structure and codebase files.

---

## Prompt Entry 2: Project Info & AI Workflow Reflection

### Prompt
> "Draft a summary for project-info.md detailing how AI prompts were used across the testing lifecycle (requirements analysis, test design, automation, debugging, and documentation) while maintaining token efficiency and data privacy."

### AI Response Summary
* Summarized prompt strategy: Used lighter models (Auto/Composer) for prompt logs, CSV creation, and markdown formatting, reserving Sonnet model specifically for Playwright POM code and step definitions.
* Highlighted key testing safeguards: Redacted sensitive user credentials and API auth headers during prompting sessions.
* Included reflection on handling edge cases, specifically enforcing double-confirm clicks during checkout invoice generation.

### Edits Made & Validation
* Verified that execution artifacts are automatically saved into `test-results/screenshots`, `test-results/videos`, and `test-results/reports`.
* Confirmed that `FunctionalTestCase.csv`, `project-info.md`, and `README.md` are correctly located at the root directory level.