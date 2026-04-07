# Secondary Development

This guide is for agents or developers extending a project created from `application-base-starter`.

## Recommended order

1. Read `rendo.template.json` and `rendo.project.json`.
2. Confirm which physical surfaces were generated.
3. Put shared contracts and domain logic into `src/packages/*` before editing individual surfaces.
4. Add business modules into `src/features/`, capabilities into `src/capabilities/`, providers into `src/providers/`, and optional shells into `src/surfaces/`.
5. Only after the shared shape is clear, customize `src/apps/web` or other surface directories.

## Large-project guidance

- prefer adding shared modules instead of letting `src/apps/web` become the dumping ground
- keep integrated template assets isolated under their dedicated `src/*` roots
- let derived starters change implementation detail, not the meaning of the `src/*` layout
- keep surface-specific UI and delivery code separate from shared application logic
