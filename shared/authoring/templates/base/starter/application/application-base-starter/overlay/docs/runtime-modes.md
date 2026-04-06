# Runtime Modes

`application-base-starter` intentionally supports `source` mode only.

## Why

- it is the smallest reliable default for local development and agent iteration
- it keeps the starter Rendo-ready before introducing platform bindings
- managed and hybrid concerns should enter through installed capabilities, providers, or derived starters

## Upgrade path

When a stronger starter needs managed or hybrid semantics, derive from this base and document the new runtime expectations explicitly instead of mutating the meaning of this base starter.
