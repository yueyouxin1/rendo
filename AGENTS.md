# Root AGENTS.md

## Workspace split

This repository root is no longer the CLI development root.

Current top-level roles:

- `rendo-cli/`: the Rendo CLI development workspace
- `application/`: local template or project workspaces created by the published `rendo` CLI
- `.tmp/`: temporary reference material and scratch data

## Rules

- Make CLI source changes under `rendo-cli/`.
- Do not reintroduce CLI source, tests, contracts, or runtime assets into the repository root.
- Treat the root as an orchestration workspace that can host generated template workspaces such as `application/saas-starter`.
- If a change affects the CLI implementation, runtime assets, tests, or packaging, update files under `rendo-cli/`, not here.
