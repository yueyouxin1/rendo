# SaaS 基座最佳实践技术栈选型

> 文档定位：定义 `shared/authoring/templates/derived/starter/application/saas-starter` 的 canonical 技术栈与架构边界。
>
> `application/saas-starter` 是未来大量 SaaS 项目的高质量起点，也是后续 `rendo-saas-starter` 的直接上游。
>
> 本文以 2026-04-07 为时间基线。文中的“事实依据”来自官方资料；文中的“默认技术选型”是结合 Rendo 定位做出的工程判断。

---

## 1. 结论先说

`application/saas-starter` 的默认技术栈应当是：

- **运行时**：`Node.js 24 Active LTS`
- **语言**：`TypeScript`（strict）
- **工作区**：`pnpm workspaces + Turborepo`
- **Web 主界面**：`Next.js App Router + React`
- **Web UI 系统**：`Tailwind CSS v4 + shadcn/ui`
- **Canonical HTTP API**：`Hono + Zod + OpenAPI 3.1`
- **Canonical Agent API**：`MCP TypeScript SDK`
- **认证与多租户**：`Better Auth`
- **主数据库**：`PostgreSQL + pgvector`
- **ORM / migration**：`Drizzle ORM + drizzle-kit`
- **数据库驱动**：`node-postgres (pg)`
- **缓存 / 队列基线**：`Redis-compatible（自托管优先 Valkey） + BullMQ`
- **支付计费**：`Stripe Billing`
- **邮件**：`Resend + React Email`
- **对象存储**：`S3-compatible storage`（本地 `MinIO`，云上可接 `S3 / R2 / 兼容实现`）
- **可观测性**：`OpenTelemetry + 结构化 JSON 日志`
- **测试**：`Vitest + Playwright`
- **本地交付**：`Docker Compose`

默认多端策略也应直接写死：

- **默认多端架构**：`web + miniapp + mobile + desktop`
- **当前实现优先级**：`web` 完整实现，`miniapp / mobile / desktop` 作为一等预留 surface
- **推荐多端路线**：
  - `miniapp`：`Taro (React)`
  - `mobile`：`React Native + Expo`
  - `desktop`：保留位，后续优先 `Electron` 派生

同时必须明确：

- **Supabase 不应成为 canonical `saas-starter` 的默认整包平台基座**
- **Trigger.dev 不应成为 canonical `saas-starter` 的默认必选后台任务运行时**
- **不能把 Next.js 和 Hono 理解为两套并列后端真相**

正确的分工是：

- `Next.js` 负责 `web` surface 与 web-adjacent server concerns
- `Hono` 负责唯一的 canonical HTTP service API
- `MCP` 负责唯一的 canonical Agent API
- `domain / application` 才是唯一业务真相

---

## 2. 为什么必须这样选

`saas-starter` 不是“再做一个普通网站脚手架”，也不是某个平台的集成样例。

它的职责更重：

1. 它要成为**大型 SaaS 项目**可长期演进的骨架，而不是几个月后就要推倒重来。
2. 它要符合 Rendo 的“**面向 Agent 的服务基座**”定位，能力要能被 `OpenAPI / MCP / skills` 稳定发现和驱动。
3. 它要继续派生出 `rendo-saas-starter`，所以底座必须**可迁移、可扩展、不过早锁平台**。
4. 它要面向中国市场与多端场景，不能把“web-only”伪装成 SaaS 基座最佳实践。

所以这里的核心原则不是“哪个服务最省事”，而是：

- **默认主栈必须成熟、主流、可迁移**
- **默认主栈必须有智能时代基线，但不能一上来把平台语义绑死**
- **接口标准和业务边界必须优先于前端框架便利性**
- **多端能力必须从第一天就在架构上被承认**

---

## 3. 默认主栈的判断原则

## 3.1 选择可迁移的底座，不选择一体化平台语义作为默认真相

默认栈必须允许团队在这些场景间迁移时，不需要推翻工程骨架：

- 自托管 -> 托管云
- 单区 -> 多区
- 普通 SaaS -> AI / Agent-heavy SaaS
- 通用产品 -> `rendo-saas-starter`

这意味着 canonical base 应优先选择：

- `PostgreSQL`，而不是平台专属数据 API
- `S3-compatible storage`，而不是平台私有对象存储语义
- `OpenAPI / MCP`，而不是只服务 TS 内部调用的专有协议

## 3.2 选择强 Agent 可读的显式契约

Rendo 的差异化不在于“一个更漂亮的 SaaS starter”，而在于：

- 工程从第一天就为强 Agent 理解与驱动而设计

因此默认栈必须天然支持：

- schema-first / contract-first 的接口暴露
- 单一事实源的 auth / tenant / billing / API contract
- 清晰的 adapter / provider 边界

## 3.3 默认主栈应包含“智能时代的基础能力”，但不默认绑定某个 AI 平台

前一版文档把 `pgvector` 放到了“非默认”，这个判断不够准确。

更合理的判断是：

- canonical `saas-starter` 应默认具备**向量能力底座**
- 但不应默认绑死：
  - embedding provider
  - reranker provider
  - 完整 RAG 工作流平台

换句话说：

- **默认具备 `PostgreSQL + pgvector`**
- **不默认具备“特定 AI 平台 + 特定知识库运行时 + 特定向量管线”**

这样既符合 AI 时代 SaaS 的高概率需求，也不会把基座做成某个 AI 产品的半成品。

## 3.4 默认多端不等于默认所有端都完整实现

`saas-starter` 必须默认多端，但这里的“默认多端”应理解为：

- 第一层：默认有多端架构与标准目录
- 第二层：默认有共享 contract / auth / data access / API client
- 第三层：优先把 `web` 实现做深做稳
- 第四层：`miniapp / mobile / desktop` 作为一等预留，不再被忽略

而不是：

- 用一套 UI 代码强行覆盖所有端

---

## 4. 推荐默认架构

## 4.1 工作区与应用形态

推荐默认结构：

```txt
src/
  apps/
    web/        # Next.js App Router，主 web surface
    api/        # Hono HTTP API，唯一 canonical HTTP API
    mcp/        # MCP server，唯一 canonical Agent API
    worker/     # BullMQ worker
    miniapp/    # 一等预留 surface，推荐 Taro
    mobile/     # 一等预留 surface，推荐 React Native + Expo
    desktop/    # 一等预留 surface，后续优先 Electron 派生
  packages/
    domain/
    application/
    contracts/
    db/
    retrieval/
    auth/
    billing/
    storage/
    email/
    observability/
    config/
    ai/
    ui/
    client/
  features/
  capabilities/
  providers/
  surfaces/
```

这里要特别区分两类东西：

- `src/apps/*`
  - 第一方应用与运行面
- `src/surfaces/*`
  - 宿主挂载位，承接可装配的 surface 模板资产

这符合 Rendo 现有首日架构标准，也能避免“first-party surface”和“attachable surface asset”语义混淆。

## 4.2 只有一套业务真相，不允许双后端并行演化

这点必须写死：

- 不能把 `Next.js` 和 `Hono` 当成两套并列后端系统

正确做法是：

- `packages/domain`
  - 业务实体、规则、不变量
- `packages/application`
  - 用例、事务、权限边界、租户作用域
- `src/apps/api`
  - 只做 HTTP transport、validation、auth bridge、OpenAPI 暴露
- `src/apps/mcp`
  - 只做 MCP tool/resource 暴露
- `src/apps/web`
  - 只做 UI、BFF 级协作和少量 web-only server concerns

因此：

- 业务用例只写一份
- `api` 和 `mcp` 都复用 `packages/application`
- `web` 不拥有独立于 service API 的第二套业务逻辑

## 4.3 Next.js 在默认架构里的职责

Next.js 不是被降级，而是被放回它最擅长的位置：

- Web UI
- Dashboard / marketing / settings
- auth callback
- upload / webhook / page-action 这类 web-adjacent endpoint

官方 Next.js 文档明确支持 Route Handlers 和 App Router，这让它很适合承担 web app 内的 server-side concerns。[Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) [Next.js](https://nextjs.org/)

但 canonical service API 仍然不应直接押在 Next.js web runtime 上。

原因：

- web 路由与服务契约不是一回事
- `OpenAPI / MCP` 作为外部能力面，需要更清晰独立的边界
- 强 Agent 更容易理解独立 service API，而不是在 web app 中“猜哪里是主后端”

## 4.4 为什么 canonical HTTP API 仍然建议 Hono

这个判断不是说 Hono 比 Next.js “更像后端”，而是说：

- 它更适合作为 **Rendo 的 canonical service contract layer**

官方 Hono 文档明确强调：

- Web Standards
- multi-runtime
- 构建 Web APIs
- TypeScript 与 RPC 友好

这对 Rendo 的“面向 Agent 的服务基座”定位很重要。[Hono Docs](https://hono.dev/docs/)

所以这里的结论是：

- **有且只有一套 canonical HTTP API**
- 这套 API 默认采用 `Hono + Zod + OpenAPI`
- `Next.js Route Handlers` 不是第二套 API 真相，只是 web-side server capability

如果未来要提供更保守的 Node-only 企业变体，可以派生：

- `saas-fastify-starter`

但 canonical `saas-starter` 仍然保持当前判断。

---

## 5. 默认技术栈逐项判断

## 5.1 Node.js 24 Active LTS

Node 官方发布页明确说明，生产环境应优先使用 `Active LTS` 或 `Maintenance LTS`。截至 2026-04-07，`v24` 为 `Active LTS`，`v22` 为 `Maintenance LTS`。[Node.js Releases](https://nodejs.org/en/about/previous-releases)

因此 `saas-starter` 应直接面向：

- `Node.js 24`

这里不应被当前仓库中仍有 Node 22 的历史实现反向约束。

## 5.2 TypeScript（strict）

这点不需要争论。

对 Rendo 来说，TypeScript 的价值不只是类型安全，而是：

- 对强 Agent 更可读
- 对 schema / contract / codegen 更友好
- 对 monorepo package 边界更稳定

默认要求：

- `strict: true`
- 显式导出公共类型和 schema
- 不靠隐式 any 和动态魔法穿透边界

## 5.3 pnpm workspaces + Turborepo

这仍然是默认解。

理由：

- `pnpm` 适合大型 monorepo 的依赖管理
- `Turborepo` 适合按依赖图做缓存、并行和任务编排
- 对 `web / api / mcp / worker / miniapp / mobile / packages/*` 的多应用工作区形态非常自然

结论：

- 默认工作区：`pnpm`
- 默认任务编排：`Turborepo`

## 5.4 Next.js App Router 作为 `web` 主 surface

官方 Next.js 文档当前对新项目的主路线非常明确：

- `App Router` 是推荐路线
- `Route Handlers` 是 web 应用内处理 API 端点的标准方式之一

因此 `src/apps/web` 默认使用：

- `Next.js App Router`

但它的职责是：

- web surface
- dashboard
- account / settings / marketing
- 少量 web-adjacent server endpoints

而不是接管整个系统的 canonical service API。

## 5.5 Tailwind CSS v4 + shadcn/ui

这仍然是默认 UI 组合。

理由：

- `Tailwind CSS v4` 已是当前主流路线
- `shadcn/ui` 不是黑盒 UI 库，而是开源、可组合、可改造的代码资产
- 对强 Agent 修改界面、沉淀 design token 更友好

默认要求：

- `packages/ui` 沉淀 Rendo 的 design tokens 和通用组件
- 不使用重黑盒 UI 套件做主基座

## 5.6 Hono + Zod + OpenAPI 3.1 作为唯一 canonical HTTP API

这次需要把结论说得更精确：

- 不是“Next.js 一套 API + Hono 一套 API”
- 而是“**Hono 是唯一 canonical HTTP API**”

选择 `Hono + Zod + OpenAPI 3.1` 的原因：

1. Hono 官方明确支持多运行时和构建 Web API。[Hono Docs](https://hono.dev/docs/)
2. OpenAPI 是机器和人都能稳定理解服务能力的标准描述面。[OpenAPI Specification](https://spec.openapis.org/oas/)
3. 这与 Rendo 的 Agent-oriented service 定位天然一致。

默认要求：

- `src/apps/api` 输出唯一 canonical HTTP API
- `interfaces/openapi/` 存放生成后的 OpenAPI 3.1 描述
- `packages/contracts` 存放 schema 与 DTO
- `web` 侧需要复用时，走同一套 contract / client，而不是复制路由逻辑

## 5.7 MCP TypeScript SDK 作为唯一 canonical Agent API

MCP 是 Rendo 的一等能力面，不应只是文档占位。

默认要求：

- `src/apps/mcp` 是 MCP server
- 与 `src/apps/api` 一样都复用 `packages/application`
- `interfaces/mcp/` 存放 MCP 可读描述与相关产物

这样：

- HTTP API 与 MCP 不会各写一套业务规则
- Agent 可直接消费独立的 service surface

参考：

- [MCP Introduction](https://modelcontextprotocol.io/introduction)
- [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/)

## 5.8 Better Auth 作为默认认证与多租户基线

这仍然是默认解，而且要继续强化。

官方 Better Auth 文档已经能支撑几个关键点：

- Hono 集成
- organization / team
- OpenAPI 插件

这意味着它不是单纯“登录库”，而是适合作为 SaaS 基座的身份与租户入口。

默认启用策略建议：

- `email + password`
- organization / workspace
- session management
- role / permission

延后启用但预留：

- SSO / enterprise login
- API key
- 更细粒度的 agent auth

参考：

- [Better Auth Hono Integration](https://www.better-auth.com/docs/integrations/hono)
- [Better Auth Organization Plugin](https://better-auth.com/docs/plugins/organization)
- [Better Auth OpenAPI Plugin](https://www.better-auth.com/docs/plugins/open-api)

## 5.9 PostgreSQL + pgvector + Drizzle ORM + drizzle-kit + pg

这里需要修正前一版结论。

canonical `saas-starter` 的数据库基线应是：

- `PostgreSQL`
- `pgvector`
- `Drizzle ORM`
- `drizzle-kit`
- `pg`

原因：

1. Postgres 仍然是 SaaS 主数据库默认解。
2. `pgvector` 官方 README 明确支持：
   - exact / approximate nearest neighbor
   - cosine / inner product / L2 / L1 等距离
   - ACID、PITR、JOIN 等 Postgres 原生能力协同
3. 对 Rendo 这类 Agent-oriented service 基座来说，向量检索不是边角能力，而是高概率能力。

这意味着：

- 默认应把 `pgvector` 作为智能基线纳入底座
- 但默认只纳入“向量能力底座”，不默认纳入完整 RAG 平台

默认应交付：

- `CREATE EXTENSION vector`
- 最小 vector table / column 示例
- vector repository / search service 示例
- 对应 migration
- 对应 contract

但默认不应交付：

- 强绑定某个 embedding provider
- 强绑定某个 reranker
- 完整知识库 ingestion pipeline

参考：

- [pgvector](https://github.com/pgvector/pgvector)
- [Supabase pgvector Docs](https://supabase.com/docs/guides/database/extensions/pgvector)
- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)

## 5.10 多租户策略：应用层强约束 + Postgres 能力预留

`saas-starter` 必须默认是组织 / 工作区 SaaS，而不是单用户网站骨架。

默认策略：

- Better Auth `organization` 做身份与租户入口
- 关键业务表显式带 `organization_id` / `workspace_id`
- 应用服务层强制租户作用域
- Postgres `RLS` 作为可增强能力预留，不作为唯一真相

这样做的原因是：

- SaaS 的租户边界必须被工程显式表达
- 但 canonical base 不应一上来把所有数据访问都完全压进 RLS

结论：

- 应用层租户边界是主线
- `RLS` 是增强项

## 5.11 Redis-compatible + BullMQ 作为默认缓存 / 队列基线

这条保持不变。

默认基线应是：

- `Redis-compatible`
- `BullMQ`

原因：

- 足以覆盖大多数 SaaS 的默认异步需求
- 队列能力是 day-one 基础设施
- 但 workflow 平台不是 day-one 必选项

因此：

- `BullMQ` 是默认基线
- `Trigger.dev` 是推荐扩展能力，不是默认必选项

参考：

- [BullMQ Docs](https://docs.bullmq.io/)
- [Trigger.dev Docs](https://trigger.dev/docs)

## 5.12 Stripe Billing 作为默认订阅与计费

这条保持不变。

原因：

- SaaS 计费不是可选项
- Stripe Billing 覆盖 seat-based、usage-based、trial、proration 等主流订阅场景

默认要求：

- `packages/billing` 作为唯一支付接入层
- domain 层只感知 plan / entitlement / subscription 状态
- 不让 Stripe SDK 渗透到整个业务层

参考：

- [Stripe Billing Subscriptions](https://docs.stripe.com/billing/subscriptions/creating)
- [Stripe Subscription Features](https://docs.stripe.com/billing/subscriptions/features)

## 5.13 Resend + React Email 作为默认邮件栈

保持不变。

原因：

- 模板代码可版本化
- TypeScript / React 生态自然
- 对强 Agent 可读性好

参考：

- [Resend API Introduction](https://www.resend.com/docs/api-reference/introduction)
- [React Email Introduction](https://react.email/docs/introduction)

## 5.14 S3-compatible storage 作为默认对象存储策略

保持不变。

默认策略：

- 本地：`MinIO`
- 云上：`S3 / R2 / 兼容实现`

原因：

- 文件、导出、附件、媒体资源是 SaaS 通用能力
- S3 语义已经是事实标准
- 这样既方便本地交付，也不锁死平台

## 5.15 OpenTelemetry + 结构化日志

保持不变，但强调边界：

- `OpenTelemetry` 负责 traces / metrics / propagation
- 结构化 JSON 日志仍由成熟 logger 负责

不要把 canonical base 写成“所有日志完全押在 OTel JS logs 上”，那样没必要冒险。

参考：

- [OpenTelemetry Docs](https://opentelemetry.io/docs/)
- [OpenTelemetry JavaScript](https://opentelemetry.io/docs/languages/js/)

## 5.16 Vitest + Playwright

保持不变。

默认测试分层：

- `Vitest`
  - unit / integration / contract
- `Playwright`
  - browser e2e / smoke

默认应覆盖：

- auth
- tenant boundary
- billing
- queue
- API contracts
- MCP smoke

参考：

- [Vitest Guide](https://vitest.dev/guide/)
- [Playwright Introduction](https://playwright.dev/docs/intro)

## 5.17 默认多端路线：Taro + React Native/Expo + Electron 预留

前一版只强调 `web-first`，这不够。

更合理的结论是：

- `saas-starter` 是 **multi-surface-by-default**
- `web` 是当前优先完整实现的 surface
- `miniapp / mobile / desktop` 必须从 day one 作为一等预留存在

推荐路线：

### `miniapp`

- 推荐：`Taro (React)`

原因：

- 对国内小程序生态适配更强
- 与 React 心智更接近
- 更适合作为 canonical miniapp 预留路线

参考：

- [Taro Docs](https://docs.taro.zone/en/docs/guide/)

### `mobile`

- 推荐：`React Native + Expo`

原因：

- React Native 官方主页明确建议新 app 使用 framework，例如 Expo
- Expo 在构建、提交和 OTA 方面提供成熟团队化工作流

参考：

- [React Native Home](https://reactnative.dev/Home)
- [React Native Introduction](https://reactnative.dev/docs/getting-started)
- [Expo EAS Introduction](https://docs.expo.dev/tutorial/eas/introduction/)

### `desktop`

- 默认保留位
- 后续优先 `Electron` 派生

原因：

- Electron 仍然是跨平台桌面应用的主流 JavaScript 路线之一
- 但 canonical `saas-starter` 当前不应强行把桌面完整实现塞进 day-one 默认产物

参考：

- [Electron](https://www.electronjs.org/)
- [Electron First App](https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app)

---

## 6. Supabase 应该如何放置

## 6.1 Supabase 不是坏选择，但不该是 canonical 默认整包基座

这点依然成立。

Supabase 官方特性页本身就说明它是一整套平台：

- Postgres
- Auth
- Storage
- Realtime
- Vector
- Edge Functions
- 平台工具链

这恰恰是它不适合作为 canonical `saas-starter` 默认值的原因。

因为 canonical base 的任务不是：

- 帮团队尽快进入某个平台心智

而是：

- 提供一个**长期可迁移、可派生、可扩展**的 SaaS 工程骨架

## 6.2 Supabase 的正确位置

我的建议仍然是：

- `Supabase` 应作为 **官方变体或官方 provider/capability**

也就是：

- `application/saas-starter`
  - canonical base
- `application/saas-supabase-starter`
  - 官方 Supabase 变体

这样：

- 不牺牲 canonical base 的长期稳定性
- 也不放弃 Supabase 的高效率

## 6.3 即使支持 Supabase，也不能让它污染核心业务层

未来即使做 Supabase 变体，也应遵守：

1. `domain / application` 不直接依赖 `supabase-js`
2. Supabase 接入只出现在 `providers / capabilities / adapters`
3. `OpenAPI / MCP / skills` 仍由 Rendo 标准接口面统一暴露
4. 不把 Supabase auto-generated API 当成主业务 API 真相

---

## 7. 哪些技术不应作为默认值

以下不是说“不好”，而是“不该成为 canonical `saas-starter` 的默认值”。

### 7.1 Supabase 整平台

原因：

- 平台语义太重
- 会把 auth / storage / realtime / vector / local stack 心智一起绑定进来

### 7.2 Trigger.dev 作为默认必选后台任务运行时

原因：

- 它更像高层 workflow runtime
- 对 canonical base 来说过早

### 7.3 `Next.js-only backend`

原因：

- 会把 web surface 与 canonical service contract 混在一起
- 不利于 `OpenAPI / MCP` 作为一等能力面
- 不利于强 Agent 第一时间识别主服务边界

### 7.4 `tRPC-only` 作为默认外部接口面

原因：

- 适合 TS 内部开发体验
- 不适合作为面向跨语言系统和 Agent 的默认对外契约

### 7.5 默认完整 RAG 平台

原因：

- `pgvector` 默认进入底座是合理的
- 但完整 knowledge ingestion / rerank / eval / orchestration 平台不是 day-one 必选

---

## 8. `saas-starter` Day One 必须交付什么

`saas-starter` 第一版不是只装好依赖就算完成。

它至少必须交付：

- `src/apps/web`
- `src/apps/api`
- `src/apps/mcp`
- `src/apps/worker`
- `src/apps/miniapp`
- `src/apps/mobile`
- `src/apps/desktop`
- `src/packages/domain`
- `src/packages/application`
- `src/packages/contracts`
- `src/packages/db`
- `src/packages/retrieval`
- `src/packages/auth`
- `src/packages/billing`
- `src/packages/storage`
- `src/packages/email`
- `src/packages/observability`
- `interfaces/openapi`
- `interfaces/mcp`
- `interfaces/skills`
- `ops/docker`
- `tests/unit`
- `tests/contracts`
- `tests/integration`
- `tests/smoke`

此外必须开箱即用提供：

- Postgres + `pgvector`
- Redis-compatible
- MinIO
- migration / seed / health scripts
- `.env.example`
- OpenAPI 生成
- MCP server 最小样例
- 最小向量检索样例
- tenant / auth / subscription / queue / email / storage 的最小贯通样例
- `miniapp / mobile / desktop` 的占位 README、contract client 和接线预留

---

## 9. `saas-starter` 与 `rendo-saas-starter` 的关系

这两者必须严格区分：

### `application/saas-starter`

- 面向通用 SaaS 项目
- 默认智能基线存在，但不带 Rendo runtime 平台依赖
- 是稳定、可迁移、可派生的 canonical SaaS 基座

### `rendo-saas-starter`

- 在 `saas-starter` 上继续派生
- 再加入 Rendo runtime / registry / publish / platform 能力
- 可以更重，但不能反向污染 `saas-starter` 的普适性

所以正确顺序是：

1. 先把 `saas-starter` 做成真正通用的高质量 SaaS 基座
2. 再在其上派生 `rendo-saas-starter`

而不是反过来让 canonical base 先背上平台实现负担。

---

## 10. 最终推荐

最终结论可以收敛成一句话：

> `application/saas-starter` 应采用 **Node 24 + TypeScript + pnpm/Turborepo + Next.js App Router(只负责 web) + Hono/Zod/OpenAPI(唯一 canonical HTTP API) + MCP SDK(唯一 canonical Agent API) + Better Auth + PostgreSQL/pgvector/Drizzle + Redis-compatible/BullMQ + Stripe + Resend/React Email + S3-compatible storage + OpenTelemetry + Vitest/Playwright + Docker Compose** 的 **Postgres-first、smart-by-default、interface-first、multi-surface-by-default、vendor-moderate** 主栈。

这是当前最符合以下目标的默认解：

- 成熟
- 主流
- 能支撑大型项目
- 对强 Agent 友好
- 默认具备智能时代基线
- 默认承认多端场景
- 能继续派生出 `rendo-saas-starter`
- 不把基座提前锁死在 Supabase 这类整包平台语义中

---

## 11. 参考依据

- [Node.js Releases](https://nodejs.org/en/about/previous-releases)
- [Next.js](https://nextjs.org/)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Hono Docs](https://hono.dev/docs/)
- [MCP Introduction](https://modelcontextprotocol.io/introduction)
- [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/)
- [OpenAPI Specification](https://spec.openapis.org/oas/)
- [Better Auth Hono Integration](https://www.better-auth.com/docs/integrations/hono)
- [Better Auth Organization Plugin](https://better-auth.com/docs/plugins/organization)
- [Better Auth OpenAPI Plugin](https://better-auth.com/docs/plugins/open-api)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector](https://github.com/pgvector/pgvector)
- [Supabase pgvector Docs](https://supabase.com/docs/guides/database/extensions/pgvector)
- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [BullMQ Docs](https://docs.bullmq.io/)
- [Trigger.dev Docs](https://trigger.dev/docs)
- [Stripe Billing Subscriptions](https://docs.stripe.com/billing/subscriptions/creating)
- [Stripe Subscription Features](https://docs.stripe.com/billing/subscriptions/features)
- [Resend API Introduction](https://www.resend.com/docs/api-reference/introduction)
- [React Email Introduction](https://react.email/docs/introduction)
- [OpenTelemetry Docs](https://opentelemetry.io/docs/)
- [OpenTelemetry JavaScript](https://opentelemetry.io/docs/languages/js/)
- [Vitest Guide](https://vitest.dev/guide/)
- [Playwright Introduction](https://playwright.dev/docs/intro)
- [Taro Docs](https://docs.taro.zone/en/docs/guide/)
- [React Native Home](https://reactnative.dev/Home)
- [React Native Introduction](https://reactnative.dev/docs/getting-started)
- [Expo EAS Introduction](https://docs.expo.dev/tutorial/eas/introduction/)
- [Electron](https://www.electronjs.org/)
- [Electron First App](https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app)
- [Supabase Features](https://supabase.com/docs/guides/getting-started/features)

其中以下判断属于本文的工程结论，而不是官方原文直接结论：

- `pgvector` 应进入 canonical `saas-starter` 的默认智能基线
- `Next.js` 不应独占 canonical service API；`Hono` 应作为唯一 canonical HTTP API
- `saas-starter` 必须默认多端预留，不能继续按 web-only 心智设计
- `Supabase` 更适合作为官方变体，而不是 canonical base 默认值

