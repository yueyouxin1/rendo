# Inheritance Boundaries

## Allowed to inherit

- control-plane files
- manifest semantics
- runtime-mode semantics
- directory conventions
- health checks and authoring docs

## Not allowed to inherit blindly

- concrete product logic
- concrete vendor credentials
- hidden runtime side effects
- irreversible install behavior

## Rule

Base and derived templates may add opinion, but they should not erase the minimal contract exposed by `surface-core-template`.
