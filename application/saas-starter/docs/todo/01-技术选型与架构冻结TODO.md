# 技术选型与架构冻结 TODO

## 目标

把 `application/saas-starter` 的 canonical 技术栈与架构语义冻结成可执行标准。

## 技术栈冻结

- [ ] 冻结 `Node.js 24 + TypeScript + pnpm workspaces + Turborepo`
- [ ] 冻结 `Next.js App Router` 作为 `web` surface
- [ ] 冻结 `Tailwind CSS v4 + shadcn/ui + Geist Sans/Mono`
- [ ] 冻结 `next-intl`，默认 `zh-CN`，第一 fallback `en`
- [ ] 冻结 `next-themes` 作为主题切换基线
- [ ] 冻结 `motion/react` 作为默认动效基线
- [ ] 冻结 `Hono + Zod + OpenAPI 3.1` 作为唯一 canonical HTTP API
- [ ] 冻结 `MCP TypeScript SDK` 作为唯一 canonical Agent API
- [ ] 冻结 `Better Auth` 作为认证与多租户基线
- [ ] 冻结 `PostgreSQL + pgvector + Drizzle + drizzle-kit + pg`
- [ ] 冻结 `Redis-compatible + BullMQ` 作为缓存 / 队列基线
- [ ] 冻结 `Stripe Billing + Resend + React Email + S3-compatible storage`
- [ ] 冻结 `OpenTelemetry + 结构化 JSON 日志`
- [ ] 冻结 `Vitest + Playwright`

## 架构边界冻结

- [ ] 明确 `Next.js` 只负责 `web` surface 与 web-adjacent server concerns
- [ ] 明确 `Hono` 是唯一 canonical HTTP API，不允许出现两套并列后端真相
- [ ] 明确 `MCP` 是唯一 canonical Agent API
- [ ] 明确 `domain / application` 是唯一业务真相
- [ ] 明确 `src/apps/*` 是 first-party 应用运行面
- [ ] 明确 `src/surfaces/*` 是可装配 surface 挂载位
- [ ] 明确 `miniapp / mobile / desktop` 是 day-one 一等预留 surface
- [ ] 明确 i18n、theme、motion 不是后补 UI 细节，而是 day-one contract

## 产物要求

- [ ] 更新相关架构文档与 source-of-truth
- [ ] 生成 `saas-starter` 的正式 authoring profile / 目录骨架设计说明
- [ ] 确保后续代码落地不需要再争论“是不是 web-only SaaS”
- [ ] 确保后续代码落地不需要再争论“i18n / theme / motion 要不要后补”

## 完成标准

- [ ] 技术选型已冻结，不再在实现阶段反复摇摆
- [ ] 强 Agent 只看文档就能明确服务边界、业务真相和多端策略
