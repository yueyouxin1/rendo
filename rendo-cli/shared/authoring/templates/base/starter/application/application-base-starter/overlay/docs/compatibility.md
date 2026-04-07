# Compatibility

## CLI contract

This starter is created through `rendo create`, not `rendo init` and not `rendo add`.

## Host/install contract

This starter is expected to host:

- feature templates under `src/features/`
- capability templates under `src/capabilities/`
- provider templates under `src/providers/`
- surface templates under `src/surfaces/`

## Surface contract

`web` is the default generated surface. `miniapp` and `mobile` are optional and must be requested explicitly at creation time. `desktop` remains a reserved slot for later implementation.
