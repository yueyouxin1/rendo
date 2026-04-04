# AGENTS.md

## Mission

This workspace is a Rendo Core Starter instance.

It exists to:

- remain runnable without product UI
- expose explicit extension points
- keep manifests, providers, packs, and runtime modes legible to strong agents

## Rules

- Keep the starter headless-first.
- Do not introduce domain UI or product assumptions here.
- Prefer explicit files over hidden state.
- Any new capability must document its install surface and runtime mode.

## Key files

- `rendo.template.json`
- `rendo.project.json`
- `docs/extension-points.md`
- `docs/runtime-modes.md`
- `packages/config/src/index.ts`
