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

- every Rendo-recognizable workspace carries a CLI-managed `.rendo/` namespace that owns `rendo.template.json`, `rendo.project.json`, and future workspace metadata
- every template kind shares the same control-plane skeleton outside that namespace: `README.md`, `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/`, `interfaces/`, `src/`, `tests/`, `scripts/`, `integration/`
- legacy template-local `install/` guidance semantics are renamed to `integration/`; `integration/` is guidance-only and does not define physical install roots
- `starter-template` reserves host-facing implementation slots under `src/`: `src/apps/`, `src/packages/`, `src/features/`, `src/capabilities/`, `src/providers/`, `src/surfaces/` (with `src/surfaces/desktop/` reserved), and keeps `ops/` for runtime delivery concerns
- Agent-facing entrypoints are expressed through `AGENTS.md`, `CLAUDE.md`, `.agents/`, and `interfaces/openapi/`, `interfaces/mcp/`, `interfaces/skills/`
- implementation lives under `src/` across all template kinds; root-level `apps/`, `packages/`, `features/`, `capabilities/`, `providers/`, and `surfaces/` are no longer the standard
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
  - the internal distribution artifacts generated from authoring sources
  - consumed by the local registry, bundle export, and both CLI implementations
  - current generated layout is `core/<kind>/<template-id>` and `base/<kind>/<category>/<template-id>`
- [shared/registry](/D:/code/rendo/shared/registry)
  - the language-neutral registry index that points at formal template artifacts
- [shared/contracts](/D:/code/rendo/shared/contracts)
  - manifest, project, bundle, registry-snapshot, remote-registry handshake, and remote API schemas

This means:

- `shared/authoring/templates` is the authoring truth
- `shared/templates` is the internal distribution artifact layer
- the CLI does not consume authoring overlays directly at runtime
- users and agents should develop inside the materialized local workspace, not inside `shared/templates`

## Workspace model

Rendo now needs a clearer distinction between:

- template source lineage
- local workspace identity
- published template role

The recommended direction is:

- `.rendo/` marks a workspace as Rendo-recognizable
- `.rendo/rendo.project.json` records local workspace identity such as workspace id, local name, origin template, selected surfaces, and installed assets
- `.rendo/rendo.template.json` is a CLI-managed publishable template projection, not a file users should hand-maintain
- deleting `.rendo/` detaches the workspace from Rendo, similar to deleting `.git/`

Current rule to freeze:

- `core`, `base`, and `derived` primarily describe published template artifacts
- user-created workspaces may originate from `core`, `base`, or `derived`
- `rendo init / create / pull` should immediately project local non-official workspaces to `derived` while preserving source lineage separately in `.rendo/rendo.project.json`
- community publish should keep that `derived` projection and preserve source lineage separately

This removes the need for users to manually reason about template-role transitions during day-to-day development.

## CLI boundary

Current Node and Python CLIs work today, but they are still asset-layout-based rather than self-contained binaries.

- local mode reads [shared/registry](/D:/code/rendo/shared/registry) and [shared/templates](/D:/code/rendo/shared/templates)
- remote mode supports HTTP `search / inspect / create / add / pull` through bundle download plus digest verification
- `rendo bundle <ref>` exports a formal local bundle artifact from the formal template layer
- `rendo publish --local` exports the current local workspace as a publishable bundle artifact, using `.gitignore` as the default file filter while force-including `.rendo/**`
- `npm run generate:runtime-catalog -- <outputDir> [--api-base-url=...]` exports runtime-pre deterministic registry artifacts: `bundles/*.json`, `templates.snapshot.json`, `index.json`, and `.well-known/rendo-registry.json`
- current tests prove remote compatibility against a fixture registry server
- a persistent official backend registry, official remote publish, and self-contained CLI packaging are later phases, not prerequisites for the current repo workflow

So the current implementation is:

- usable inside this repository
- usable inside any distribution that preserves the same `shared/registry + shared/templates` asset layout
- not yet a single-file or embedded-asset binary distribution

## Runtime-pre artifacts

Before entering the real runtime / SaaS phase, Rendo now freezes one deterministic artifact boundary:

- template-local manifest remains the author-side canonical declaration
- `rendo bundle <ref>` exports the transport artifact actually consumed by local/remote template flows
- `templates.snapshot.json` is a deterministic runtime-pre catalog snapshot derived from formal artifacts
- `.well-known/rendo-registry.json` can point at that snapshot through `snapshot.url` and `snapshot.digest`

Current rule:

- runtime-pre deterministic artifacts contain only code-deterministic fields
- richer release-facing narration can be added later by strong-Agent publishing workflows
- official remote `publish` is still deferred

## Current structure

- [shared/templates](/D:/code/rendo/shared/templates)
  - internal distribution artifacts consumed by the registry and both CLIs
- [shared/authoring/templates](/D:/code/rendo/shared/authoring/templates)
  - authoring source organized as `<role>/<kind>/<category>/<template-id>`
  - shared core skeleton plus per-template overlays
- [shared/registry](/D:/code/rendo/shared/registry)
  - language-neutral registry entries for service-foundation templates and attachable units
- [shared/contracts](/D:/code/rendo/shared/contracts)
  - manifest, project, registry-snapshot, remote-registry handshake, remote API, and bundle schemas
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
- `llm-provider-base-template`

Current stage note:

- only the minimum official base set is kept active in the registry and tests
- `application-base-starter` proves starter creation and host-root architecture
- `llm-provider-base-template` proves non-starter `add / pull / integrate` closure with manifest-driven `assetIntegration.modes[].targetRoot`
- feature / capability / surface bases are deferred until the rebuilt core/base chain is stable

Derived templates:

- directory and contract conventions are defined
- no official generated `derived` template is published in the local registry yet

## Why Each Layer Exists

`core` is not valuable because it is empty.
Its value is that it freezes the Rendo engineering language:

- directory truth
- Agent entrypoints
- interface surfaces
- testing and verification skeleton
- integration boundaries
- publishable workspace expectations

`base` is not a thin shell for its own sake.
Its value is that it is the official reference implementation of that engineering language for a specific template kind.

`derived` is where concrete product, scenario, and community variation should live.
Its value is that teams can ship opinionated templates without rewriting or forking the underlying Rendo language every time.

## Manifest semantics

Every template manifest is expected to tell humans and strong agents:

- what kind of template this is
- whether it is `core`, `base`, or `derived`
- whether it creates the foundation root or attaches into an existing foundation
- which documents should be read first
- how it can be installed, hosted, upgraded, and verified
- which registry/runtime-pre catalog artifact entry corresponds to it

Current implemented manifest schemas and CLI surfaces now cover:

- template identity
- lineage (`coreTemplate` / `baseTemplate` / `parentTemplate`)
- documentation links
- architecture semantics
- runtime modes
- compatibility
- asset integration metadata
- integration guidance links

The runtime-pre deterministic catalog snapshot intentionally derives a subset of that manifest surface plus artifact digests.
It is meant for runtime/indexing consumption and may omit richer presentation fields such as `title` and `description`, even though those fields still remain required in the template manifest.

For the runtime-pre phase, the hard contract should stay focused on code-deterministic data.
Richer release-facing metadata can be added later by strong Agent workflows before publishing, but CLI/runtime correctness should not depend on that enrichment.

The day-one architecture semantics are now exposed through manifest schema, `inspect`, and `doctor`, so strong agents can read runtime shape, Agent entrypoints, interface roots, and mount roots without guessing.

## Authoring usage

Generate official templates from authoring profiles:

```bash
npm run generate:template -- base/starter/application/application-base-starter
npm run generate:template -- base/provider/llm/llm-provider-base-template
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
node --import tsx cli/node/src/bin.ts bundle application-base-starter --output ./artifacts/application-base-starter.rendo-bundle.json
node --import tsx cli/node/src/bin.ts publish --local --output ./artifacts/application-workspace.rendo-publish.json
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
python cli/python/rendo.py bundle application-base-starter --output .\\artifacts\\application-base-starter.rendo-bundle.json
python cli/python/rendo.py publish --local --output .\\artifacts\\application-workspace.rendo-publish.json
python cli/python/rendo.py search --registry http://127.0.0.1:3000 --json
```

Expected workspace behavior:

- `rendo init <kind>` should seed a Rendo-recognizable workspace from an official `core` source
- `rendo create <starter>` should seed a Rendo-recognizable workspace from an official `base` or `derived` starter source
- `rendo pull <ref> --output <dir>` should seed a local derived workspace from any pulled template source
- both should initialize `.rendo/` metadata with a stable workspace id and sensible local project name
- neither should force users to manually maintain publish metadata
- local workspaces should already carry the `derived` projection in `.rendo/`, and later community publish should preserve it automatically

## Validation status

Verified in this workspace:

- Node CLI and Python CLI produce identical local `search` results
- Node CLI and Python CLI produce identical local `inspect` payloads
- Node CLI and Python CLI export identical local bundle artifacts
- `rendo init <kind>` creates core templates for all five template kinds
- `rendo create application --surfaces ...` creates runnable application base projects
- Node and Python CLIs add and pull provider base templates identically
- core templates stay aligned with the shared core authoring skeleton via `scripts/sync-core-templates.ts --check`
- runtime catalog export produces `templates.snapshot.json` plus handshake snapshot metadata with matching digests
- remote `search / inspect / create / add / pull` flows are proven against the fixture registry with digest-verified bundle downloads

## Commands

```bash
npm install
npm run check
python -m compileall cli/python
node --import tsx scripts/sync-core-templates.ts --check
```
