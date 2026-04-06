# Structure

## Layout

- `rendo.template.json`: machine-readable template identity and contract metadata
- `rendo.project.json`: machine-readable project instantiation metadata
- `README.md` and `AGENTS.md`: human and agent entrypoints
- `.agents/`: structured agent-readable metadata
- `docs/`: normative explanations for structure, runtime, inheritance, and authoring
- `interfaces/`: OpenAPI, MCP, and skills description surfaces
- `src/`: the sole implementation root
- `tests/`: TDD-oriented validation skeleton
- `integration/`: host-integration guidance for humans and agents
- `scripts/`: health and validation helpers owned by the core layer

## Core ownership

The core layer owns:

- manifest semantics
- directory conventions
- runtime-mode boundaries
- health-check shape
- agent entrypoints and interface roots
- minimal authoring guidance for the next layer

## Design rule

This template is the core layer for `feature templates`. Base and derived templates may add more files and stronger opinions, but they should not make the control plane harder to inspect, harder to validate, or harder to inherit.
