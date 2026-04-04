# Rendo

Rendo is building a starter system for strong agents, not a generic platform.

Current implementation focus:

1. Production-grade `Core Starter`
2. Production-grade `rendo cli`
3. Minimal authoring proof that a `Domain Starter` is created from `rendo init`
4. Minimal consumer proof that users can `rendo create` a published domain starter

The current published validation starter is `hello-world-starter`. It exists only to prove the contract and workflow. It is not intended to be the first real business starter.

## Mental model

### Author side

Use `rendo init` to create a `Core Starter` workspace, then evolve that workspace into a `Domain Starter` and publish it.

Author flow:

```bash
rendo init my-domain-starter
# develop on top of the Core Starter contract
# publish the resulting Domain Starter to registry
```

### User side

Use `rendo create` to instantiate an already-published `Domain Starter`.

Consumer flow:

```bash
rendo create hello-world-starter my-app
```

## Repository layout

- `src/`: CLI implementation and shared scaffolding logic
- `templates/core-starter`: the only foundational starter contract
- `templates/hello-world-starter`: minimal Domain Starter asset generated from Core Starter
- `authoring/`: domain-starter authoring profiles and overlays, grouped by domain category
- `scripts/generate-domain-starter.ts`: generic author-side generation entrypoint
- `scripts/generate-hello-world-starter.ts`: thin wrapper for the hello-world sample profile
- `registry/`: local starter and pack indexes used by the CLI
- `doc/`: source-of-truth documents

## CLI commands

```bash
rendo init <dir>
rendo create <starter-ref> <dir>
rendo search --type starter --keyword hello
rendo inspect hello-world-starter
rendo doctor
```

Pack commands are present in the CLI surface because they are part of the protocol, but the current registry intentionally does not ship official packs in this phase.

## Development

```bash
npm install
npm run check
npm run generate:domain-starter -- headless-agent/hello-world
npm run refresh:hello-world-starter
npm test
```

## Current boundary

- `Core Starter` must be runnable, minimal, and agent-readable.
- `Core Starter` must not default to Next.js, product UI, auth, billing, or database stacks.
- `hello-world-starter` must stay tiny and only validate the authoring and consumption flow.
- Full SaaS/AI business starters come later, after `rendo cli` and `Core Starter` are stable.
