# SPEC.md — CodeScope Product Requirements

## 1. Problem

Developers joining an unfamiliar codebase or reviewing one before a hackathon merge have no
fast way to understand its structure. Reading files one at a time is slow.

CodeScope provides an interactive, explorable graph of a codebase from either a ZIP upload or
a public GitHub URL.

## 2. Target user

Primary users are developers, students, reviewers, and teams who need to understand an
existing codebase quickly.

## 3. User stories and acceptance criteria

### US-1 — Upload a codebase via ZIP

**As a developer, I want to upload a ZIP of my project so that I can visualize its structure
without pushing it anywhere.**

Acceptance criteria:

- [ ] A valid ZIP within the configured size limit creates a `Project`.
- [ ] Analysis begins automatically after project creation.
- [ ] A corrupted/invalid ZIP produces a clear error and does not create a usable project.
- [ ] The UI exposes `pending` / `processing` status while analysis runs.

### US-2 — Analyze a public GitHub repository

**As a developer, I want to paste a public GitHub repository URL so that I do not have to
download and re-upload it manually.**

Acceptance criteria:

- [ ] A valid public GitHub URL starts the same analysis pipeline as ZIP upload.
- [ ] Private/nonexistent repositories produce a clear error.
- [ ] The user can see the resulting project status.

### US-3 — Explore the folder/file graph

**As a developer, I want to see my project's folder tree rendered visually so that I can
understand its shape at a glance.**

Acceptance criteria:

- [ ] A completed analysis renders a React Flow graph.
- [ ] The graph supports pan and zoom.
- [ ] Selecting a node exposes file/folder detail.
- [ ] File detail includes path, language, and size where available.

### US-4 — See language breakdown

**As a developer, I want to know what languages make up the project so that I can gauge
the tech stack quickly.**

Acceptance criteria:

- [ ] A completed analysis shows a per-language file count and/or percentage breakdown.
- [ ] The values correspond to the analyzed file inventory.

### US-5 — See cross-file relationships

**As a developer, I want to see import/dependency relationships between files so that I can
understand coupling, not just folder layout.**

Acceptance criteria:

- [ ] Supported parsers can emit import relationships.
- [ ] When Neo4j is available, supported relationships are rendered as graph edges.
- [ ] When Neo4j is unavailable, the application falls back to folder containment without
  inventing cross-file relationships.

Supported target languages:

- Python
- JavaScript
- TypeScript
- Java
- Go
- C#
- C++
- PHP

### US-6 — Background processing

**As a developer, I want a large repository to be analyzed in the background so that the
browser is not blocked by a long request.**

Acceptance criteria:

- [ ] Analysis runs through Celery when configured.
- [ ] Local development can use the project's eager/synchronous fallback where configured.
- [ ] The frontend can observe status without a full-page reload.

## 4. Out of scope for this submission

- Private GitHub repositories requiring OAuth.
- Real-time collaborative graph viewing.
- Editing source code from inside CodeScope.

## 5. Demo success criteria

The intended demo should demonstrate:

1. A ZIP submission.
2. A public GitHub URL submission.
3. Successful analysis.
4. An interactive graph.
5. At least three supported languages represented in an analyzed project.

## 6. Definition of done

A feature is considered complete when its acceptance criteria are met, relevant tests pass,
the UI handles expected failure states, and CI remains green.
