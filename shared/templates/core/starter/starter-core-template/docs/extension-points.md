# Extension Points

## Core-owned control plane

- `rendo.template.json`
- `rendo.project.json`
- `docs/*`
- `scripts/health.mjs`

## Kind-specific contract surface

- `starter/README.md`
- future files under `starter/` that remain neutral and reusable across all descendants

## Base-template extension space

Base templates may add:

- concrete implementation directories
- stronger runtime constraints
- host/install guidance
- richer secondary-development instructions

## Rule

The core layer should define how a `starter templates` grows, not what product or vendor it becomes.
