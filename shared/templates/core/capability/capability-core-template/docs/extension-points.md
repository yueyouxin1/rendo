# Extension Points

## Core-owned control plane

- `rendo.template.json`
- `rendo.project.json`
- `docs/*`
- `scripts/health.mjs`

## Kind-specific contract surface

- `capability/README.md`
- future files under `capability/` that remain neutral and reusable across all descendants

## Base-template extension space

Base templates may add:

- concrete implementation directories
- stronger runtime constraints
- host/install guidance
- richer secondary-development instructions

## Rule

The core layer should define how a `capability templates` grows, not what product or vendor it becomes.
