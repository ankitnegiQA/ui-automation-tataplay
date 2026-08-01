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
ui-automation-tataplay
│
├── package.json
├── cucumber.js
├── playwright.config.js
│
├── src
│   ├── feature
│   │   ├── login.feature
│   │   └── contentApi.feature
│   │
│   ├── pom
│   │   ├── LoginPage.js
│   │   └── ContentApiPage.js
│   │
│   ├── steps
│   │   ├── LoginSteps.js
│   │   └── ContentApiSteps.js
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

---

# Prerequisites

Install the following:

* Node.js (v18 or higher recommended)
* Visual Studio Code
* Playwright Browsers

Verify installation:

```bash
node -v
npm -v
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to project:

```bash
cd ui-automation-tataplay
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

# Configuration

Update application details in:

```text
src/utility/Config.js
```

Example:

```javascript
module.exports = {
    baseUrl: "https://application-url.com",
    mobileNumber: "6686307715",
    otp: "9382"
};
```

---

# Running Tests

Execute all scenarios:

```bash
npm test
```

Execute a specific feature:

```bash
npx cucumber-js src/feature/login.feature
```

---

# Reporting

Generate HTML report:

```bash
npm run report
```

Generated reports:

```text
test-results/reports/html-report
```

---

# Screenshot Capture

Screenshots are automatically captured when a scenario fails.

Location:

```text
test-results/screenshots
```

---

# Video Recording

Video recording is enabled for every execution.

Location:

```text
test-results/videos
```

---

# API Testing

The framework supports API validation using Playwright Request Context.

Example validations:

* Status Code Validation
* Response Body Validation
* Field-Level Assertions
* Header Validation

Sample API validations:

```javascript
assert.strictEqual(content.vodId, 3358624);
assert.strictEqual(content.brandTitle, '');
assert.strictEqual(content.vodTitle, 'Bee Movie');
```

---

# Framework Design Pattern

The framework follows the Page Object Model (POM) design pattern.

Benefits:

* Reusable code
* Better maintainability
* Easy locator management
* Reduced duplication
* Improved readability

---

# Best Practices

* Store reusable locators inside Page Objects.
* Keep test data in Config.js.
* Use explicit waits instead of hard waits whenever possible.
* Capture screenshots only on failure.
* Keep feature files business-readable.
* Maintain one responsibility per page object.

---

# Future Enhancements

* Cross-browser execution
* Parallel execution
* Jenkins Integration
* GitHub Actions CI/CD
* Allure Reporting
* Data-Driven Testing
* Environment-based execution
* API Utilities Library
* Retry Mechanism

---

# Author

QA Automation Framework built using Playwright, Cucumber, JavaScript, and Page Object Model architecture.
README.md