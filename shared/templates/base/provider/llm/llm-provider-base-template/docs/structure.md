# Structure

- `src/README.md`: provider implementation root
- `src/config.example.json`: machine-readable configuration example
- `integration/README.md`: host-integration guidance for starter maintainers
- root manifest and docs: runtime, compatibility, and integration semantics

## Design rule

This base template defines adapter shape, not a full product runtime. Vendor-specific implementation belongs in derived provider templates or host-owned wrappers.
