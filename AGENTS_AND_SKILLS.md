# AGENTS_AND_SKILLS.md — CodeScope Custom Agent and Skill

This document identifies the concrete custom agent and custom skill committed to the repository.
The files below are project-specific and are intended to be used during CodeScope analysis work.

## Custom Agent

**Name:** `codescope-graph-reviewer`

**Location:** `.claude/agents/codescope-graph-reviewer.md`

**Purpose:** Review a generated CodeScope graph payload after analysis and check for structural
problems that would make the visualization misleading, including duplicate node IDs, missing
relationship endpoints, malformed node types, invalid containment relationships, and obvious
orphaned nodes.

**How it is invoked:** The development agent invokes this reviewer after an analysis result is
available and before the result is considered ready for frontend visualization. It can also be
run manually against a saved graph JSON payload during development.

**Required input:** A graph object containing `nodes` and `edges`.

**Expected behaviour:**

```text
Input graph
    |
    +--> validate node IDs
    +--> validate node types
    +--> validate edge endpoints
    +--> validate relationship types
    +--> detect duplicate nodes
    +--> detect obvious orphan nodes
    |
    v
Review report
    ├── PASS
    ├── WARN
    └── FAIL
```

The reviewer must report findings rather than silently rewriting analysis output.

## Custom Skill

**Name:** `codescope-graph-review`

**Location:** `.claude/skills/graph-review/SKILL.md`

**Purpose:** A reusable procedure for checking graph payloads produced by the CodeScope analysis
pipeline before they are rendered with React Flow.

**Used by:** `codescope-graph-reviewer`.

**Checks:**

- node IDs are unique;
- every edge references an existing node;
- node types are `file` or `folder`;
- relationship types are `contains` or `imports`;
- folder containment does not point from a file to a child;
- duplicate edges are reported;
- isolated nodes are reported as warnings, not automatically deleted.

## Evidence requirement

The hackathon rubric requires these to be real committed artifacts and used in the actual
project workflow. Before submission:

1. Commit both files to the repository.
2. Run the reviewer against a real graph produced by CodeScope.
3. Keep the resulting review output in the PR/commit/issue or another auditable project record.
4. Do not claim a run that did not happen.

This avoids presenting a documentation-only agent as if it were used in the product pipeline.
