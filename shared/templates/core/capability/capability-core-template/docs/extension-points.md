# Extension Points

## Core-Owned

The core layer owns these surfaces:

- `.rendo/*`
- `.agents/*`
- `docs/*`
- `interfaces/*`
- `integration/*`
- `scripts/health.mjs`
- the rule that implementation lives under `src/`

## What Base And Derived May Add

Base and derived templates may add:

- concrete implementation directories under `src/`
- stronger runtime constraints
- host integration guidance
- richer tests
- richer operational guidance

Starter descendants may additionally add, under `src/`:

- `apps/*`
- `packages/*`
- `features/*`
- `capabilities/*`
- `providers/*`
- `surfaces/*`

## Rule

Add opinion in `base` and `derived`.
Do not move or weaken the frozen core surfaces.
