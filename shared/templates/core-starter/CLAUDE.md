# CLAUDE.md

## Working model

- `apps/runtime` is the live validation surface.
- `packages/contracts` describes machine-readable contracts.
- `packages/sdk` hosts local or managed adapters.
- `packages/domain` composes the runtime snapshot shown by the health server.

## Change policy

- Keep changes small and reversible.
- Do not add Web UI, auth, billing, or database defaults here.
- If a new provider is added, keep a local fallback.
