# GitHub Copilot – Project Instructions for as-e2e

## Session Memory

At the **start of every session**, always:
1. Read `doc/agent-history.md` and `doc/architecture-decisions.md` as context before answering or making changes.
2. Use the history entries to inform design suggestions, avoid re-doing solved problems, and stay consistent with prior decisions.

When the user says **"wrap up"**, **"end session"**, or **"save session"**, always:
1. Append a new session entry to `doc/agent-history.md` using the template in `doc/agent-history-template.md`.
2. Fill in all sections: Metadata, Context Snapshot, Questions Asked, Answers Provided, Decisions Made, Implementation Notes, File References, Validation, Risks/Unknowns, Open Items, Carry-Forward Prompt, ADR Promotion Check.
3. If a durable architectural decision was made, add or update an ADR entry in `doc/architecture-decisions.md`.
4. Do this automatically without asking for confirmation.

## Project Context

- Stack: Playwright + BDD (Cucumber-style), TypeScript
- Feature files: `features/`
- Step definitions: `src/steps/`
- Page objects: `pages/`
- API client: `src/support/api/c3SoftcarClient.ts`
- Environment setup: `src/support/envSetup.ts`, `src/support/c3env.ts`
- Fixtures: `src/fixtures/`
- Auth setup: `src/support/auth.setup.ts`

