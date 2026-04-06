# Secondary Development

This file exists for agents and template authors who need to extend `starter-core-template`.

## Safe workflow

1. Read `rendo.template.json` first to understand identity, role, runtime modes, and compatibility.
2. Read `docs/structure.md` and `docs/extension-points.md` before adding files.
3. Put concrete opinion into a `base` template before creating any `derived` template.
4. Preserve health checks and manifest readability after every change.

## Do not do this in core

- add product-specific routes or UI
- bind a single vendor as a hard dependency
- hide required behavior behind undocumented scripts
- assume a specific host project layout that belongs to the next layer
