# TASKS.md — CodeScope Task Breakdown

> Keep this file current. Check items off as work is actually completed; do not mark an item
> complete merely because the file exists.

## Day 1 — Product and backend

- [x] Scaffold Django + Django REST Framework
- [x] Create `Project` model and project creation endpoint
- [x] Wire Celery + Redis for background analysis
- [x] Build file inventory and language detection
- [x] Add Python and JS/TS parsing
- [ ] Add Java, Go, C#, C++, and PHP parsers
- [ ] Add Neo4j persistence
- [ ] Add Postgres folder-graph fallback
- [ ] Add `GET /api/v1/projects/{id}/graph/`
- [ ] Add health-check endpoint

## Day 1 — Frontend

- [x] Scaffold Vite + React + TypeScript + Tailwind
- [x] Add ZIP upload form
- [x] Add public GitHub URL input
- [ ] Render graph with React Flow
- [ ] Add node-click file detail panel
- [ ] Add language breakdown
- [ ] Add analysis-status polling

## Day 1 — Agent and process

- [x] Create `ARCHITECTURE.md`
- [x] Create `AGENTS.md`
- [ ] Record the actual coding agent/tool used
- [ ] Commit the custom CodeScope graph-review agent
- [ ] Commit the graph-review skill used by the agent
- [ ] Use the custom agent/skill on a real analysis output and record the result
- [ ] Add GitHub Actions CI for backend and frontend
- [ ] Confirm the latest CI run is green
- [ ] Wire Playwright E2E tests into CI
- [ ] Upload Playwright report as a CI artifact
- [ ] Add pre-commit lint/static-analysis hooks
- [ ] Create tagged release such as `v0.1.0`
- [ ] Record a ~3 minute demo or capture submission screenshots

## Day 2 — If finalist

- [ ] Add tasks based on judge feedback
- [ ] Improve graph relationships
- [ ] Expand language parser coverage
