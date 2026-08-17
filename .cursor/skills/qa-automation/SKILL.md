---
name: qa-automation
description: Use when adding, updating, or debugging Playwright + Cucumber JS BDD automation in this repository, including feature files, step definitions, page objects, hooks, API request flows, screenshots, videos, Cucumber JSON output, and HTML execution reports.
---

# QA Automation Skill

## Workflow

1. Inspect the feature, step, page object, hook, and utility files related to the requested change.
2. Keep changes inside the existing Prism/POM style:
   - Gherkin stays in `src/feature`.
   - Cucumber bindings stay in `src/steps`.
   - UI/API behavior and assertions stay in `src/pom`.
   - Browser lifecycle, screenshots, and scenario artifacts stay in `src/hooks`.
   - Shared config, reporting, data, and helpers stay in `src/utility`.
3. Prefer small, scenario-focused edits over broad rewrites.
4. Keep API setup in Playwright request contexts and UI setup in browser/page contexts.
5. Preserve scenario artifacts:
   - Full-page screenshots for each UI scenario.
   - Video recording under `test-results/videos`.
   - Cucumber JSON under `test-results/reports/json`.
   - HTML report under `test-results/reports/html`.
6. Validate with `node --check` for changed JavaScript files and `npm test -- --dry-run` for framework wiring.

## Coding Patterns

- Use `page.locator('[data-test="..."]')` when available.
- Use Playwright `expect` assertions instead of manual polling.
- Keep Cucumber steps readable and business-oriented.
- Use generated test data for registration and checkout flows.
- Avoid committing secrets or live account credentials.

## SUT Notes

- Base UI: `https://practicesoftwaretesting.com/`
- Base API: `https://api.practicesoftwaretesting.com`
- Checkout invoice generation may require confirming twice; preserve this behavior when touching purchase flows.
