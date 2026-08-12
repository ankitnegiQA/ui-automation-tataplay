# UI Automation TataPlay

## Project Overview

UI Automation TataPlay is a test automation framework built using:

* Playwright
* Cucumber (BDD)
* JavaScript
* Page Object Model (POM)

The framework supports:

* UI Automation Testing
* API Validation Testing
* Screenshot Capture on Failure
* Video Recording
* Cucumber JSON Reporting
* HTML Report Generation

---

# Framework Architecture

```text
ui-automation-practicesoftwaretesting
│
├── package.json
├── cucumber.js
├── playwright.config.js
│
├── src
│   ├── feature
│   │
│   ├── pom
│   │
│   ├── steps
│   │
│   ├── hooks
│   │   └── hooks.js
│   │
│   └── utility
│       ├── BrowserManager.js
│       ├── Config.js
│       ├── Helper.js
│       └── ReportGenerator.js
│
└── test-results
    ├── screenshots
    ├── videos
    ├── reports
    └── logs
```
# QA AI Capability Exercise — Practice Software Testing

## Overview & Prerequisites
- **Project:** Playwright + BDD Cucumber JS test framework using Prism POM architecture for [PracticeSoftwareTesting](https://practicesoftwaretesting.com/).
- **Prerequisites:** Node.js (v18+), Git, and VS Code with Cursor / Claude AI integration.

## Setup & Configuration
- **Installation:** Clone repo and run `npm install` followed by `npx playwright install --with-deps`.
- **Environment:** Manage base URLs, credentials, and API endpoints in `src/utility/Config.js`.

## Test Execution Commands
- **Smoke Suite:** Run `npm run test:smoke` (Executes `@Smoke` UI and API test cases).
- **Regression Suite:** Run `npm run test:regression` (Executes `@Regression` UI and API test cases).
- **All Tests:** Run `npm test` or `npx cucumber-js`.

## Structure & Artifacts
- **Test Artifacts & Prompts:** Find manual cases in `FunctionalTestCase.csv`, workflow info in `project-info.md`, and prompt logs in `ai-prompts/`.
- **Execution Reports:** HTML reports, failure screenshots, and logs are automatically generated in `test-results/`.