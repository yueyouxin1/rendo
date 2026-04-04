# Extension Points

## Starter-level

- `rendo.template.json`: template identity and runtime declarations
- `rendo.project.json`: instance state and installed pack list

## Code-level

- `packages/sdk/src/index.ts`: provider adapters
- `packages/domain/src/index.ts`: runtime composition
- `apps/runtime/src/server.ts`: validation surface

## Future domain branching

When creating a Domain Starter, add the concrete app shell there instead of mutating Core Starter into a product template.
