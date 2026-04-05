# Rendo 阶段化开发路线图

## 总原则

阶段顺序必须服务 `core -> base -> derived` 这条主干，不允许再按“唯一 Core Starter -> 其他附属物”的路线推进。

## Phase 0：契约定型

目标：

- 明确模板清单规范
- 明确项目清单规范
- 明确 CLI 协议
- 明确模板分层与模板类型

交付：

- `template-manifest`
- `project-manifest`
- `template-profile`
- `templates registry`

## Phase 1：Core 模板层落地

目标：

- 为每个一等模板类型提供一个最小、稳定、agent 友好的 `core` 模板

交付：

- `starter-core-template`
- `feature-core-template`
- `capability-core-template`
- `provider-core-template`
- `surface-core-template`

## Phase 2：CLI 落地

目标：

- 让 CLI 成为模板层级的统一入口

交付：

- `rendo init <kind>`
- `rendo create`
- `rendo search`
- `rendo inspect`
- `rendo add / pull / upgrade / doctor`

## Phase 3：Base 模板层落地

目标：

- 从每个 `core` 模板派生出一个官方 `base` 模板

交付：

- `application-base-starter`
- `dashboard-feature-base-template`
- `storage-capability-base-template`
- `llm-provider-base-template`
- `admin-surface-base-template`

## Phase 4：能力生命周期最小闭环

目标：

- 先验证 capability template 的 manifest、install、add、pull、upgrade 语义

交付：

- capability template 最小 install plan 机制
- 至少 1 个可被搜索、检查、安装、拉取的官方 capability base 模板

## Phase 5 以后

之后再考虑：

- 更多 derived 模板
- 真实平台能力接入
- registry 增强
- 更强的升级和诊断闭环

