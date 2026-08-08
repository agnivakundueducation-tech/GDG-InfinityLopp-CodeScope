# AGENTS.md — CodeScope Agent Constitution

## 1. Purpose

CodeScope is an interactive codebase-visualization application. Users can submit a ZIP
archive or a public GitHub repository URL; the backend analyzes the codebase and the
frontend renders the resulting structure as an explorable graph.

This file is the working agreement for AI coding agents contributing to the repository.
It exists so agent behaviour is auditable, repeatable, and consistent with the project.

## 2. Agent workflow

The coding agent must follow this sequence for non-trivial work:

1. Inspect the existing implementation before editing.
2. Read the relevant requirements in `SPEC.md` and the architecture in `ARCHITECTURE.md`.
3. Identify the smallest set of files needed for the task.
4. Implement the change without rewriting unrelated code.
5. Add or update tests for the changed behaviour.
6. Run the relevant linter, tests, and build.
7. Summarize the files changed and the verification performed.

If a requirement is ambiguous, the agent must ask for clarification rather than inventing
an API contract, graph schema, or product behaviour.

## 3. Agent/tool record

The repository should record the actual coding agent used by the team.

| Agent / Tool | Actual role |
|---|---|
| Claude Code / Cursor / Cline / Copilot Agent | Use the tool actually used by the team; record the concrete work performed |

> Before submission, replace the tool name above with the real agent(s) used. Do not claim a
> tool was used if it was not.

## 4. Scope discipline

- Backend changes belong under `backend/`.
- Frontend changes belong under `frontend/`.
- CI changes belong under `.github/workflows/` and must be reviewed explicitly.
- Agent/skill definitions belong under `.claude/`.
- Do not modify deployment configuration or `.env*` files unless the task explicitly requires it.
- Do not rewrite Git history on `main`.

## 5. Security

Agents must never:

- hard-code API keys, passwords, database credentials, tokens, or private URLs;
- commit `.env` files or production secrets;
- log secrets;
- weaken authentication or validation merely to make tests pass.

Use environment variables and the existing project configuration.

## 6. Code quality

### Backend

- Follow the existing Django/DRF project conventions.
- Keep request handling, analysis logic, persistence, and graph transformation separated.
- Validate inputs at API boundaries.
- Return useful HTTP status codes and error messages.
- Use the project's configured Python formatter/linter rather than introducing a second style system.

### Frontend

- Use the existing React + TypeScript conventions.
- Keep components focused and reusable.
- Do not duplicate API or graph transformation logic.
- Provide loading, success, and error states for asynchronous operations.
- Keep user-facing flows accessible and testable.

## 7. Analysis pipeline rules

The analysis pipeline must treat uploaded/project source as untrusted input.

- Reject invalid archives safely.
- Avoid path traversal when extracting archives.
- Do not execute uploaded source code.
- Ignore files that are not relevant to analysis where appropriate.
- Keep analysis deterministic where possible.
- Do not create fake graph relationships merely to make a visualization look complete.

## 8. Graph rules

Graph data must preserve the distinction between:

- folders;
- files;
- containment relationships;
- import/dependency relationships.

When Neo4j is unavailable, the application may fall back to the supported Postgres
folder graph. The fallback must not pretend that unsupported cross-file relationships exist.

## 9. Testing and merge gate

A feature is not done until its relevant checks pass.

At minimum:

- backend tests for changed backend behaviour;
- frontend lint/build for changed frontend behaviour;
- Playwright coverage for important user-facing journeys.

The CI workflow must remain enabled. Agents may not skip a failing check to obtain a green build.

## 10. Git discipline

Prefer small, logically scoped commits:

- `feat: ...`
- `fix: ...`
- `test: ...`
- `docs: ...`
- `ci: ...`
- `chore: ...`

Do not use end-of-day dump commits such as `final`, `changes`, or `everything`.

## 11. Human review

Agent-generated code is reviewed by the human project owner before being pushed to `main`.
The agent may work on a feature branch, but it must not bypass the human review gate.
