# AGENTS.md

## Mission

This workspace is the official Application Base Starter Template.

It exists to give humans and agents one clear, production-oriented starting point for application starters before any business-specific derived template is introduced.

## Read order

- `rendo.template.json`
- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`

## Structure summary

- `apps/web`: Next.js hello-world landing page
- `apps/miniapp`: miniapp placeholder surface
- `apps/mobile`: mobile placeholder surface
- `packages/*`: shared contracts and future shared application modules
- `features/`, `capabilities/`, `providers/`, `surfaces/`: host-owned install roots for non-starter template assets
- root manifest and docs: shared starter control plane

## Rules

- Keep CLI semantics language-agnostic.
- Keep multi-surface boundaries explicit.
- Keep shared domain logic out of surface-specific directories when it can live under `packages/`.
- Do not add admin or business modules by default.
