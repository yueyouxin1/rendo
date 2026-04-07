# Structure

## Layout

- `.rendo/`: CLI-managed workspace metadata namespace
- `README.md`, `AGENTS.md`, `CLAUDE.md`: human and agent entrypoints
- `.agents/`: structured agent metadata, glossary, checklists, and skills
- `docs/`: normative rules for structure, extension, inheritance, and secondary development
- `interfaces/`: externally discoverable HTTP, MCP, and skills surfaces
- `src/`: the sole implementation root
- `tests/`: verification skeleton
- `integration/`: human and agent-readable host impact guidance
- `scripts/`: health and validation helpers owned by the core layer

## Workspace vs Formal Artifact

- An initialized Rendo workspace should keep local metadata under `.rendo/`.
- A formal template artifact may still expose root-level `rendo.template.json` for registry and bundle compatibility.
- Core-owned scripts must therefore treat `.rendo/` as the first source of truth and root-level manifests as compatibility fallback only.

## Core Ownership

The core layer owns:

- workspace language
- directory conventions
- interface-surface conventions
- verification conventions
- inheritance conventions

It does not own product behavior or vendor choice.
