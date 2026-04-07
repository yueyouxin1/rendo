---
name: rendo-workspace-mode
description: Decide whether a change belongs to workspace metadata, control-plane docs, interface surfaces, or implementation code.
origin: Rendo
---

# Rendo Workspace Mode

## Purpose

Use this skill when deciding whether a change belongs to workspace metadata, control-plane docs, interface surfaces, or implementation code.

## Rules

- Treat `.rendo/*` as CLI-owned metadata.
- Treat `AGENTS.md`, `.agents/*`, `docs/*`, `interfaces/*`, and `integration/*` as the control plane.
- Treat `src/*` as implementation.
- Do not hand-edit workspace metadata unless the task is explicitly about metadata tooling or schema migration.

## When Changing The Workspace

1. Identify whether the change affects metadata, control plane, or implementation.
2. If metadata changes, update the matching schema or tooling expectation.
3. If control-plane meaning changes, update docs and review checklist in the same change.
4. If implementation changes without control-plane impact, keep the docs stable.
