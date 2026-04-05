# Rendo Starter

Rendo Starter is the first best-practice Rendo template: a Docker-first, AI-native, web-first starter based on the Vercel `AI Chatbot` template and normalized around a unified `agent` concept.

## What It Is

- A real application starter, not a demo
- A source-first workspace for human and agent developers
- A default scaffold for agent, auth, RBAC, billing, knowledge base, workflow, and admin surfaces
- A monorepo that already reserves future miniapp, mobile, and desktop shells
- A reference standard for later Rendo templates

## What It Is Not

- Not a full Rendo product
- Not a generic agent platform
- Not a generic workflow engine
- Not a DSL runtime
- Not a template marketplace

## Repository Layout

- `apps/web`: main Next.js application
- `apps/miniapp`: reserved Taro shell placeholder
- `apps/mobile`: reserved Expo / React Native shell placeholder
- `apps/desktop`: reserved Tauri shell placeholder
- `packages/contracts`: shared cross-shell route, cookie, and agent contracts
- `packages/sdk`: shared SDK helpers for future shells
- `db`: database schema, migrations, and seed data
- `cache`: Redis-related helpers and defaults
- `docs`: product, architecture, UI, and extension guidance
- `agents`: agent-facing instructions
- `.github/copilot-instructions.md`: Copilot guidance
- `rendo.template.json`: template metadata

## Default Expectations

- `docker compose up` brings the starter online
- `docker compose -f docker-compose.release.yml up --build` provides a self-contained runtime path
- The app has an agent-first product shell
- The starter includes auth, RBAC, billing scaffolding, KB scaffolding, a default agent surface, a durable workflow example, and a lightweight admin view
- The starter is web-first today but keeps contracts and shell boundaries ready for future multi-end expansion
- The workspace is understandable to a strong agent without extra setup

## Runtime Modes

- `docker compose up`: development workspace mode with bind-mounted source code
- `docker compose -f docker-compose.release.yml up --build`: self-contained release mode with source baked into the image
- Low-resource local machines should run only one mode at a time. Use `pnpm docker:dev`, `pnpm docker:release`, and `pnpm docker:down` to switch safely.
- The first `dev` startup can take several minutes because the container installs Linux dependencies into fresh Docker volumes before it starts Next.js.

## Reference Docs

- [Product](docs/product.md)
- [Architecture](docs/architecture.md)
- [UI](docs/ui.md)
- [Setup](docs/setup.md)
- [Extension Points](docs/extension-points.md)
- [AGENTS](agents/AGENTS.md)
- [CLAUDE](agents/CLAUDE.md)
- [Copilot Instructions](.github/copilot-instructions.md)
- [Template Metadata](rendo.template.json)

## Working Principles

1. Build the starter before any distribution or platform features.
2. Prefer mature libraries and SDKs over custom runtime work.
3. Treat source code as the source of truth and containers as the default entry.
4. Prefer the default best path over maximum flexibility.
5. Keep the first template focused on one high-quality vertical starter.
