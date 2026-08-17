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
* Screenshot Capture for Every UI Scenario
* Video Recording
* Cucumber JSON Reporting
* Final HTML Execution Report Generation

---

## Framework Architecture

```text
ui-automation-tataplay
|-- package.json
|-- cucumber.js
|-- project-info.md
|-- ai-prompts/
`-- PrismStructure/
    |-- Pages/
    |   `-- tataPlayPage.js
    |-- api/
    |-- tests/
    |   |-- ui/
    |   |   `-- TataPlay-UI-End-to-End.feature
    |   |-- api/
    |   |   `-- TataPlay-API-End-to-End.feature
    |   |-- helpers/
    |   |   |-- Config.js
    |   |   |-- Helper.js
    |   |   |-- tataUtility.js
    |   |   |-- browser/
    |   |   |-- hooks/
    |   |   |-- reporting/
    |   |   `-- steps/
    |   `-- test-data/
    |-- screenshots/
    `-- execution-reports/
```

## QA AI Capability Exercise - Practice Software Testing

### Overview & Prerequisites

- **Project:** Playwright + BDD Cucumber JS test framework using Prism POM architecture for [PracticeSoftwareTesting](https://practicesoftwaretesting.com/).
- **Prerequisites:** Node.js (v18+), Git, and VS Code with Cursor / Claude AI integration.

### Setup & Configuration

- **Installation:** Clone repo and run `npm install` followed by `npx playwright install --with-deps`.
- **Environment:** Manage base URLs, credentials, and API endpoints in `PrismStructure/tests/helpers/Config.js`.
- **AI Agent Setup:** Cursor rules, project skills, agent guidance, and MCP placeholders live under `.cursor/` and `AGENTS.md`.

### Test Execution Commands

- **All Tests:** Run `npm test` to execute Cucumber and generate the final HTML execution report.
- **Report Only:** Run `npm run report` to regenerate the HTML report from the latest Cucumber JSON.

### Structure & Artifacts

- **Test Data:** Manual cases, user data, and generated credentials live in `PrismStructure/tests/test-data/`.
- **Execution Reports:** JSON reports are generated in `PrismStructure/execution-reports/json`, final HTML reports in `PrismStructure/execution-reports/html`, videos in `PrismStructure/execution-reports/videos`, and UI scenario screenshots in `PrismStructure/screenshots`.
