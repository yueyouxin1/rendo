# Inheritance Boundaries

## Allowed to inherit

- control-plane files
- manifest semantics
- runtime-mode semantics
- directory conventions
- health checks and authoring docs
- neutral kind-specific notes under `surface/`

## Not allowed to inherit blindly

- concrete product logic
- concrete vendor credentials
- hidden runtime side effects
- irreversible install behavior
- template-host assumptions that belong in `base` or `derived`

## Rule

Base and derived templates may add opinion, but they should not erase the minimal contract exposed by `surface-core-template`.
