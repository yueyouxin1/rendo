# Secondary Development

This guide is for agents or developers extending a project created from `application-base-starter`.

## Recommended order

1. Read `rendo.template.json` and `rendo.project.json`.
2. Confirm which physical surfaces were generated.
3. Put shared contracts and domain logic into `packages/*` before editing individual surfaces.
4. Add business modules into `features/`, capabilities into `capabilities/`, providers into `providers/`, and optional shells into `surfaces/`.
5. Only after the shared shape is clear, customize `apps/web` or other surface directories.

## Large-project guidance

- prefer adding packages instead of letting `apps/web` become the dumping ground
- keep installable template assets isolated under their dedicated roots
- let derived starters change implementation detail, not the meaning of the top-level layout
- keep surface-specific UI and delivery code separate from shared application logic
