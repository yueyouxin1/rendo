# Rendo

Rendo is building a template-and-contract workspace for agent-oriented service foundations.

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
- `core -> base -> derived` must be born from a day-one architecture standard for agent-oriented services, not from ad-hoc starter code
- the current repository still focuses on contracts, core templates, CLI, official bases, and the minimum template-asset lifecycle

Rendo is not currently trying to ship:

- a full SaaS platform
- a marketplace UI
- registry management surfaces
- giant all-in-one starters

## Day-one architecture standard

Rendo treats the following as non-optional from day one:

- every template kind shares the same control-plane skeleton: `rendo.template.json`, `README.md`, `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/`, `interfaces/`, `src/`, `tests/`, `scripts/`, `install/`
- `starter-template` adds the host mount points: `features/`, `capabilities/`, `providers/`, `surfaces/`, and `ops/`
- Agent-facing entrypoints are expressed through `AGENTS.md`, `CLAUDE.md`, `.agents/`, and `interfaces/openapi/`, `interfaces/mcp/`, `interfaces/skills/`
- template-internal implementation uses `src/`; host mount points stay at the starter root and are not reused as template-internal implementation roots
- all templates must be verifiable; only `standalone-runnable` templates must also be independently bootable and provide health-check or equivalent heartbeat semantics
- containerized out-of-box delivery belongs under `ops/docker/`, not a universal top-level `docker/`

The detailed contract is frozen in:

- [docs/29-Rendo服务基座首日架构与目录标准.md](/D:/code/rendo/docs/29-Rendo服务基座首日架构与目录标准.md)

## Asset model

Rendo currently separates template authoring from formal template artifacts.

- [shared/authoring/templates](/D:/code/rendo/shared/authoring/templates)
  - the sole authoring source for official template production
  - current shared core authoring base lives under `core/common/skeleton`
  - `base` templates are produced by applying authoring overlays on top of formal core artifacts
- [shared/templates](/D:/code/rendo/shared/templates)
  - the formal generated template artifacts
  - consumed by the local registry and by both CLI implementations
  - current generated layout is `core/<kind>/<template-id>` and `base/<kind>/<category>/<template-id>`
- [shared/registry](/D:/code/rendo/shared/registry)
  - the language-neutral registry index that points at formal template artifacts
- [shared/contracts](/D:/code/rendo/shared/contracts)
  - manifest, project, bundle, remote-registry handshake, and remote API schemas

This means:

- `shared/authoring/templates` is the authoring truth
- `shared/templates` is the published artifact layer
- the CLI does not consume authoring overlays directly at runtime

## CLI boundary

Current Node and Python CLIs work today, but they are still asset-layout-based rather than self-contained binaries.

- local mode reads [shared/registry](/D:/code/rendo/shared/registry) and [shared/templates](/D:/code/rendo/shared/templates)
- remote mode supports HTTP `search / inspect / create / add / pull` through bundle download plus digest verification
- current tests prove remote compatibility against a fixture registry server
- a persistent official backend registry and self-contained CLI packaging are later phases, not prerequisites for the current repo workflow

So the current implementation is:

- usable inside this repository
- usable inside any distribution that preserves the same `shared/registry + shared/templates` asset layout
- not yet a single-file or embedded-asset binary distribution

## Current structure

- [shared/templates](/D:/code/rendo/shared/templates)
  - formal generated template artifacts consumed by the registry and both CLIs
- [shared/authoring/templates](/D:/code/rendo/shared/authoring/templates)
  - authoring source organized as `<role>/<kind>/<category>/<template-id>`
  - shared core skeleton plus per-template overlays
- [shared/registry](/D:/code/rendo/shared/registry)
  - language-neutral registry entries for service-foundation templates and attachable units
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
- which documents should be read first
- how it can be installed, hosted, upgraded, and verified
- which formal artifact path the registry resolves to

Current implemented manifest schemas already cover:

- template identity
- lineage
- documentation links
- runtime modes
- compatibility
- asset install metadata

The stronger day-one architecture semantics such as runtime shape and richer Agent entrypoint metadata are currently frozen first in the docs and will be pushed further into schema and CLI output as the next hardening step.

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

## Validation status

Verified in this workspace:

- Node CLI and Python CLI produce identical local `search` results
- Node CLI and Python CLI produce identical local `inspect` payloads
- `rendo init <kind>` creates core templates for all five template kinds
- `rendo create application --surfaces ...` creates runnable application base projects
- Node and Python CLIs add and pull provider base templates identically
- core templates stay aligned with the shared core authoring skeleton via `scripts/sync-core-templates.ts --check`
- remote `search / inspect / create / add / pull` flows are proven against the fixture registry with digest-verified bundle downloads

## Commands

```bash
npm install
npm run check
python -m compileall cli/python
node --import tsx scripts/sync-core-templates.ts --check
```
