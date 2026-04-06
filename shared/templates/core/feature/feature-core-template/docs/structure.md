# Structure

## Layout

- `rendo.template.json`: machine-readable template identity and contract metadata
- `rendo.project.json`: machine-readable project instantiation metadata
- `README.md` and `AGENTS.md`: human and agent entrypoints
- `docs/`: normative explanations for structure, runtime, inheritance, and authoring
- `scripts/`: health and validation helpers owned by the core layer
- `feature/`: kind-specific notes that stay stable across all base and derived descendants

## Core ownership

The core layer owns:

- manifest semantics
- directory conventions
- runtime-mode boundaries
- health-check shape
- minimal authoring guidance for the next layer

## Design rule

This template is the core layer for `feature templates`. Base and derived templates may add more files and stronger opinions, but they should not make the control plane harder to inspect, harder to validate, or harder to inherit.
