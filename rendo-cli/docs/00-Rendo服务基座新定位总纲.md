# Rendo 服务基座新定位总纲

## 目标

Rendo 的规范层定位已经升级为：

- **面向智能体的服务基座平台**

但当前仓库的工作重点仍然是：

- 先把这套平台所依赖的模板契约、目录约束、CLI 语义和装配机制做扎实

因此，当前正确表述不是“先做一个平台产品”，也不是“继续做一个 starter 模板站”，而是：

- **先做成一套围绕服务基座的模板系统、内部分发资产层与控制面**

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
- `AGENTS.md`、`CLAUDE.md`、`.agents/`、`interfaces/`、`src/`、`tests/`、`integration/` 的最小接入约定
- `standalone-runnable` 与 `host-attached` 的运行形态边界

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
- 承载更完整的交付形态

## 服务基座的最低要求

对于一个可运行的 starter 基座，当前规范层已经明确它最终应暴露：

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/skills/*/SKILL.md`
- `.agents/review-checklist.md`
- `interfaces/openapi/`
- `interfaces/mcp/`
- `interfaces/skills/`
- `docs/structure.md`
- `docs/extension-points.md`

对于非 starter 模板，这些内容可以表现为：

- 自身携带的片段
- 或对宿主 starter 中对应位置的显式扩展约定

重点是：

- 必须让人类和强 Agent 都能明确看见能力入口和扩展边界

## Authoring 与内部分发资产

当前仓库已经明确分成两层：

- `shared/authoring/templates`：authoring 源
- `shared/templates`：Rendo 内部分发资产层

其中：

- `shared/authoring/templates/core/common/skeleton` 是当前 core 的共同 authoring 基座
- `shared/templates/*` 是 registry、bundle 与 runtime-pre 实际消费的内部分发资产，不是用户开发入口

## 当前默认路径

当前默认实现路径是：

1. 完成五类 `core` 模板
2. 完成 `rendo init <kind>`
3. 完成五类官方 `base` 模板
4. 让 `starter-template` 先成为第一个可运行的服务基座创建入口
5. 再逐步引入更强的 asset lifecycle、远程 registry 与后续平台面

## 非目标

现在不做：

- 平台 UI
- 模板 marketplace
- 预览驱动的需求探索产品面
- 企业管理面
- 全量 SaaS 能力
- 大而全的一体化 starter
