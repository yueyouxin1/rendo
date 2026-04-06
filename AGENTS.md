# AGENTS.md

## Mission

Build the first Rendo service-foundation template system around a unified `core -> base -> derived` backbone.

Rendo is not a generic agent platform, not a DSL builder, and not a full SaaS product at this stage.
The current goal is to deliver:

1. a stable `core` layer for every first-class service-foundation template kind
2. `rendo cli` as the default entrypoint
3. official `base` templates derived from those core templates
4. the minimum manifest contract plus asset-integration mechanism needed for template-asset extensibility
5. a day-one architecture and directory standard that makes every template born ready for agent-oriented service design

## Source Of Truth

Use the documents under `docs/` as the current source of truth.

Priority order:

1. `README.md`
2. `docs/00-Rendo服务基座新定位总纲.md`
3. `docs/29-Rendo服务基座首日架构与目录标准.md`
4. `docs/23-Rendo服务基座模板分层与分类体系说明.md`
5. `docs/05-Rendo服务基座阶段化开发路线图.md`
6. `docs/10-Rendo服务基座 CLI 最小协议定义.md`
7. `docs/11-Rendo服务基座模板 Manifest 规范.md`
8. `docs/13-Rendo服务基座 Managed、Source、Hybrid 运行模式定义.md`
9. `docs/18-rendo init、rendo create 与服务基座创建分工说明.md`
10. `docs/20-Rendo CLI 与服务基座模板、Pack、Registry 的关系说明.md`
11. `docs/24-Rendo服务基座模板分类的具体领域类型标准.md`

If implementation reality conflicts with a higher-priority document, follow the higher-priority document and update the lower-priority ones.

## What To Build Now

Build only the following sequence:

1. Phase 0: formalize contracts
2. Phase 1: implement the `core` template layer
3. Phase 2: harden `rendo cli`
4. Phase 3: implement official `base` templates
5. Phase 4: implement the minimum template-asset lifecycle

Do not jump ahead to marketplace UI, full SaaS product features, or management surfaces unless explicitly asked.

## Core Product Decisions

### Template backbone

All first-class service-foundation templates follow:

- `core`
- `base`
- `derived`

All first-class template kinds currently are:

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

### Core templates

Core templates must:

- be minimal
- be agent-readable
- be stable
- avoid premature product or vendor opinions
- define the control-plane contract for their template kind
- define language-agnostic architecture semantics and reserved root directories
- require `AGENTS.md`, `CLAUDE.md`, `.agents/`, `docs/`, `interfaces/`, `src/`, `tests/`, `scripts/`, and `integration/`
- distinguish `standalone-runnable` from `host-attached`
- reserve TDD-oriented test structure and verification entrypoints

Core templates are not end-user products.

### Base templates

Each template kind should have an official `base` template that represents the canonical best-practice starting point for that kind.

For starter templates, `base` must represent a production-evolvable service foundation rather than a demo scaffold.

The current minimum official bases are:

- `application-base-starter`
- `llm-provider-base-template`

Current-stage rule:

- keep only the minimum official base set needed to prove `create` plus non-starter `add / pull / integrate` with `assetIntegration.modes[].targetRoot`
- defer feature / capability / surface official bases until the rebuilt `core -> base` chain is stable

### CLI

`rendo cli` is a first-class product surface.

Command split:

- `rendo init <kind>`: initialize a core template
- `rendo create`: create a concrete service foundation project from a base or derived starter template
- `rendo search / inspect / add / pull / bundle / upgrade / doctor`: template and pack lifecycle

Current delivery boundary:

- the CLI consumes formal template artifacts from `shared/templates` through `shared/registry`
- `shared/authoring/templates` is authoring-only and is not consumed directly at runtime
- remote registry handshake plus bundle-backed `search / inspect / create / add / pull` are already implemented against the fixture registry
- `rendo bundle <ref>` exports deterministic local formal bundle artifacts from that formal layer
- `scripts/generate-runtime-catalog.ts` exports runtime-pre registry artifacts (`bundles/*.json`, `templates.snapshot.json`, `.well-known/rendo-registry.json`) without introducing official remote publish yet
- current implementations run against a repository-style or distribution-style asset layout
- self-contained binary packaging is later hardening work, not the current baseline

## Technology Direction

Prefer mature mainstream solutions over custom runtime implementations.

Do not build from scratch:

- auth systems
- billing engines
- database runtimes
- vector databases
- generic workflow engines
- generic agent runtimes

Custom code is justified only for:

- template standards
- manifests and contracts
- CLI
- provider adapters
- template-asset integration logic
- minimal Rendo integration glue

## Integration Policy

Templates should be Agent-callable and Rendo-ready before they are Rendo-dependent.

That means:

- define integration points up front
- keep `AGENTS.md`, `CLAUDE.md`, `.agents/`, and `interfaces/*` explicit
- keep the root architecture and directory contract stable across `core -> base -> derived`
- make business capabilities discoverable through explicit `interfaces/openapi`, `interfaces/mcp`, and `interfaces/skills` surfaces
- keep `src/` as the sole implementation root, including starter host slots under `src/apps/`, `src/packages/`, `src/features/`, `src/capabilities/`, `src/providers/`, and `src/surfaces/` (reserve `src/surfaces/desktop/`)
- use `integration/` for human/agent-readable host-impact guidance; legacy template-local `install/` guidance semantics are renamed to `integration/`, while physical install roots remain manifest-driven via `assetIntegration.modes[].targetRoot`
- prefer local manifests, mocks, and adapters first
- only bind real platform dependencies where the model truly needs validation

## Boundaries

Do not build:

- full Rendo SaaS
- marketplace UI
- enterprise control planes
- registry dashboards
- giant all-in-one starters
- hard dependency on Rendo cloud services

## Delivery Standard

Work is successful when:

1. every template kind has a documented `core` template
2. `rendo init <kind>` initializes a valid core template
3. official `base` templates are derived from the core layer
4. `rendo create` creates runnable starter-based service foundation projects
5. at least one official non-starter asset proves the `add / pull / integrate` lifecycle with machine-readable `assetIntegration.modes[].targetRoot` and `integration/` guidance
6. the day-one architecture and directory standard is inherited consistently by `core -> base -> derived`
7. the authoring source and formal artifact layer are clearly separated
8. strong agents can understand and operate the system through files, manifests, CLI, and structured outputs
9. runtime-pre deterministic bundle and snapshot artifacts are sufficient to hand off into the next runtime phase without requiring official remote publish first

## How To Work

When making implementation choices:

1. choose the smallest change that proves the architecture
2. prefer explicit files over hidden state
3. prefer contracts before UI
4. prefer template usefulness over platform ambition
5. prefer ecosystem tools over reinventing infrastructure

When in doubt, ask:

- Does this improve the core/base/derived backbone?
- Does this make the system easier for a strong agent to understand?
- Does this reduce zero-to-one uncertainty?
- Is this needed now, or is it platform drift?
