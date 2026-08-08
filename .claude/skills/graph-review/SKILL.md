# codescope-graph-review

## Purpose

This skill provides a deterministic checklist for reviewing graph payloads produced by the
CodeScope analysis pipeline.

## When to use

Use this skill after repository analysis has produced a graph and before the graph is handed
to the React Flow frontend.

## Input contract

```json
{
  "nodes": [],
  "edges": []
}
```

Each node should have:

```json
{
  "id": "unique-string",
  "type": "file|folder",
  "data": {}
}
```

Each edge should have:

```json
{
  "id": "unique-string",
  "source": "existing-node-id",
  "target": "existing-node-id",
  "type": "contains|imports"
}
```

## Procedure

### 1. Validate node collection

- `nodes` must be an array.
- Every node must have a non-empty ID.
- IDs must be unique.
- Types must be `file` or `folder`.

### 2. Validate edge collection

- `edges` must be an array.
- Every edge must reference existing nodes.
- Relationship types must be `contains` or `imports`.
- Duplicate edge IDs should be reported.
- Duplicate source/target/type combinations should be reported.

### 3. Validate containment

A `contains` edge should have a folder as its source. A file must not be treated as a
container.

### 4. Detect isolated nodes

An isolated node is not automatically wrong. Report it as a warning because a valid project
may contain a root node or an intentionally disconnected artifact.

### 5. Produce a review report

Use:

```text
PASS
```

when there are no structural errors.

Use:

```text
WARN
```

when only non-fatal findings exist.

Use:

```text
FAIL
```

when the graph is malformed or contains references to missing nodes.

## Important constraint

This skill validates the analysis result. It does not invent or infer missing imports,
files, or relationships.
