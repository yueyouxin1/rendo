# AGENTS.md

## Mission

Build the first Rendo service-foundation template system around a unified `core -> base -> derived` backbone.

Rendo is not a generic agent platform, not a DSL builder, and not a full SaaS product at this stage.
The current goal is to deliver:

1. a stable `core` layer for every first-class service-foundation template kind
2. `rendo cli` as the default entrypoint
3. official `base` templates derived from those core templates
4. the minimum manifest and install-plan mechanism needed for capability extensibility

## Source Of Truth

Use the documents under `docs/` as the current source of truth.

Priority order:

1. `README.md`
2. `docs/00-Rendo服务基座新定位总纲.md`
3. `docs/23-Rendo服务基座模板分层与分类体系说明.md`
4. `docs/05-Rendo服务基座阶段化开发路线图.md`
5. `docs/10-Rendo服务基座 CLI 最小协议定义.md`
6. `docs/11-Rendo服务基座模板 Manifest 规范.md`
7. `docs/13-Rendo服务基座 Managed、Source、Hybrid 运行模式定义.md`
8. `docs/18-rendo init、rendo create 与服务基座创建分工说明.md`
9. `docs/20-Rendo CLI 与服务基座模板、Pack、Registry 的关系说明.md`
10. `docs/24-Rendo服务基座模板分类的具体领域类型标准.md`

If implementation reality conflicts with a higher-priority document, follow the higher-priority document and update the lower-priority ones.

## What To Build Now

Build only the following sequence:

1. Phase 0: formalize contracts
2. Phase 1: implement the `core` template layer
3. Phase 2: implement `rendo cli`
4. Phase 3: implement official `base` templates
5. Phase 4: implement the minimum capability-template lifecycle

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
- reserve explicit integration surfaces for `.agent/`, `api/`, `mcp/`, `skills/`, and module docs

Core templates are not end-user products.

### Base templates

Each template kind should have an official `base` template that represents the canonical best-practice starting point for that kind.

The current official bases are:

- `application-base-starter`
- `dashboard-feature-base-template`
- `storage-capability-base-template`
- `llm-provider-base-template`
- `admin-surface-base-template`

### CLI

`rendo cli` is a first-class product surface.

Command split:

- `rendo init <kind>`: initialize a core template
- `rendo create`: create a concrete service foundation project from a base or derived starter template
- `rendo search / inspect / add / pull / upgrade / doctor`: template and pack lifecycle

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
- capability template install logic
- minimal Rendo integration glue

## Integration Policy

Templates should be Agent-callable and Rendo-ready before they are Rendo-dependent.

That means:

- define integration points up front
- keep `.agent`, `api`, `mcp`, `skills`, and module-doc surfaces explicit
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
5. capability templates remain manifest-driven and install-plan-driven
6. strong agents can understand and operate the system through files, manifests, CLI, and structured outputs

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
