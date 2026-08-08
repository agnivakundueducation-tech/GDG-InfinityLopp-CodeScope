# CodeScope — Architecture

## 1. Product overview

CodeScope is an interactive codebase-visualization tool. A developer uploads a ZIP archive
or provides a public GitHub repository URL. The backend analyzes the repository and the
frontend renders its structure as an explorable graph.

The primary value is architectural understanding: a developer can see folders, files,
languages, and supported cross-file relationships without manually opening every file.

## 2. Repository structure

```text
codescope/
├── backend/                 # Django + DRF API and analysis pipeline
├── frontend/                # React + Vite + TypeScript UI
├── .claude/
│   ├── agents/              # Custom CodeScope agent definitions
│   └── skills/              # Reusable CodeScope skills
├── .github/workflows/       # CI
├── docs/                    # Product and technical documentation
├── AGENTS.md                # Agent constitution
├── SPEC.md                  # Product requirements
└── TASKS.md                 # Development task breakdown
```

## 3. Technology stack

| Layer | Technology | Responsibility |
|---|---|---|
| API | Django 5 + Django REST Framework | Project creation, status, graph API |
| Async processing | Celery + Redis | Background repository analysis |
| Relational data | PostgreSQL; SQLite for local/dev where configured | Project metadata, jobs, file inventory and fallback graph |
| Graph data | Neo4j when available | File/folder and import relationships |
| Parsers | Python, JS/TS initially; additional language parsers planned | Extract structural relationships |
| Frontend | React 18 + Vite + TypeScript + Tailwind + React Flow | Upload UI and interactive graph |
| Deployment | Render for backend services; Vercel for frontend | Hosted deployment |

## 4. High-level architecture

```text
                         Developer
                             |
                    ZIP or public GitHub URL
                             |
                             v
                    +----------------+
                    |   React UI     |
                    | Vite + TS      |
                    +-------+--------+
                            |
                         REST API
                            |
                            v
                    +----------------+
                    | Django / DRF   |
                    +-------+--------+
                            |
                    create Project
                            |
                            v
                    +----------------+
                    | Celery Worker  |
                    +-------+--------+
                            |
              +-------------+-------------+
              |             |             |
              v             v             v
        File inventory   Language     Graph builder
        + detection      parsers          |
              |             |              |
              +-------------+--------------+
                            |
                +-----------+-----------+
                |                       |
                v                       v
           PostgreSQL                 Neo4j
          metadata/fallback        graph relations
                |                       |
                +-----------+-----------+
                            |
                            v
                     Django Graph API
                            |
                            v
                     React Flow UI
```

## 5. Request and analysis flow

1. The user selects a ZIP archive or enters a public GitHub URL.
2. The frontend sends the submission to `POST /api/v1/projects/`.
3. Django validates the submission and creates a `Project`.
4. The analysis work is queued through Celery; local development may run eagerly when Redis
   is not configured.
5. The worker extracts/clones the source into a controlled workspace.
6. File inventory and language detection run.
7. Supported parsers extract structural relationships.
8. Metadata and job status are persisted in PostgreSQL.
9. Graph relationships are persisted to Neo4j when available; folder containment can fall back
   to Postgres when Neo4j is unavailable.
10. The frontend retrieves/polls project status and requests the graph.
11. React Flow renders nodes and edges for exploration.

## 6. Core data model

The following describes the intended shape and should be kept aligned with the actual Django
models.

### PostgreSQL

```text
Project
├── id
├── name
├── source_type        # zip | github
├── source_ref
├── status             # pending | processing | done | failed
└── created_at

AnalysisJob
├── id
├── project_id
├── celery_task_id
├── status
├── started_at
├── finished_at
└── error

FileRecord
├── id
├── project_id
├── path
├── language
├── size_bytes
└── loc

FolderNode
├── id
├── project_id
├── path
└── parent_id
```

### Neo4j

```text
(:Folder {path})
(:File {path, language})

(:Folder)-[:CONTAINS]->(:Folder)
(:Folder)-[:CONTAINS]->(:File)
(:File)-[:IMPORTS]->(:File)
```

`IMPORTS` relationships are only produced when a supported parser can establish the
relationship reliably.

## 7. API surface

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/v1/projects/` | Create a project from ZIP or public GitHub URL |
| GET | `/api/v1/projects/{id}/` | Project status and metadata |
| GET | `/api/v1/projects/{id}/graph/` | Processed graph for visualization |
| GET | `/api/v1/health/` | Deployment/health check |
| GET | `/api/docs/` | API documentation / Swagger |

## 8. Failure and fallback behaviour

- Invalid or corrupted ZIP input should return a clear validation error.
- Private/nonexistent GitHub repositories are outside the MVP and should fail clearly.
- Long-running analysis must not block the API request thread.
- If Neo4j is unavailable, the application may render folder-containment graphs from Postgres.
- The UI should expose analysis failure rather than displaying a misleading successful graph.

## 9. Security boundaries

Uploaded source is treated as untrusted data.

The analysis service must not execute uploaded programs. Archive extraction must prevent
path traversal. Credentials and service URLs are supplied through environment variables.

## 10. Deployment

```text
Vercel
└── React/Vite frontend
        |
        v
Render
├── Django API
├── Celery worker
├── PostgreSQL
└── Redis

Optional:
└── Neo4j for relationship graph storage
```

## 11. Known constraints

- Render free-tier services may cold-start after inactivity.
- Hosted uploaded files may live on ephemeral storage depending on deployment configuration.
- Neo4j is optional; the fallback graph is limited to the relationships supported by the
  Postgres representation.
- Private GitHub repositories are out of scope for the current submission.
