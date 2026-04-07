# AGENTS.md

## Mission

This workspace is the local derived template workspace for `application/saas-starter`.

It exists to define and implement the canonical SaaS starter on top of the Rendo starter foundation without dragging runtime-platform work into the same loop.

## Read order

- `.rendo/rendo.template.json`
- `docs/SaaS基座最佳实践技术栈选型.md`
- `docs/SaaS前端与产品体验标准.md`
- `docs/todo/README.md`
- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`

## Structure summary

- `src/apps/web`: the canonical web surface and product UI
- `src/apps/miniapp`: miniapp placeholder surface
- `src/apps/mobile`: mobile placeholder surface
- `src/apps/desktop`: reserved desktop surface slot
- `src/apps/api`: canonical HTTP API target
- `src/apps/mcp`: canonical Agent API target
- `src/apps/worker`: async task runner target
- `src/packages/*`: shared contracts and application modules
- `src/features/`, `src/capabilities/`, `src/providers/`, `src/surfaces/`: host-owned integration roots for non-starter template assets
- `docs/todo/`: the only active implementation checklist for this workspace

## Rules

- Treat this workspace as `application/saas-starter`, not as `application-base-starter`.
- Keep product and frontend decisions local to this workspace; do not route current work back through `rendo-cli/docs/todo/saas-starter`.
- Keep multi-surface boundaries explicit.
- Keep shared domain logic out of surface-specific directories when it can live under `src/packages/`.
- Default locale is `zh-CN`; every new user-facing flow must preserve i18n from day one.
- Use `shadcn/ui` light-theme Vercel-style restraint by default; avoid generic SaaS card grids.
- Use Motion intentionally for page load, state transitions, and key affordances; respect `prefers-reduced-motion`.
- Do not mix runtime / registry platform work into this workspace.
