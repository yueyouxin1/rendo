# AGENTS.md

## Mission

This workspace is a Rendo `surface templates` core template instance.

It exists to:

- keep the core layer contract-first and agent-readable
- define the minimum directory, manifest, runtime, and extension semantics for this template kind
- provide a stable substrate for building `surface templates` base templates without product or vendor drift

## Rules

- Keep this template shape-neutral and vendor-neutral.
- Prefer explicit files over hidden state.
- Document extension points before adding convenience wrappers.
- Treat `rendo.template.json`, `.agents/*`, `interfaces/*`, and `docs/*` as the control plane.
- Keep implementation under `src/`; do not reintroduce type-named roots like `provider/` or `feature/`.

## Key files

- `rendo.template.json`
- `rendo.project.json`
- `.agents/capabilities.yaml`
- `.agents/review-checklist.md`
- `.agents/glossary.md`
- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`
- `interfaces/openapi/README.md`
- `interfaces/mcp/README.md`
- `interfaces/skills/README.md`
- `src/README.md`
- `integration/README.md`
