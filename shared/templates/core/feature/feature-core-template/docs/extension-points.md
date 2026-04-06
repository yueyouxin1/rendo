# Extension Points

## Core-owned control plane

- `rendo.template.json`
- `rendo.project.json`
- `docs/*`
- `scripts/health.mjs`

## Kind-specific contract surface

- `feature/README.md`
- future files under `feature/` that remain neutral and reusable across all descendants

## Base-template extension space

Base templates may add:

- concrete implementation directories
- stronger runtime constraints
- host/install guidance
- richer secondary-development instructions

## Rule

The core layer should define how a `feature templates` grows, not what product or vendor it becomes.
