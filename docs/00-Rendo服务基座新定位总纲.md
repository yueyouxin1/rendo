# Rendo 服务基座新定位总纲

## 目标

Rendo 的规范层定位已经升级为：

- **面向智能体的服务基座平台**

但当前仓库的工作重点仍然是：

- 先把这套平台所依赖的模板契约、目录约束、CLI 语义和装配机制做扎实

因此，当前正确表述不是“先做一个平台产品”，也不是“继续做一个 starter 模板站”，而是：

- **先做成一套围绕服务基座的模板系统与控制面**

## 规范术语

当前仓库统一使用以下规范术语：

- **服务基座**：一个可演进、可部署、可被 Agent 理解和调用的工程起点
- **面向智能体的服务**：服务本身面向外部 Agent 暴露能力，而不是把服务等同于聊天机器人
- **starter-template**：服务基座根模板，负责创建可运行项目
- **feature / capability / provider / surface template**：围绕服务基座装配的服务单元模板

说明：

- “种子工程”可以作为叙事或市场表达出现
- 但当前规范、字段和 CLI 语义统一使用“服务基座”而不是“种子工程”

## 正确主干

Rendo 当前仍然以统一的：

- `core`
- `base`
- `derived`

作为唯一主干。

这条主干适用于所有一等模板类型，而不是只服务 `starter`。

## 一等模板类型

当前固定五类一等模板类型：

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

它们的正确理解是：

- `starter-template` 是服务基座根模板
- 其他四类是服务基座可装配的服务单元模板
- 它们都属于一等模板，而不是 starter 的附属插件

## 分层职责

### 1. `core`

`core` 是模板类型级别的最小控制面。

它负责：

- manifest 规则
- CLI 语义
- runtime mode 约束
- install / pull / upgrade / doctor 的统一理解方式
- agent 可读、可操作的最小文件结构
- `.agent`、`api`、`mcp`、`skills`、`docs/modules` 的最小接入约定

`core` 不是最终产品，也不是最终服务基座。

### 2. `base`

`base` 是每一种模板类型的官方标准示范层。

它负责：

- 给出该类型模板的 canonical best practice
- 把 `core` 的控制面落成一个清晰、可继承的标准起点
- 在不引入过重平台依赖的前提下，给出服务基座的标准 Agent 可调用面

### 3. `derived`

`derived` 是从某个 `base` 长出来的具体模板。

它负责：

- 承载具体产品形态
- 承载具体行业或场景差异
- 承载具体厂商绑定
- 承载更完整的交互层和交付形态

## 服务基座的最低要求

对于一个可运行的 starter 基座，当前规范层已经明确它最终应暴露：

- `.agent/instructions.md`
- `.agent/capabilities.yaml`
- `.agent/review_checklist.md`
- `api/openapi.yaml`
- `mcp/server.yaml`
- `skills/skill_manifest.json`
- `docs/modules/*`

对于非 starter 模板，这些内容可以表现为：

- 自身携带的片段
- 或对宿主 starter 中对应位置的显式扩展约定

重点是：

- 必须让人类和强 Agent 都能明确看见能力入口和扩展边界

## 当前实施原则

1. 先把 `core` 和 `base` 做扎实，再放大 `derived`
2. `rendo cli` 必须直接服务这条主干
3. 不允许再把“唯一 Core Starter”当成整个系统的唯一底座描述
4. `starter` 仍然重要，但它现在代表“服务基座根模板”，不是唯一模板中心
5. 当前仓库只做服务基座模板体系，不直接跳去做 marketplace、预览平台或 SaaS 管理面

## 当前默认路径

当前默认实现路径是：

1. 完成五类 `core` 模板
2. 完成 `rendo init <kind>`
3. 完成五类官方 `base` 模板
4. 让 `starter-template` 先成为第一个可运行的服务基座创建入口
5. 再逐步引入 `derived`、更强的能力生命周期，以及后续的 Agent 可调用验证工具

## 非目标

现在不做：

- 平台 UI
- 模板 marketplace
- 预览驱动的需求探索产品面
- 企业管理面
- 全量 SaaS 能力
- 大而全的一体化 starter
