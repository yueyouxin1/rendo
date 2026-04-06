# AGENTS.md

## Mission

This workspace is a Rendo `__RENDO_CORE_LABEL_LOWER__` core template instance.

It exists to:

- keep the core layer contract-first and agent-readable
- define the minimum directory, manifest, runtime, and extension semantics for this template kind
- provide a stable substrate for building `__RENDO_CORE_LABEL_LOWER__` base templates without product or vendor drift

## Rules

- Keep this template shape-neutral and vendor-neutral.
- Prefer explicit files over hidden state.
- Document extension points before adding convenience wrappers.
- Treat `rendo.template.json` and `docs/*` as the control plane; code files are secondary.

## Key files

- `rendo.template.json`
- `rendo.project.json`
- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`
- `docs/authoring-base-template.md`
- `docs/compatibility.md`
- `__RENDO_CORE_DIRECTORY__/README.md`
