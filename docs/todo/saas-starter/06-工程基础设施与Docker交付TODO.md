# 工程基础设施与 Docker 交付 TODO

## 目标

让 `application/saas-starter` 在工程层面达到“可作为高质量起点工程直接使用”的标准。

## Monorepo 与任务系统

- [ ] 落地 `pnpm workspaces`
- [ ] 落地 `Turborepo`
- [ ] 建立 `dev / build / test / lint / typecheck / db / docker` 任务体系
- [ ] 明确缓存、并行、依赖图和 affected 流程

## 本地基础设施

- [ ] docker compose 一键拉起 web、api、mcp、worker、postgres、redis-compatible、minio
- [ ] 本地默认支持 `PostgreSQL + pgvector`
- [ ] 本地默认支持 migration / seed / health check
- [ ] `.env.example` 与本地开发环境说明完整

## 质量与可维护性

- [ ] lint / format / typecheck / test / build 命令完整
- [ ] 默认日志、错误、配置校验和失败提示完整
- [ ] 关键服务启动失败时有清晰错误输出
- [ ] 文档写清楚如何本地启动、调试、重建和排障

## Docker 交付标准

- [ ] `docker compose up` 即可进入最小可用环境
- [ ] 不要求手工拼装服务才能跑起来
- [ ] 所有关键服务均有健康检查或等价可验证入口
- [ ] docker 失败时有清晰排障路径

## 完成标准

- [ ] `docker compose up` 是真正的开箱即用，而不是“理论可用”
- [ ] 一个新开发者或强 Agent 可以在本地快速跑通模板

