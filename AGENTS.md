# AGENTS.md

## Mission

Build the first **Rendo starter system**, not a generic platform.

Rendo is **not** a DSL builder, not a generic Agent platform, and not a full SaaS product at this stage.
The immediate goal is to deliver:

1. a **Core Starter** as the only foundational starter contract
2. a **Rendo CLI** as the primary default entrypoint
3. the first high-quality **Starter Template** built on that foundation
4. the minimum **Capability Template** mechanism needed to prove extensibility

The product/platform surface must be kept minimal. Platform features should grow later from real starter usage.

## Source Of Truth

Use the documents under [doc/rendo](doc/rendo) as the current source of truth.

Priority order for interpretation:

1. [README.md](doc/rendo/README.md)
2. [00-Rendo新定位总纲.md](doc/rendo/00-Rendo%E6%96%B0%E5%AE%9A%E4%BD%8D%E6%80%BB%E7%BA%B2.md)
3. [Core Starter 与 Domain Starter 的重新分层说明.md](doc/rendo/Core%20Starter%20%E4%B8%8E%20Domain%20Starter%20%E7%9A%84%E9%87%8D%E6%96%B0%E5%88%86%E5%B1%82%E8%AF%B4%E6%98%8E.md)
4. [05-Rendo阶段化开发路线图.md](doc/rendo/05-Rendo%E9%98%B6%E6%AE%B5%E5%8C%96%E5%BC%80%E5%8F%91%E8%B7%AF%E7%BA%BF%E5%9B%BE.md)
5. [07-Core Starter 最小契约定义.md](doc/rendo/07-Core%20Starter%20%E6%9C%80%E5%B0%8F%E5%A5%91%E7%BA%A6%E5%AE%9A%E4%B9%89.md)
6. [08-Domain Starter 分类标准.md](doc/rendo/08-Domain%20Starter%20%E5%88%86%E7%B1%BB%E6%A0%87%E5%87%86.md)
7. [09-Pack Manifest 最小规范.md](doc/rendo/09-Pack%20Manifest%20%E6%9C%80%E5%B0%8F%E8%A7%84%E8%8C%83.md)
8. [10-Rendo CLI 最小协议定义.md](doc/rendo/10-Rendo%20CLI%20%E6%9C%80%E5%B0%8F%E5%8D%8F%E8%AE%AE%E5%AE%9A%E4%B9%89.md)
9. [11-Rendo Template Manifest 规范.md](doc/rendo/11-Rendo%20Template%20Manifest%20%E8%A7%84%E8%8C%83.md)
10. [12-Rendo Pack 安装计划与文件变更规则.md](doc/rendo/12-Rendo%20Pack%20%E5%AE%89%E8%A3%85%E8%AE%A1%E5%88%92%E4%B8%8E%E6%96%87%E4%BB%B6%E5%8F%98%E6%9B%B4%E8%A7%84%E5%88%99.md)
11. [13-Rendo Managed、Source、Hybrid 运行模式定义.md](doc/rendo/13-Rendo%20Managed%E3%80%81Source%E3%80%81Hybrid%20%E8%BF%90%E8%A1%8C%E6%A8%A1%E5%BC%8F%E5%AE%9A%E4%B9%89.md)
12. [14-Core Starter 接入 Rendo 能力的阶段策略.md](doc/rendo/14-Core%20Starter%20%E6%8E%A5%E5%85%A5%20Rendo%20%E8%83%BD%E5%8A%9B%E7%9A%84%E9%98%B6%E6%AE%B5%E7%AD%96%E7%95%A5.md)
13. [15-默认最优解与强制依赖的边界红线.md](doc/rendo/15-%E9%BB%98%E8%AE%A4%E6%9C%80%E4%BC%98%E8%A7%A3%E4%B8%8E%E5%BC%BA%E5%88%B6%E4%BE%9D%E8%B5%96%E7%9A%84%E8%BE%B9%E7%95%8C%E7%BA%A2%E7%BA%BF.md)
14. [16-Rendo CLI 作为默认最优解入口的定位与实现边界.md](doc/rendo/16-Rendo%20CLI%20%E4%BD%9C%E4%B8%BA%E9%BB%98%E8%AE%A4%E6%9C%80%E4%BC%98%E8%A7%A3%E5%85%A5%E5%8F%A3%E7%9A%84%E5%AE%9A%E4%BD%8D%E4%B8%8E%E5%AE%9E%E7%8E%B0%E8%BE%B9%E7%95%8C.md)
15. [17-Core Starter 的可运行性与非产品化边界.md](doc/rendo/17-Core%20Starter%20%E7%9A%84%E5%8F%AF%E8%BF%90%E8%A1%8C%E6%80%A7%E4%B8%8E%E9%9D%9E%E4%BA%A7%E5%93%81%E5%8C%96%E8%BE%B9%E7%95%8C.md)
16. [18-rendo init 与 rendo create 的命令分工说明.md](doc/rendo/18-rendo%20init%20%E4%B8%8E%20rendo%20create%20%E7%9A%84%E5%91%BD%E4%BB%A4%E5%88%86%E5%B7%A5%E8%AF%B4%E6%98%8E.md)
17. [19-rendo create 的模板引用与 URL 规则.md](doc/rendo/19-rendo%20create%20%E7%9A%84%E6%A8%A1%E6%9D%BF%E5%BC%95%E7%94%A8%E4%B8%8E%20URL%20%E8%A7%84%E5%88%99.md)
18. [20-Rendo CLI 与 Starter、Pack、Registry 的关系说明.md](doc/rendo/20-Rendo%20CLI%20%E4%B8%8E%20Starter%E3%80%81Pack%E3%80%81Registry%20%E7%9A%84%E5%85%B3%E7%B3%BB%E8%AF%B4%E6%98%8E.md)

If implementation reality conflicts with a document, follow the higher-priority document and update lower-priority docs to match.

## What To Build Now

Build only the following sequence:

1. **Phase 0**: formalize contracts already documented
2. **Phase 1**: implement `Core Starter`
3. **Phase 2**: implement `rendo cli`
4. **Phase 3**: implement the first `Starter Template`
5. **Phase 4**: implement minimum `Capability Template` mechanism

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

### Starter Template

The first `Starter Template` can be Web-first and use `Next.js`, but `Next.js` belongs to `Starter Template`, not `Core Starter`.

### CLI

`rendo cli` is a first-class product surface.

Command split:

- `rendo init`: initialize `Core Starter`
- `rendo create`: create a concrete `Starter Template`
- `rendo search / inspect / add / pull / upgrade / doctor`: capability-template and starter lifecycle

### Capability Templates

Capability Templates are the natural extension mechanism.

Support:

- `source`
- `managed`
- `hybrid`

All capability templates must use manifest + install plan.

## Technology Direction

Prefer mature mainstream solutions over custom runtime implementations.

### Preferred stack for the first Web-first SaaS Starter Template

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
- capability template installation logic
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
3. `rendo create` creates a concrete first `Starter Template`
4. the first `Starter Template` is runnable via Docker-first workflow
5. the first `Starter Template` includes:
   - auth
   - RBAC basics
   - billing skeleton
   - database + migrations
   - Redis
   - basic KB
   - a default agent path
   - a durable workflow example
   - a lightweight admin surface
6. capability template manifests and install plans are implemented
7. at least 1-3 official capability templates can be searched, inspected, installed and upgraded
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

If it does not help the starter, the CLI, the contracts, or the capability-template mechanism, it is probably out of scope for now.
