# Extension Points

## Core-owned control plane

- `rendo.template.json`
- `rendo.project.json`
- `docs/*`
- `scripts/health.mjs`

## Kind-specific contract surface

- `__RENDO_CORE_DIRECTORY__/README.md`
- future files under `__RENDO_CORE_DIRECTORY__/` that remain neutral and reusable across all descendants

## Base-template extension space

Base templates may add:

- concrete implementation directories
- stronger runtime constraints
- host/install guidance
- richer secondary-development instructions

## Rule

The core layer should define how a `__RENDO_CORE_LABEL_LOWER__` grows, not what product or vendor it becomes.
