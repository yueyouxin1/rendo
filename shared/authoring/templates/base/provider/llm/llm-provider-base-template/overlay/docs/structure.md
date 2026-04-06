# Structure

- `provider/README.md`: human-readable provider contract
- `provider/config.example.json`: machine-readable configuration example
- root manifest and docs: runtime, compatibility, and install semantics

## Design rule

This base template defines adapter shape, not a full product runtime. Vendor-specific implementation belongs in derived provider templates or host-owned wrappers.
