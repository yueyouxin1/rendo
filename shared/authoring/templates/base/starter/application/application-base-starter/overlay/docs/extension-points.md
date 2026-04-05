# Extension Points

## Shared control plane

- `rendo.template.json`
- `rendo.project.json`
- root `docker-compose.yml`

## Web side

- `apps/web/app/page.tsx`
- `apps/web/components/surface-summary.tsx`

## Extra surfaces

- `apps/miniapp`
- `apps/mobile`

## Composition contract

All generated surfaces belong to one starter identity, but `rendo create` decides which ones are physically present.
