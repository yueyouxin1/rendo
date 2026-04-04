# AGENTS.md

## Mission

Build the first **Rendo starter system**, not a generic platform.

Rendo is **not** a DSL builder, not a generic Agent platform, and not a full SaaS product at this stage.
The immediate goal is to deliver:

1. a **Core Starter** as the only foundational starter contract
2. a **Rendo CLI** as the primary default entrypoint
3. the first high-quality **Domain Starter** built on that foundation
4. the minimum **Capability Pack** mechanism needed to prove extensibility

The product/platform surface must be kept minimal. Platform features should grow later from real starter usage.

## Source Of Truth

Use the documents under [doc](doc) as the current source of truth.

Priority order for interpretation:

1. [README.md](README.md)
2. [00-Rendo新定位总纲.md]
3. [Core Starter 与 Domain Starter 的重新分层说明.md]
4. [05-Rendo阶段化开发路线图.md]
5. [07-Core Starter 最小契约定义.md]
6. [08-Domain Starter 分类标准.md]
7. [09-Pack Manifest 最小规范.md]
8. [10-Rendo CLI 最小协议定义.md]
9. [11-Rendo Template Manifest 规范.md]
10. [12-Rendo Pack 安装计划与文件变更规则.md]
11. [13-Rendo Managed、Source、Hybrid 运行模式定义.md]
12. [14-Core Starter 接入 Rendo 能力的阶段策略.md]
13. [15-默认最优解与强制依赖的边界红线.md]
14. [16-Rendo CLI 作为默认最优解入口的定位与实现边界.md]
15. [17-Core Starter 的可运行性与非产品化边界.md]
16. [18-rendo init 与 rendo create 的命令分工说明.md]
17. [19-rendo create 的模板引用与 URL 规则.md]
18. [20-Rendo CLI 与 Starter、Pack、Registry 的关系说明.md]

If implementation reality conflicts with a document, follow the higher-priority document and update lower-priority docs to match.

## What To Build Now

Build only the following sequence:

1. **Phase 0**: formalize contracts already documented
2. **Phase 1**: implement `Core Starter`
3. **Phase 2**: implement `rendo cli`
4. **Phase 3**: implement the first `Domain Starter`
5. **Phase 4**: implement minimum `Capability Pack` mechanism

Do not jump ahead to full Rendo platform product features unless explicitly asked.

## Core Product Decisions

### Core Starter

`Core Starter` must:

- be runnable
- be minimal
- be agent-readable
- not default to a specific product shape like Next.js Web UI
- not strongly depend on real Rendo platform services

`Core Starter` is a **live engineering substrate**, not an end-user product.

### Domain Starter

The first `Domain Starter` can be Web-first and use `Next.js`, but `Next.js` belongs to `Domain Starter`, not `Core Starter`.

### CLI

`rendo cli` is a first-class product surface.

Command split:

- `rendo init`: initialize `Core Starter`
- `rendo create`: create a concrete `Domain Starter`
- `rendo search / inspect / add / pull / upgrade / doctor`: pack and starter lifecycle

### Packs

Packs are the natural extension mechanism.

Support:

- `source`
- `managed`
- `hybrid`

All packs must use manifest + install plan.

## Technology Direction

Prefer mature mainstream solutions over custom runtime implementations.

### Preferred stack for the first Web-first Saas Domain Starter

- `Next.js App Router`
- `TypeScript`
- `Tailwind CSS`
- `shadcn/ui`
- `Better Auth`
- `Drizzle ORM`
- `PostgreSQL`
- `Redis`
- `pgvector`
- `Vercel AI SDK`
- `Trigger.dev`
- `Stripe Billing`
- `Docker Compose`

### Do not build from scratch

Do not invest in custom implementations of:

- generic agent runtime
- generic workflow engine
- auth system
- billing engine
- database runtime
- message bus runtime
- vector database

Custom code is only justified for:

- starter standards
- manifests and contracts
- CLI
- provider adapters
- pack installation logic
- minimal Rendo integration layer
- domestic ecosystem adaptation

## Integration Policy

`Core Starter` must be **Rendo-ready**, not immediately **Rendo-dependent**.

Meaning:

- design all integration points from day one
- use local adapters / local manifests / mocks first
- connect to real Rendo backend only in the minimum places that validate the model

Do not make `Core Starter` require a real `Rendo API Key` to be useful.

## Boundaries / Non-Goals

Do not build:

- full Rendo SaaS
- template marketplace UI
- enterprise management product surface
- full registry UI
- full author dashboard
- multi-tenant platform product
- DSL runtime
- giant all-in-one starter

Do not let “default best path” become “hard dependency on Rendo”.

## Delivery Standard

Work is successful when all of the following are true:

1. `Core Starter` exists and is runnable
2. `rendo init` initializes a valid `Core Starter`
3. `rendo create` creates a concrete first `Domain Starter`
4. the first `Domain Starter` is runnable via Docker-first workflow
5. the first `Domain Starter` includes:
   - auth
   - RBAC basics
   - billing skeleton
   - database + migrations
   - Redis
   - basic KB
   - a default agent path
   - a durable workflow example
   - a lightweight admin surface
6. pack manifests and install plans are implemented
7. at least 1-3 official packs can be searched, inspected, installed and upgraded
8. strong agents can understand and operate the system through:
   - files
   - manifests
   - CLI
   - structured outputs

## How To Work

When making implementation choices:

1. choose the smallest thing that proves the architecture
2. prefer explicit files over hidden platform state
3. prefer contracts before UI
4. prefer starter usefulness over platform ambition
5. prefer mature ecosystem tools over reinventing runtime infrastructure

When in doubt, ask:

- Does this improve the first starter?
- Does this make the system easier for a strong Agent to understand?
- Does this reduce zero-to-one uncertainty?
- Is this really needed now, or is it platform drift?

If it does not help the starter, the CLI, the contracts, or the pack mechanism, it is probably out of scope for now.
