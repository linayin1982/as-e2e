# Agent History

Chronological notes from working sessions. Keep entries brief and searchable.
Promote stable outcomes into `doc/architecture-decisions.md`.

---

## 2026-04-24 - Session 001

### Metadata
- **Owner:** ab000419
- **Project Area:** infra / process
- **Branch:** n/a (docs only)
- **Commit (start):** n/a
- **Session Goal:** Establish a project memory system for storing Q&A and architecture decisions across sessions.

### Context Snapshot
- **What changed before this session:** No existing memory/history docs.
- **Constraints / assumptions:** Work is in the `as-e2e` Playwright/BDD project.
- **Inputs used:** Workspace file tree, prior conversations in this session.

### Questions Asked
1. Is there a way to automatically store questions and answers to a file so future sessions can refer to them?
2. Can you generate a proper session template format into an attached file for future reference?
3. How to make session answers automatically stored into `doc/agent-history.md`?

### Answers Provided (Condensed)
1. No automatic capture is built-in, but storing history in repo markdown files (`doc/agent-history.md` + `doc/architecture-decisions.md`) is the most reliable and durable pattern. At session start, reference both files explicitly.
2. A template was generated in `doc/agent-history-template.md` with sections for metadata, context, Q&A, decisions, implementation notes, file references, validation, risks, open items, carry-forward prompt, and ADR promotion check.
3. Full automation requires a custom tool or IDE extension (see options below). The best lightweight option is a shell script that opens the history file for quick paste, or a VS Code task/snippet. Full automation via IDE plugins (Copilot Chat export, Obsidian, etc.) is also possible.

### Decisions Made
- Adopt two-file memory pattern: `doc/agent-history.md` (chronological) + `doc/architecture-decisions.md` (durable ADRs).
- Use `doc/agent-history-template.md` as the copy-paste template per session.
- Start each new session with: *"Use `doc/agent-history.md` and `doc/architecture-decisions.md` as context."*

### Implementation Notes
- Created `doc/architecture-decisions.md` with ADR-0001 through ADR-0005.
- Created `doc/agent-history-template.md` with full reusable template.
- Created `doc/agent-history.md` (this file).

### File References
- `doc/architecture-decisions.md` - stable ADR store
- `doc/agent-history-template.md` - copy-paste template for each session
- `doc/agent-history.md` - this file, chronological history

### Validation
- **Checks run:** n/a (docs only)
- **Tests run:** n/a
- **Manual verification:** Files created and visible in workspace.

### Risks / Unknowns
- History only works if consistently maintained at end of each session.
- No native IDE auto-export of chat to file yet (see open items).

### Open Items
- [ ] Decide on preferred automation method (script vs VS Code task vs extension).
- [ ] Add Session 002 with first real technical task.
- [ ] Promote env/auth pattern to a proper ADR when confirmed.

### Next-Session Carry-Forward Prompt
> Use `doc/agent-history.md` and `doc/architecture-decisions.md` as context.
> Continue from session `2026-04-24 - Session 001`.
> Focus on:
> 1. First real technical task (API, auth, or test flow work).
> 2. Consider promoting env/auth pattern to ADR-0006.

### ADR Promotion Check
- **Promote to ADR?** No (process docs only this session)
- **If yes, ADR title:** n/a
- **Target file:** `doc/architecture-decisions.md`

