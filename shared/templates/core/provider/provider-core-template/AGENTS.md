# AGENTS.md

## Identity

This workspace is the Rendo `provider templates` core contract.

It exists to freeze the Rendo engineering language for this template kind:

- workspace control plane
- implementation-root rules
- interface-surface rules
- verification rules
- inheritance rules

It is not a product starter.
It is not a vendor binding.
It is not the place to hide runtime behavior.

## Read Order

Read in this order before changing anything:

1. `AGENTS.md`
2. `.agents/glossary.md`
3. `.agents/review-checklist.md`
4. `.agents/skills/rendo-workspace-mode/SKILL.md`
5. `.agents/skills/rendo-boundaries/SKILL.md`
6. `.agents/skills/rendo-service-surfaces/SKILL.md`
7. `.agents/skills/rendo-tdd-and-verification/SKILL.md`
8. `.agents/skills/rendo-doc-hygiene/SKILL.md`
9. `docs/structure.md`
10. `docs/extension-points.md`
11. `docs/inheritance-boundaries.md`
12. `docs/secondary-development.md`

## Non-Negotiable Rules

- Keep this core template product-neutral and vendor-neutral.
- Treat workspace metadata as CLI-owned. Do not hand-edit `.rendo/*` unless the task is explicitly about metadata tooling.
- Keep the control plane explicit: `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/`, `interfaces/`, `integration/`.
- Keep implementation under `src/`.
- Do not reintroduce default implementation roots named after template kinds such as `provider/`, `feature/`, `capability/`, or `surface/`.
- If externally callable behavior changes, update the matching surface under `interfaces/` and the matching capability entry under `.agents/`.
- If inheritance, extension, or verification rules change, update the matching docs and checklist in the same change.
- Prefer additive changes over rewriting frozen roots.

## Control Plane

These files define the workspace more than implementation details do:

- `.rendo/rendo.template.json`
- `.rendo/rendo.project.json`
- `.agents/review-checklist.md`
- `.agents/glossary.md`
- `.agents/skills/*/SKILL.md`
- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`
- `interfaces/openapi/README.md`
- `interfaces/mcp/README.md`
- `interfaces/skills/README.md`
- `integration/README.md`

## Delivery Standard

- Start from contracts and boundaries, not convenience code.
- Add or update tests before claiming behavior is settled.
- Keep docs short, explicit, and non-redundant.
- Do not hide required behavior in scripts without documenting it.
- If a change would make this workspace harder for a strong agent to inspect, stop and simplify.
