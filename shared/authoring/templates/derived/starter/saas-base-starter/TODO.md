# TODO

## P0 目标

做出第一个高质量 Rendo vertical starter，使其成为：

- 默认最佳实践模板
- 强 Agent 的开发起点
- 后续模板体系的参考标准

## P0 必做项

1. 确定 starter 的目标业务场景
2. 确定默认技术栈
3. 确定目录结构和模块分层
4. 确定默认运行环境（Docker / compose / devcontainer）
5. 搭好认证、权限、支付、数据库、知识库、Agent、Workflow 的默认骨架
6. 提供轻量管理后台
7. 提供模板元数据与 Agent 指令文件
8. 提供初始化命令入口
9. 跑通本地启动与基本功能验收

## P1 拆解

### 1. 基础工程

- [ ] 将 Vercel 官方 `AI Chatbot` 模板设为 starter 基底
- [ ] 识别原模板中可直接保留的模块
- [ ] 识别原模板中必须替换或扩展的模块
- [ ] 初始化 monorepo / app 结构
- [ ] 接入 Next.js App Router + TypeScript
- [ ] 接入 Tailwind v4 + shadcn/ui
- [ ] 接入 Docker Compose
- [ ] 准备 `.env.example`

### 2. 数据与认证

- [ ] 接入 PostgreSQL
- [ ] 接入 Prisma ORM
- [ ] 写基础 schema / migrations / seed
- [ ] 接入 Better Auth
- [ ] 做基础 RBAC

### 3. 商业化

- [ ] 接入 Stripe Billing 骨架
- [ ] 做 entitlements / plan 占位
- [ ] 做 Billing 设置页或占位页

### 4. 知识库

- [ ] 默认采用 PostgreSQL + pgvector
- [ ] 做文档上传与条目管理基础能力
- [ ] 做检索测试页

### 5. Agent / Workflow

- [ ] 接入 Vercel AI SDK
- [ ] 提供一个默认交互式 Agent
- [ ] 接入 Trigger.dev
- [ ] 提供一个基础 workflow / background job 示例

### 6. 管理后台

- [ ] 用户 / 组织页
- [ ] 权限基础页
- [ ] 知识库管理页
- [ ] 集成状态页
- [ ] Agent / Workflow 运行查看页（最小版）

### 7. Agent 友好交付

- [ ] `AGENTS.md`
- [ ] `CLAUDE.md`
- [ ] `.github/copilot-instructions.md`
- [ ] `rendo.template.json`
- [ ] 扩展点与二次开发说明

### 8. 初始化与交付

- [ ] 设计 `rendo create`
- [ ] 兼容 `npm/pnpm/yarn/bun create`
- [ ] 支持非交互参数初始化
- [ ] 文档写清启动和开发方式

## 非目标

- [ ] 不做模板市场
- [ ] 不做完整产品面
- [ ] 不做通用 Agent runtime
- [ ] 不做通用 Workflow engine
- [ ] 不做 DSL runtime
