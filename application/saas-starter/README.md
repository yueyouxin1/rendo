# application/saas-starter

This workspace is the local derived template workspace for `application/saas-starter`.

It was materialized from `application-base-starter`, but it is no longer the generic base starter. Its current role is:

- the canonical SaaS starter template workspace
- the immediate source of truth for independent `application/saas-starter` development
- the place where product-facing SaaS rules, frontend standards, and delivery checklists should live

## Read first

1. `docs/SaaS基座最佳实践技术栈选型.md`
2. `docs/SaaS前端与产品体验标准.md`
3. `docs/todo/README.md`
4. `docs/structure.md`
5. `docs/extension-points.md`
6. `docs/inheritance-boundaries.md`
7. `docs/secondary-development.md`

## Current non-goals

- no runtime / registry platform implementation
- no remote publish backend
- no Rendo dogfooding product logic

## Day-one product rules

- default locale is `zh-CN`; `en` is the first fallback locale
- default UI direction is Vercel-style refined minimalism on top of `shadcn/ui`
- motion is mandatory from day one, but must respect `prefers-reduced-motion`
- `web` is implemented first; `miniapp / mobile / desktop` remain first-class reserved surfaces
- all business, admin, billing, and configuration surfaces must fail visibly and gracefully when dependencies are not configured

## Commands

```bash
npm install
npm run health
npm run check
docker compose -f ops/docker/compose.yaml up
```
