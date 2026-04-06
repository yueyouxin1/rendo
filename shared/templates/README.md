# Template Assets

Rendo template assets are laid out as generated runtime artifacts, not authoring sources.

## Path convention

1. `core/<kind>/<template-id>`
2. `base/<kind>/<category>/<template-id>`
3. `derived/<kind>/<category>/<template-id>`

## Current official generated assets

- `core/starter/starter-core-template`
- `core/feature/feature-core-template`
- `core/capability/capability-core-template`
- `core/provider/provider-core-template`
- `core/surface/surface-core-template`
- `base/starter/application/application-base-starter`
- `base/provider/llm/llm-provider-base-template`

Current-stage rule:

- only the minimum official base set is kept active while the rebuilt `core -> base` chain is hardened

## Design rule

- `core` defines the minimum contract layer for a template kind
- `base` defines the canonical best-practice starting point for that kind
- `derived` grows concrete specializations from a base template
- generated assets should stay close to registry/runtime consumption concerns, while authoring sources live under `shared/authoring/templates`
