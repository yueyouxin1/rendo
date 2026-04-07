# `application/saas-starter` 总目标与边界 TODO

## 目标

把 `application/saas-starter` 定义并落实为：

- Rendo 当前阶段最重要的产品级 SaaS 基座
- 未来大量用户项目的高质量起点工程
- 后续 `rendo-saas-starter` 的稳定上游

## 本轮明确包含

- [ ] 冻结 `application/saas-starter` 的默认技术栈与目录形态
- [ ] 明确 `web / api / mcp / worker / miniapp / mobile / desktop` 的默认职责
- [ ] 交付专业的产品门面和完整管理端
- [ ] 交付最小但真实可用的商业化能力
- [ ] 交付最小但真实可用的智能能力底座
- [ ] 交付 docker 开箱即用本地环境
- [ ] 交付测试、文档和验收脚本

## 本轮明确不包含

- [x] `rendo-saas-starter`
- [x] Rendo runtime / registry 平台实现
- [x] 远程 publish / 平台后台 / 控制台
- [x] Rendo 自身狗粮业务逻辑
- [x] 将 canonical SaaS 基座绑定为某个单一云平台产品

## 动手前强制前置条件

- [ ] 阅读 `vercel:nextjs` skill
- [ ] 阅读 `vercel:shadcn` skill
- [ ] 阅读 `vercel:turborepo` skill
- [ ] 若涉及 UI 风格与字体系统，阅读 `vercel:geist` skill
- [ ] 若涉及观测体系，阅读 `vercel:observability` skill
- [ ] 在实施文档或提交说明中记录“从这些 skills 采纳了哪些具体判断”

## 完成标准

- [ ] `application/saas-starter` 的目标、边界、优先级和排除项都已文档化，无歧义
- [ ] 本轮任务不再混入任何 `rendo-saas-starter` 或 runtime 平台工作

