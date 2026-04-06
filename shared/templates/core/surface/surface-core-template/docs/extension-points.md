# Extension Points

## Core-owned control plane

- `rendo.template.json`
- `rendo.project.json`
- `.agents/*`
- `docs/*`
- `interfaces/*`
- `integration/*`
- `scripts/health.mjs`

## Base-template extension space

Base templates may add:

- concrete implementation directories under `src/`
- stronger runtime constraints
- host integration guidance
- richer secondary-development instructions

Starter descendants may additionally add, under `src/`:

- `apps/*`
- `packages/*`
- `features/*`
- `capabilities/*`
- `providers/*`
- `surfaces/*`

## Rule

The core layer should define how a `surface templates` grows, not what product or vendor it becomes.
