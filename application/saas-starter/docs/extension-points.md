# Extension Points

## Control plane

- `rendo.template.json`
- `rendo.project.json`
- `integration/*`
- `ops/docker/compose.yaml`
- root `docs/*`

## Surface implementations

- `src/apps/web/app/page.tsx`
- `src/apps/web/components/surface-summary.tsx`
- future modules under `src/apps/web` that stay specific to the web surface

## Shared application layer

- `src/packages/contracts`
- `src/packages/domain`
- `src/packages/shared`
- `src/packages/config`

## Integration roots for non-starter assets

- `src/features/`
- `src/capabilities/`
- `src/providers/`
- `src/surfaces/`

## Optional extra surfaces

- `src/apps/miniapp`
- `src/apps/mobile`
- `src/apps/desktop`

## Composition contract

All generated surfaces belong to one starter identity, but `rendo create` decides which ones are physically present. Keep cross-surface contracts in `src/packages/*`, and keep host-integrated assets inside the dedicated `src/*` roots instead of scattering them through surface directories.
