# Architecture Decisions

This file captures stable technical decisions for the `as-e2e` project.
Use it as long-lived memory. Put transient troubleshooting in a separate history log.

---

## ADR-0001: Test stack and style

- **Date:** 2026-04-24
- **Status:** Accepted
- **Context:** The project validates end-to-end and API behavior for C3/Softcar flows.
- **Decision:** Use Playwright + BDD-style feature/steps organization:
    - Feature files under `features/`
    - Step definitions under `src/steps/`
    - Shared support and environment setup under `src/support/`
    - Page objects under `pages/`
- **Consequences:**
    - Clear separation between behavior specs and implementation.
    - Reusable step/support code across scenarios.
    - Requires strict naming and folder discipline.

---

## ADR-0002: Environment and secret handling

- **Date:** 2026-04-24
- **Status:** Proposed
- **Context:** API and auth flows depend on environment-specific credentials and URLs.
- **Decision:** Centralize env resolution/validation in `src/support/envSetup.ts` and `src/support/c3env.ts`.
- **Consequences:**
    - Fewer hidden assumptions in steps/tests.
    - Faster failure when required vars are missing.
    - Need to keep variable contract documented.

---

## ADR-0003: API client boundary

- **Date:** 2026-04-24
- **Status:** Proposed
- **Context:** Softcar API interaction logic should not be duplicated across steps.
- **Decision:** Keep request composition and transport logic in `src/support/api/c3SoftcarClient.ts`; step files orchestrate behavior only.
- **Consequences:**
    - Better reuse and easier mocking.
    - Cleaner, shorter step definitions.
    - Client contract changes may affect many scenarios at once.

---

## ADR-0004: Test data ownership

- **Date:** 2026-04-24
- **Status:** Proposed
- **Context:** Scenario reliability depends on consistent test data.
- **Decision:** Keep deterministic fixtures in `src/fixtures/softcarData.ts`; avoid inline literals in step files where possible.
- **Consequences:**
    - Easier refactoring and review.
    - Reduced drift between scenarios.
    - Requires fixture versioning as APIs evolve.

---

## ADR-0005: Session memory process

- **Date:** 2026-04-24
- **Status:** Accepted
- **Context:** Valuable Q/A context from prior sessions should be reusable.
- **Decision:**
    - Keep durable decisions in this ADR file.
    - Keep chronological Q/A in `doc/agent-history.md`.
    - Promote recurring conclusions from history into new ADR entries.
- **Consequences:**
    - Better continuity across sessions.
    - Less repeated debugging/discovery.
    - Requires lightweight maintenance after each meaningful task.

---

## ADR Template (copy/paste)

## ADR-XXXX: <short title>

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded
- **Context:** <why this decision is needed>
- **Decision:** <what we decided>
- **Consequences:** <trade-offs, risks, follow-ups>
- **References:** `<path/to/file.ts>`, `<feature/file.feature>`