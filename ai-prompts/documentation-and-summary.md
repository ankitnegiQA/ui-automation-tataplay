# AI Prompts – Documentation and Summary

(Prompts used for writing README, `project-info.md`, reports, and folder structure.)

---

## Entry 1

- **Prompt:** Format folder structure per QA assessment — PrismStructure for UI + API automation.
- **AI Response Summary:**
  - Organized `Pages/`, `api/`, `tests/ui/`, `tests/api/`, `tests/helpers/`, `tests/test-data/`
  - Added `execution-reports/`, `screenshots/`, `FunctionalTestCase.csv`, and `ai-prompts/` folder
  - Updated `playwright.config.ts` with separate `api` and `chromium` projects
- **Edits You Made:** Added `@Smoke` / `@Regression` tags to UI specs; renamed tests with `TC_UI_*` / `TC_API_*` IDs; moved all framework code under `PrismStructure/`.
- **Reason for Edits:** Assessment requires traceable structure, tagged tiers, separated UI/API layers, and execution evidence paths.

---

## Entry 2

- **Prompt:** Write a `project-info.md` covering: AI tools used, how context was provided to AI, how AI was used for requirements/planning/test design/automation/debugging, what data was not shared with AI.
- **AI Response Summary:**
  - Generated a 10-section `project-info.md` aligned to the assessment Part A template:
    1. How context was provided to AI (focused chats, `@` file references, error logs)
    2. Requirements analysis (AC1/AC2 breakdown, double-confirm flag, endpoint mapping)
    3. Test planning and strategy (smoke vs regression table for UI + API)
    4. Manual test case design (`FunctionalTestCase.csv` traceability)
    5. Automation design (`Pages/`, `api/`, helpers, model selection Auto vs Sonnet)
    6. Validation and refinement (table of AI mistakes caught and fixed)
    7. Test data generation (JSON + faker approach)
    8. Debugging (billing 422, CartApi typos, stale credentials)
    9. What was **not** shared with AI (passwords, tokens, secrets, unrelated code)
    10. Reuse workflow for real projects (9-phase repeatable process)
  - Included project summary, tools table, SUT URLs, and coverage-at-a-glance
- **Edits You Made:**
  - Replaced generic AI descriptions with **actual project details** (real test IDs, real file paths, real bugs fixed)
  - Added refinement table documenting wrong API endpoint (`/carts/{id}/products` → `/carts/{cartId}`), billing `422` fix, and `CartApi` naming fix
  - Linked each section to corresponding `ai-prompts/` files for cross-reference
  - Left `Submission Date` as `_TBD_` for manual update before submission
- **Reason for Edits:** Assessment evaluators check that `project-info.md` reflects real work done — not generic AI boilerplate. Specific test IDs, file names, and debugging examples demonstrate ownership and validation of AI output.

---

## Entry 3

- **Prompt:** Generate a `README.md` for a Playwright automation project covering ToolShop e-commerce. Include: project structure, prerequisites, installation, how to run smoke vs regression tests, test data location, and important notes. Use the npm script names: `test`, `test:smoke`, `test:regression`, `test:ui`, `test:api`.
- **AI Response Summary:**
  - Generated `readme.md` with:
    - Full `PrismStructure/` project tree (Pages, api, tests/ui, tests/api, helpers, test-data)
    - Prerequisites (Node 18+, npm, internet)
    - Installation steps (`npm install`, `npx playwright install chromium`)
    - Run commands using requested script names with test count tables per tier
    - Test data location table (`registerData.json`, `checkoutData.json`, helper files)
    - Important notes (double confirm, fresh users, billing 422, dynamic product IDs, password policy)
    - Reports path, troubleshooting table, tech stack
  - Updated `package.json` scripts to match requested names:
    ```json
    "test": "playwright test",
    "test:smoke": "playwright test --grep @Smoke",
    "test:regression": "playwright test --grep @Regression",
    "test:ui": "playwright test --project=chromium",
    "test:api": "playwright test --project=api"
    ```
- **Edits You Made:**
  - Added smoke/regression **test ID tables** (`TC_UI_01`–`TC_UI_03`, `TC_API_01`–`TC_API_06`, `TC_API_03b`) so evaluators can see exact coverage per command
  - Added invoice payload JSON example from `checkoutData.json` for quick reference
  - Added troubleshooting section with real failures encountered during development
  - Replaced `<your-repo-url>` placeholder — to be updated with actual public Git URL before submission
  - Removed older script names (`test:all`, `test:api:smoke`, etc.) in favour of the 5 requested scripts
- **Reason for Edits:** README must be runnable without guesswork — exact script names, test counts, and file paths let an evaluator clone and execute immediately. Troubleshooting section documents known demo-environment issues honestly.

---

## Documentation Map

| File | Prompt entry | Purpose |
|------|--------------|---------|
| `project-info.md` | Entry 2 | Part A — AI workflow and assessment reflection |
| `readme.md` | Entry 3 | Setup, run commands, test data, important notes |
| `FunctionalTestCase.csv` | Entry 1 (structure phase) | Manual test traceability |
| `ai-prompts/` | All entries | Full prompt history for evaluators |
