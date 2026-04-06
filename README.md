# Rendo

Rendo is currently building the first template-and-contract workspace for agent-oriented service foundations.

Its active backbone is:

1. `core`
2. `base`
3. `derived`

Its first-class template kinds are:

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

## Current position

Rendo is no longer described as a generic template shelf or a starter-only asset set.

The current normative position is:

- `starter-template` is the root template for a runnable service foundation
- `feature-template` / `capability-template` / `provider-template` / `surface-template` are attachable service units around that foundation
- `rendo cli` is the default entrypoint for initializing, creating, searching, inspecting, and installing these assets
- the current repository still focuses only on contracts, core templates, CLI, official bases, and the minimum capability-template lifecycle

Rendo is not currently trying to ship:

- a full SaaS platform
- a marketplace UI
- registry management surfaces
- giant all-in-one starters

## Service foundation baseline

The new product narrative is "agent-oriented service foundation", but the implementation path is still template-first.

That means the repository is standardizing how a service foundation should be described before trying to build the larger platform around it.

For a runnable starter foundation, the long-term baseline is:

- `.agent/instructions.md`
- `.agent/capabilities.yaml`
- `.agent/review_checklist.md`
- `api/openapi.yaml`
- `mcp/server.yaml`
- `skills/skill_manifest.json`
- `docs/modules/*`

Current docs formalize this target contract. Not every generated template in this workspace already exposes the full surface yet.

## Current structure

- [shared/templates](/D:/code/rendo/shared/templates)
  - generated template assets consumed by the registry and both CLIs
  - `core/<kind>/<template-id>`
  - `base/<kind>/<category>/<template-id>`
  - `derived/<kind>/<category>/<template-id>`
- [shared/authoring/templates](/D:/code/rendo/shared/authoring/templates)
  - authoring source organized as `<role>/<kind>/<category>/<template-id>`
  - generic authoring overlays for `base` and future `derived`
  - shared skeleton for `core` synchronization
- [shared/registry](/D:/code/rendo/shared/registry)
  - language-neutral registry for service-foundation templates and attachable units
- [shared/contracts](/D:/code/rendo/shared/contracts)
  - manifest, project, remote-registry handshake, remote API, and bundle schemas
- [cli/node](/D:/code/rendo/cli/node)
  - Node implementation of the Rendo CLI
- [cli/python](/D:/code/rendo/cli/python)
  - Python implementation of the Rendo CLI

## Implemented official templates

Core templates:

- `starter-core-template`
- `feature-core-template`
- `capability-core-template`
- `provider-core-template`
- `surface-core-template`

Base templates:

- `application-base-starter`
- `dashboard-feature-base-template`
- `storage-capability-base-template`
- `llm-provider-base-template`
- `admin-surface-base-template`

Derived templates:

- directory and contract conventions are defined
- no official generated `derived` template is published in the local registry yet

## Manifest semantics

Every template manifest is expected to tell humans and strong agents:

- what kind of template this is
- whether it is `core`, `base`, or `derived`
- whether it creates the foundation root or attaches into an existing foundation
- which agent-facing artifacts and interfaces it provides or extends
- which documents should be read first
- how it can be installed, hosted, upgraded, and verified

Projects created from a starter template record their origin in `rendo.project.json` under `template`.

Installed non-starter templates record:

- version
- runtime mode
- local vs remote source
- registry id
- bundle digest
- template digest

## CLI usage

Node CLI:

```bash
node --import tsx cli/node/src/bin.ts search --type all --json
node --import tsx cli/node/src/bin.ts init starter --output my-starter-core
node --import tsx cli/node/src/bin.ts create application --surfaces web,miniapp --output my-app
node --import tsx cli/node/src/bin.ts inspect llm-provider-base-template --json
node --import tsx cli/node/src/bin.ts search --registry http://127.0.0.1:3000 --json
node --import tsx cli/node/src/bin.ts pull application-base-starter --registry http://127.0.0.1:3000 --output pulled-app
```

Python CLI:

```bash
python cli/python/rendo.py search --type all --json
python cli/python/rendo.py inspect llm-provider-base-template --json
python cli/python/rendo.py init provider --output my-provider-core
python cli/python/rendo.py create application --surfaces web --output my-app
python cli/python/rendo.py add llm-provider-base-template --json
python cli/python/rendo.py search --registry http://127.0.0.1:3000 --json
```

## Authoring usage

Generate official templates from authoring profiles:

```bash
npm run generate:template -- base/starter/application/application-base-starter
npm run generate:template -- base/feature/dashboard/dashboard-feature-base-template
npm run generate:template -- base/capability/storage/storage-capability-base-template
npm run generate:template -- base/provider/llm/llm-provider-base-template
npm run generate:template -- base/surface/admin/admin-surface-base-template
```

Sync and validate the shared core skeleton:

```bash
node --import tsx scripts/sync-core-templates.ts
node --import tsx scripts/sync-core-templates.ts --check
```

The generated outputs are written into [shared/templates](/D:/code/rendo/shared/templates).

## Validation status

Verified in this workspace:

- Node CLI and Python CLI produce identical local `search` results
- Node CLI and Python CLI produce identical local `inspect` payloads
- `rendo init <kind>` creates runnable core templates
- `rendo create application --surfaces ...` creates runnable application base projects
- Node and Python CLIs add and pull provider base templates identically
- core templates stay aligned with the shared skeleton via `scripts/sync-core-templates.ts --check`
- local fixture-based remote registry responses are supported by both CLIs with digest-verified bundle downloads

## Commands

```bash
npm install
npm run check
python -m compileall cli/python
node --import tsx scripts/sync-core-templates.ts --check
```
