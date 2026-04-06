# Structure

## Root layout

- `apps/`: surface-specific application entries
- `packages/`: shared contracts, domain logic, and shared configuration
- `features/`: installed or locally-authored feature templates
- `capabilities/`: installed or locally-authored capability templates
- `providers/`: installed or locally-authored provider templates
- `surfaces/`: installed or locally-authored surface templates
- `docs/`: normative architecture and extension guidance
- `scripts/`: health and workspace-level helpers

## Surface rule

- `apps/web` is the default physical surface
- `apps/miniapp` and `apps/mobile` are optional physical surfaces
- all surfaces share one starter identity recorded in `rendo.project.json`

## Shared package rule

- put surface-agnostic contracts in `packages/contracts`
- put pure product/application logic in `packages/domain`
- put reusable cross-surface helpers in `packages/shared`
- put configuration schemas and shared conventions in `packages/config`

## Design rule

This base starter is meant to scale from a minimal app to a production project without changing the top-level mental model: surface code stays under `apps/*`, shared logic stays under `packages/*`, and installable template assets stay in dedicated roots.
