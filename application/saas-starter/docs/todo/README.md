# `application/saas-starter` TODO 主线

## 目标

这条主线只服务一个目标：

- **把当前独立工作区 `application/saas-starter` 做成最专业、最可复用的 SaaS 基座模板**

## 本轮强制规则

- [x] 本轮只聚焦 `application/saas-starter`
- [x] 不把 runtime / registry / 平台化事项混入当前工作区
- [x] Codex 在动手前必须阅读与目标直接相关的前端与工程技能
- [x] 至少阅读：`frontend-design`、`frontend-skill`、`web-design-guidelines`
- [x] 至少阅读：`nextjs`、`shadcn`、`turborepo`
- [x] 如涉及视觉系统、产品化体验和可观测性，应继续阅读：`geist`、`observability`
- [x] 默认 UI 门面必须以 Vercel 官网风格为直接参考
- [x] 默认 UI 采用 `shadcn` 浅色主题，并支持多色彩主题切换
- [x] 默认从 day one 支持 i18n，`zh-CN` 为默认 locale，`en` 为第一 fallback
- [x] 默认从 day one 引入 Motion 策略，并要求尊重 `prefers-reduced-motion`
- [x] 管理端必须存在且完整可用
- [x] docker 开箱即用是硬性交付标准
- [x] 完成后必须回勾本目录中的 TODO 项

## 阅读顺序

1. [00-Application-SaaS-Starter总目标与边界TODO.md](/D:/code/rendo/application/saas-starter/docs/todo/00-Application-SaaS-Starter%E6%80%BB%E7%9B%AE%E6%A0%87%E4%B8%8E%E8%BE%B9%E7%95%8CTODO.md)
2. [01-技术选型与架构冻结TODO.md](/D:/code/rendo/application/saas-starter/docs/todo/01-%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B%E4%B8%8E%E6%9E%B6%E6%9E%84%E5%86%BB%E7%BB%93TODO.md)
3. [02-产品门面与商业化体验TODO.md](/D:/code/rendo/application/saas-starter/docs/todo/02-%E4%BA%A7%E5%93%81%E9%97%A8%E9%9D%A2%E4%B8%8E%E5%95%86%E4%B8%9A%E5%8C%96%E4%BD%93%E9%AA%8CTODO.md)
4. [03-管理端与控制面TODO.md](/D:/code/rendo/application/saas-starter/docs/todo/03-%E7%AE%A1%E7%90%86%E7%AB%AF%E4%B8%8E%E6%8E%A7%E5%88%B6%E9%9D%A2TODO.md)
5. [04-服务数据与智能能力TODO.md](/D:/code/rendo/application/saas-starter/docs/todo/04-%E6%9C%8D%E5%8A%A1%E6%95%B0%E6%8D%AE%E4%B8%8E%E6%99%BA%E8%83%BD%E8%83%BD%E5%8A%9BTODO.md)
6. [05-多端预留与客户端策略TODO.md](/D:/code/rendo/application/saas-starter/docs/todo/05-%E5%A4%9A%E7%AB%AF%E9%A2%84%E7%95%99%E4%B8%8E%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%AD%96%E7%95%A5TODO.md)
7. [06-工程基础设施与Docker交付TODO.md](/D:/code/rendo/application/saas-starter/docs/todo/06-%E5%B7%A5%E7%A8%8B%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD%E4%B8%8EDocker%E4%BA%A4%E4%BB%98TODO.md)
8. [07-测试验收与勾选标准TODO.md](/D:/code/rendo/application/saas-starter/docs/todo/07-%E6%B5%8B%E8%AF%95%E9%AA%8C%E6%94%B6%E4%B8%8E%E5%8B%BE%E9%80%89%E6%A0%87%E5%87%86TODO.md)
9. [../SaaS基座最佳实践技术栈选型.md](/D:/code/rendo/application/saas-starter/docs/SaaS%E5%9F%BA%E5%BA%A7%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E6%8A%80%E6%9C%AF%E6%A0%88%E9%80%89%E5%9E%8B.md)
10. [../SaaS前端与产品体验标准.md](/D:/code/rendo/application/saas-starter/docs/SaaS%E5%89%8D%E7%AB%AF%E4%B8%8E%E4%BA%A7%E5%93%81%E4%BD%93%E9%AA%8C%E6%A0%87%E5%87%86.md)

## 成功定义

只有以下条件同时满足，才算 `application/saas-starter` 当前阶段交付成功：

1. `todo` 清单已完成并回勾。
2. `docker compose up` 后可直接启动最小可用产品门面、服务 API、MCP、worker 和基础依赖。
3. 默认门面具备专业整洁的云服务商 SaaS 质感，不是 demo 页。
4. 管理端完整可用，不是静态占位。
5. 关键商业化能力存在且在未配置时优雅报错，而不是静默失败。
6. 默认 i18n、theme、motion 已从 day one 冻结到位。
7. 多端架构已预留到位，后续扩展不需要推翻基座。
