# Runtime Modes

`__RENDO_CORE_TEMPLATE_ID__` declares the widest runtime-mode range that this template kind can reasonably support.

## Rules

- Keep the manifest as the machine-readable source of truth.
- Base templates may narrow the supported runtime modes when they introduce stronger opinions.
- Derived templates may narrow further, but should not widen beyond the core declaration.
- Push vendor-specific operational detail into base or derived templates.
