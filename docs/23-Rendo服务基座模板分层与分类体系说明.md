# Rendo 服务基座模板分层与分类体系说明

- 文档版本：v5.0
- 日期：2026-04-06
- 文档性质：模板体系原则文档
- 目标：统一服务基座模板的分层、身份、目录、命名、authoring 与产物理解
- 核心结论：**Rendo 当前应围绕“每种一等模板类型都有自己的 `core -> base -> derived` 主干”来组织，同时明确 `starter-template` 是服务基座根模板，其他四类是可装配服务单元模板。**

---

## 1. 模板是什么

在当前 Rendo 里，模板应被理解为：

- 可被结构化描述
- 可被 CLI、registry、人类和强 Agent 共同识别
- 可作为服务基座根工程的起点，或服务基座内部某个能力单元的起点
- 有清晰 manifest、目录和继承边界

因此：

- starter 是模板
- feature 是模板
- capability 是模板
- provider 是模板
- surface 是模板

---

## 2. 正确主干：`core -> base -> derived`

### 2.1 `core`

`core` 是模板类型级别的最小控制面。

它负责：

- manifest 最小语义
- CLI 最小语义
- runtime mode 边界
- agent 可读的最小文件结构
- `AGENTS.md`、`CLAUDE.md`、`.agents/`、`interfaces/`、`src/`、`tests/`、`integration/` 的最小接入边界
- 对下一层的稳定继承点

### 2.2 `base`

`base` 是某一模板类型的官方标准示范层。

它负责：

- 该模板类型的 canonical best practice
- 最小但完整的目录与扩展边界
- 供后续 `derived` 稳定继承的起点

### 2.3 `derived`

`derived` 是从某个 `base` 长出来的具体模板。

它负责：

- 具体产品形态
- 具体场景差异
- 具体技术或厂商绑定

---

## 3. 一等模板类型与服务基座位置

当前一等模板类型固定为：

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

关键点：

- 每一种类型都应有自己的 `core` 模板
- `starter-template` 是服务基座根模板
- `feature / capability / provider / surface` 是围绕服务基座装配的服务单元模板
- `base / derived` 是模板角色，不是模板种类

---

## 4. 模板身份如何表达

一个模板的最小身份，应由以下维度共同决定：

1. `templateKind`
2. `templateRole`
3. `category`
4. `id`

在服务基座语义下，还必须让 Agent 能继续看见：

- 它是根模板还是附加模板
- 它提供或扩展哪些可调用接口
- 它属于 `standalone-runnable` 还是 `host-attached`

---

## 5. Authoring 源与正式模板产物

### 5.1 Authoring 源目录

作者侧目录统一为：

```txt
shared/authoring/templates/<role>/<kind>/<category>/<template-id>/
```

例子：

- `shared/authoring/templates/base/starter/application/application-base-starter/`
- `shared/authoring/templates/base/provider/llm/llm-provider-base-template/`

当前 core 共同 authoring 基座是：

```txt
shared/authoring/templates/core/common/skeleton/
```

它的作用是：

- 作为 core 共同部分的唯一 authoring 源
- 通过脚本同步到正式的 core 模板产物层

### 5.2 Generated 产物目录

运行时消费目录统一为：

```txt
shared/templates/core/<kind>/<template-id>/
shared/templates/base/<kind>/<category>/<template-id>/
shared/templates/derived/<kind>/<category>/<template-id>/
```

这里的 `shared/templates` 不是冗余目录，而是：

- formal generated artifacts
- registry 记录的正式模板位置
- CLI 实际消费的模板产物层

也就是说：

- `shared/authoring/templates` 是 authoring truth
- `shared/templates` 是 runtime/distribution consumption layer

### 5.3 当前路径与未来收敛

当前生成路径仍然保留 `<kind>/<template-id>` 这一层。

后续可以继续收敛目录冗余，但在迁移前必须坚持：

- CLI 和 registry 只认正式模板产物层
- 不直接消费 authoring overlays

---

## 6. 通用架构骨架

所有模板类型都必须共享同一套通用骨架：

```txt
<template-root>/
├── rendo.template.json
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .agents/
├── docs/
├── interfaces/
├── src/
├── tests/
├── scripts/
└── integration/
```

其中：

- `AGENTS.md / CLAUDE.md / .agents/` 是 Agent 入口
- `interfaces/` 是接口描述面
- `src/` 是实现根
- `tests/`、`scripts/`、`integration/` 是验证与装配说明面（历史 `install/` 接入说明语义已统一更名为 `integration/`；物理安装根由 manifest `assetIntegration.modes[].targetRoot` 决定）

只有 starter 宿主才额外冻结这些 `src/` 槽位：

- `src/apps/`
- `src/packages/`
- `src/features/`
- `src/capabilities/`
- `src/providers/`
- `src/surfaces/`（保留 `src/surfaces/desktop/`）
- `ops/`

---

## 7. 运行等级

Rendo 当前明确区分两类运行形态：

- `standalone-runnable`
- `host-attached`

这意味着：

- 所有模板都必须可验证
- 不是所有模板都必须独立运行
- 只有 `standalone-runnable` 模板强制要求独立启动、smoke、健康检查或等价心跳机制

---

## 8. Starter 的特殊性

`starter-template` 仍然是当前最重要的消费对象，因为：

- `rendo create` 只面向 starter
- 用户最常从 starter 开始
- 非 starter 模板往往要被宿主 starter 装配

但这不意味着：

- starter 是唯一底座
- 其他模板是 starter 的附属物

---

## 9. `application-base-starter` 的正确定位

`application-base-starter` 是当前官方 starter base 中最关键的一个。

它应承担：

- 界面型服务基座 starter 的 canonical base
- 面向大项目演进的稳定目录模型
- 多端共享核心和 surface 生成规则的清晰示范
- 其他模板资产的标准宿主

---

## 10. 非 starter 模板的宿主规则

当前阶段，feature / capability / provider / surface 等非 starter 模板，应优先通过 manifest `assetIntegration` 驱动的 integration plan 装入 starter 宿主。

推荐宿主在 `src/` 下保持显式槽位：

- `src/apps/`
- `src/packages/`
- `src/features/`
- `src/capabilities/`
- `src/providers/`
- `src/surfaces/`（含保留槽位 `src/surfaces/desktop/`）

同时还应清晰说明它会如何触达宿主中的：

- `AGENTS.md`
- `.agents/capabilities.yaml`
- `interfaces/openapi/`
- `interfaces/mcp/`
- `interfaces/skills/`
- `integration/`
- `ops/`（仅当宿主属于 `standalone-runnable`）

并且必须区分：

- `assetIntegration.modes[].targetRoot`：机器可读、可执行的物理安装根
- `integration/`：人类与 Agent 可读的接入与宿主影响说明

---

## 11. 对 Agent 友好的最低要求

一个高质量模板体系，必须让强 Agent 在短时间内回答：

1. 这是什么模板，属于哪一层
2. 先读哪些文档
3. 可以改哪里，不该改哪里
4. 它由谁创建、谁宿主、如何安装
5. 它会影响哪些可调用入口

因此模板 manifest 和模板目录都应明确暴露：

- `documentation`
- `lineage`
- `compatibility`
- `assetIntegration`
- 固定 Agent 入口和接口描述面目录

---

## 12. 最终结论

Rendo 当前模板体系的正确主干不是：

- “唯一 Core Starter + 其他附属模板”

而是：

- **五类一等模板各自拥有 `core -> base -> derived` 主干**

同时：

- `starter-template` 是服务基座根模板
- `feature / capability / provider / surface` 是服务基座装配模板
- `shared/authoring/templates` 是 authoring 源
- `shared/templates` 是正式模板产物层
- 目录、命名、manifest、`assetIntegration` 与 `integration` 语义都应服务于“让强 Agent 无歧义理解服务基座模板系统”
