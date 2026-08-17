# Agent Instructions

This repository is a Playwright + Cucumber JS BDD automation framework for Practice Software Testing.

## Architecture

- Feature files live in `src/feature`.
- Step definitions live in `src/steps`.
- Page objects and API workflow logic live in `src/pom`.
- Browser lifecycle, screenshots, and cleanup live in `src/hooks`.
- Config, reporting, generated data, and helpers live in `src/utility`.

## Expectations

- Keep step definitions thin and business-readable.
- Prefer `data-test` locators and Playwright auto-waiting.
- Preserve screenshots for every UI scenario and final HTML report generation after execution.
- Do not commit secrets, tokens, PII, or live production credentials.
- Validate framework wiring with `npm test -- --dry-run` after hook, report, or runner changes.
