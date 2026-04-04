# __RENDO_PROJECT_NAME__

This project was created from the Rendo `hello-world-starter`.

## Why it exists

- Validate that Domain Starters are authored from `rendo init` and the Core Starter contract
- Provide a minimal published starter that users can create with `rendo create`
- Keep the example small enough to audit end-to-end

## Commands

```bash
pnpm install
pnpm dev
pnpm health
pnpm check
pnpm docker:up
```

## Behavior

- `GET /` returns starter information
- `GET /health` returns the runtime snapshot
- `GET /hello` returns the hello-world domain response
