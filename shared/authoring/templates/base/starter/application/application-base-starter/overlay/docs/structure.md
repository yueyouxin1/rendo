# Structure

## Root layout

- `src/apps/`: physical surface runtimes
- `src/packages/`: shared contracts, domain logic, and shared configuration
- `src/features/`: installed or locally-authored feature templates
- `src/capabilities/`: installed or locally-authored capability templates
- `src/providers/`: installed or locally-authored provider templates
- `src/surfaces/`: installed or locally-authored surface templates
- `docs/`: normative architecture and extension guidance
- `integration/`: host integration and asset-install guidance
- `scripts/`: health and workspace-level helpers

## Surface rule

- `src/apps/web` is the default physical surface
- `src/apps/miniapp` and `src/apps/mobile` are optional physical surfaces
- `src/apps/desktop` is a reserved surface slot
- all surfaces share one starter identity recorded in `rendo.project.json`

## Shared package rule

- put surface-agnostic contracts in `src/packages/contracts`
- put pure product/application logic in `src/packages/domain`
- put reusable cross-surface helpers in `src/packages/shared`
- put configuration schemas and shared conventions in `src/packages/config`

## Design rule

This base starter is meant to scale from a minimal app to a production project without changing the top-level mental model: implementation stays under `src/*`, surfaces stay under `src/apps/*`, shared logic stays under `src/packages/*`, and integrated template assets stay in dedicated `src/features|capabilities|providers|surfaces` roots.
