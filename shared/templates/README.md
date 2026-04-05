# Template Assets

Rendo template assets are layered as:

1. `core/<template-id>`
2. `base/<kind>/<template-id>`
3. `derived/<kind>/<template-id>`

Current implemented official layers:

- `core/starter-core-template`
- `core/feature-core-template`
- `core/capability-core-template`
- `core/provider-core-template`
- `core/surface-core-template`
- `base/starter/application-base-starter`
- `base/feature/dashboard-feature-base-template`
- `base/capability/storage-capability-base-template`
- `base/provider/llm-provider-base-template`
- `base/surface/admin-surface-base-template`

Design rule:

- `core` defines the minimum contract layer for a template kind
- `base` defines the canonical best-practice starting point for that kind
- `derived` grows concrete specializations from a base template
