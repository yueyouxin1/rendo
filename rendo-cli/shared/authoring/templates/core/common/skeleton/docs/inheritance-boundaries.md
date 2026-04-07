# Inheritance Boundaries

## Must Inherit

- workspace control plane
- agent entrypoints
- interface-surface roots
- `src/` as the implementation root
- verification skeleton
- documented extension boundaries

## Must Not Inherit Blindly

- product behavior
- vendor credentials
- hidden runtime side effects
- irreversible host coupling
- scenario-specific UI or business assumptions

## Rule

Base and derived templates may add opinion.
They must not erase the minimal contract exposed by `__RENDO_CORE_TEMPLATE_ID__`.
