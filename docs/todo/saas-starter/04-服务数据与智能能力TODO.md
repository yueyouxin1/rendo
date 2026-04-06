# 服务数据与智能能力 TODO

## 目标

交付一套默认具备智能时代基线的 SaaS 服务层。

## 服务层

- [ ] 交付 `src/apps/api`，并确保它是唯一 canonical HTTP API
- [ ] 交付 `src/apps/mcp`，并确保它是唯一 canonical Agent API
- [ ] 交付 `src/apps/worker`
- [ ] 交付 `packages/domain / application / contracts`
- [ ] 交付 `interfaces/openapi / interfaces/mcp / interfaces/skills`

## 数据层

- [ ] 默认使用 `PostgreSQL + pgvector`
- [ ] 交付 Drizzle schema、migration、seed
- [ ] 交付多租户数据模型
- [ ] 交付 billing / usage / audit / project / config 基础表
- [ ] 交付最小向量检索示例表与查询服务

## 智能能力基线

- [ ] 默认具备 embeddings / retrieval 预留层
- [ ] 默认具备 MCP tool / resource 示例
- [ ] 默认具备 OpenAPI 与 MCP 共用的 contract / schema
- [ ] 默认具备 AI 相关错误反馈、配额与配置入口预留

## 平台接入边界

- [ ] 不把 Supabase 整平台作为默认基座
- [ ] 若后续支持 Supabase，只能作为官方变体或 provider/capability
- [ ] 不把完整 RAG 平台、工作流平台作为 day-one 必选

## 完成标准

- [ ] SaaS 基座默认具备智能能力底座，而不是普通网站模板
- [ ] 业务、HTTP API、MCP API 和 worker 的边界清晰

