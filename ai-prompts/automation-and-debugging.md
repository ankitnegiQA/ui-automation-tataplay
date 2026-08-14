# AI Prompts – Automation and Debugging

## Overview
This document logs prompts used for developing the Prism Page Object Model (POM) structure, Playwright step definitions, API request utilities, and debugging test failures.

---

## Prompt Entry 1: POM & Page Class Generation

### Prompt
> "Create Playwright POM classes for PracticeSoftwareTesting checkout flow. Implement explicit wait mechanisms and double-click handling for the final invoice confirm button."

### AI Response Summary
* Provided `CheckoutPage.js` and `InvoicePage.js` with structured locators and methods.
* Added `confirmOrderTwice()` method:
  ```javascript
  async confirmOrderTwice() {
    await this.confirmButton.click();
    await this.page.waitForTimeout(500);
    await this.confirmButton.click();
  }