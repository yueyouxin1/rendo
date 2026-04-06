# Extension Points

## Control plane

- `rendo.template.json`
- `rendo.project.json`
- root `docker-compose.yml`
- root `docs/*`

## Surface implementations

- `apps/web/app/page.tsx`
- `apps/web/components/surface-summary.tsx`
- future modules under `apps/web` that stay specific to the web surface

## Shared application layer

- `packages/contracts`
- `packages/domain`
- `packages/shared`
- `packages/config`

## Install roots for non-starter assets

- `features/`
- `capabilities/`
- `providers/`
- `surfaces/`

## Optional extra surfaces

- `apps/miniapp`
- `apps/mobile`

## Composition contract

All generated surfaces belong to one starter identity, but `rendo create` decides which ones are physically present. Keep cross-surface contracts in `packages/*`, and keep host-installed assets inside the dedicated install roots instead of scattering them through `apps/*`.
