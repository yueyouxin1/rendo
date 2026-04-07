---
name: rendo-service-surfaces
description: Update externally callable or discoverable behavior through the correct interface and capability surfaces.
origin: Rendo
---

# Rendo Service Surfaces

Use this playbook when a change affects externally callable or discoverable behavior.

## Rules

- Keep business logic in `src/`.
- Keep machine-readable discovery surfaces in `interfaces/`.
- If a capability can be called by humans, systems, or agents, decide which surface must expose it:
  - `interfaces/openapi/`
  - `interfaces/mcp/`
  - `interfaces/skills/`
- Keep `.agents/skills/*/SKILL.md` and `interfaces/*` aligned when the stable capability map changes.

## Minimum discipline

1. Add or update implementation under `src/`.
2. Update the matching `interfaces/*` description.
3. Update the affected `.agents/skills/*` if the stable capability set changed.
4. Add or update verification.

## Anti-pattern

Do not leave callable behavior discoverable only by reading source code.
