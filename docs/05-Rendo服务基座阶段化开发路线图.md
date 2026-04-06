# Rendo 服务基座阶段化开发路线图

## 总原则

阶段顺序必须服务于：

- `core -> base -> derived`

这条主干。

新的产品定位已经升级为“面向智能体的服务基座平台”，但当前仓库的交付节奏仍然必须先证明模板控制面，而不是提前跳去做完整平台。

## Phase 0：服务基座契约定型

目标：

- 明确模板清单规范
- 明确项目清单规范
- 明确 CLI 协议
- 明确模板分层与模板类型
- 明确 authoring 源与正式模板产物层的边界
- 明确服务基座的 Agent 可调用基线入口
- 冻结首日架构与目录标准

交付：

- `template-manifest`
- `project-manifest`
- `template-profile`
- `templates registry`
- `AGENTS.md / CLAUDE.md / .agents / interfaces / src / install / tests / ops` 的最小约定
- `standalone-runnable / host-attached` 的运行等级约定
- `docs/29-Rendo服务基座首日架构与目录标准.md`

## Phase 1：Core 模板层落地

目标：

- 为每个一等模板类型提供一个最小、稳定、agent 友好的 `core` 模板
- 把服务基座所需的最小控制面先做成统一模板骨架

交付：

- `starter-core-template`
- `feature-core-template`
- `capability-core-template`
- `provider-core-template`
- `surface-core-template`

## Phase 2：CLI 落地

目标：

- 让 CLI 成为服务基座模板层级的统一入口
- 先跑通基于正式模板产物层的本地与远程消费
- 再考虑自包含发行形态

交付：

- `rendo init <kind>`
- `rendo create`
- `rendo search`
- `rendo inspect`
- `rendo add / pull / upgrade / doctor`
- local provider 与 remote provider 的一致用户语义

## Phase 3：Base 模板层落地

目标：

- 从每个 `core` 模板派生出一个官方 `base` 模板
- 让 starter base 成为第一个标准服务基座根模板

交付：

- `application-base-starter`
- `dashboard-feature-base-template`
- `storage-capability-base-template`
- `llm-provider-base-template`
- `admin-surface-base-template`

## Phase 4：模板资产生命周期最小闭环

目标：

- 验证 capability / provider / surface template 的 manifest、install、add、pull、upgrade 语义
- 证明“可装配服务单元”能在 starter 服务基座里稳定工作

交付：

- template asset 最小 install plan 机制
- 至少 1 个可被搜索、检查、安装、拉取的官方非 starter base 模板闭环样板

## Phase 5：服务基座验证与接口自动化

之后再进入：

- `rendo validate` 一类的本地验证能力
- Agent 可调用性基线检查
- `interfaces/openapi` / `interfaces/mcp` / `interfaces/skills` 导出辅助
- 更强的升级和诊断闭环

## Phase 6 以后

更后续再考虑：

- 更多 derived 模板
- 持久化远程 registry 与发布后端
- 自包含 CLI 分发
- 预览驱动的探索式产品面
- 服务基座市场
- 企业资产治理
