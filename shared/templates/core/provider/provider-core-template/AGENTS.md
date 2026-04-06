# AGENTS.md

## Mission

This workspace is a Rendo `provider templates` core template instance.

It exists to:

- keep the core layer contract-first and agent-readable
- define the minimum directory, manifest, runtime, and extension semantics for this template kind
- provide a stable substrate for building `provider templates` base templates without product or vendor drift

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
- `provider/README.md`
