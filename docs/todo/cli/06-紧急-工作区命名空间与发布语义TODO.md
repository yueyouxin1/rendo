# 紧急 - 工作区命名空间与发布语义 TODO

## 背景

当前 Rendo 在以下几个点上仍有高优先级模糊地带：

- 本地工作区与正式模板产物语义混淆
- `core / base / derived` 角色与本地来源状态混淆
- `rendo init` / `rendo create` 之后的工作区是否可发布没有冻结清楚
- `rendo.template.json` / `rendo.project.json` 暴露在仓库根目录，不利于 CLI 接管和用户忽略
- `core` / `base` 的价值表述不够清晰，容易被误解为“空模板”与“轻壳”

这组问题不先解决，后续 `application/saas-starter`、社区发布和 Agent 二次开发都会持续返工。

当前已确认：

- `.rendo/` 现在只出现在 `rendo init / create / pull` 生成的本地工作区中
- `shared/templates/**` 里的正式模板产物仍保留根级 `rendo.template.json / rendo.project.json` 作为 formal artifact 打包语义
- 因此任何关于 `.rendo/` 的已完成项，若未特别说明，都是在说“本地工作区”，不是在说 `shared/templates/**` 目录本身

## 第一顺位

- [x] 冻结 `.rendo/` 作为本地 Rendo 可识别工作区命名空间
- [x] 冻结 `.rendo/rendo.project.json` 与 `.rendo/rendo.template.json` 的职责边界
- [x] 冻结 `rendo init <kind>` 与 `rendo create <starter>` 都创建 Rendo 可识别工作区，而不是“快照拷贝”
- [x] 冻结本地工作区来源 `origin` 与发布角色 `templateRole` 的分离语义
- [x] 冻结社区发布时“非官方工作区统一自动归一化为 `derived`”的规则
- [x] 冻结删除 `.rendo/` 即从 Rendo 工作区退化为普通项目的语义

## 第二顺位

- [x] 明确 CLI 如何生成唯一 workspace id、默认项目名与冲突处理
- [x] 明确 `inspect / doctor / bundle / publish` 如何读取 `.rendo/` 元数据
- [x] 明确旧的根级 `rendo.template.json / rendo.project.json` 迁移到 `.rendo/` 的兼容策略
- [x] 明确 runtime-pre snapshot 与后续 publish 如何保留 origin lineage
- [x] 明确 `init / create / pull` 生成的本地工作区应立即投影为 `derived`

## `core / base / derived` 价值重定义

- [x] 重写 `core` 的价值说明，明确其核心价值是冻结 Rendo 工程语言规范，而不是“空项目”
- [x] 重写 `base` 的价值说明，明确其核心价值是官方参考实现，而不是“轻壳”
- [x] 重写 `derived` 的价值说明，明确其核心价值是具体产品 / 场景 / 社区模板发布层

## Agent 与规范继承

- [x] 以 `.rendo/` 语义为前提，重写 core 级 `AGENTS.md`
- [x] 重写 core 级 `.agents/` 结构，使其成为脱离 Rendo 仓库后仍可继承的工程语言载体
- [x] 规划 `.agents/skills/` 的官方最小集合，用于承载 TDD、目录边界、接口暴露、错误处理、文档回勾等可执行规范
- [x] 将 `.agents/skills` 落为可被 Agent 工具检索的 `SKILL.md` + frontmatter 结构，并废弃 `capabilities.yaml`

## 成功标准

- [x] 用户或 Agent 不需要再手工理解“我现在到底是不是 core/base/derived”
- [x] 只要 `.rendo/` 仍然合法，工作区就始终是 Rendo 可识别工作区
- [x] 发布时的最终角色归一化由 Rendo 自动处理，而不是要求用户手工切换
- [x] `core / base / derived` 的价值与边界已经在 source-of-truth 文档中清晰、无歧义、无冗余地写明
