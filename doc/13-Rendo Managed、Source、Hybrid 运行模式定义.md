# Rendo Managed、Source、Hybrid 运行模式定义

## 文档目标

明确 `Managed / Source / Hybrid` 三种运行模式的定义、边界、适用场景和与 starter / pack / 平台的关系。

---

## 1. 为什么必须先定义运行模式

当前 Rendo 同时面对几类需求：

- 小白用户希望默认就能跑
- 强 Agent 用户希望拿源码继续开发
- 平台希望保留默认最优解和持续订阅能力

如果没有统一运行模式语义，就会出现：

- 某些 starter 默认依赖不清晰
- pack 到底是本地运行还是云端运行说不清
- Agent 很难判断应该如何接线

所以运行模式不是附属概念，而是 starter 与 pack 的核心语义之一。

---

## 2. Source 模式

## 2.1 定义

`Source` 模式表示：

- 能力主要在本地源码和本地运行环境中存在与执行

### 特征

- 强 Agent 可直接读改代码
- Git / diff / review 自然
- 最开放
- 最适合高级用户和工程团队

### 适合的能力

- UI 模块
- 业务逻辑
- 本地工具实现
- 本地 workflow 实现

### 优点

- 最符合源码 starter 路线
- 最自然的工程体验

### 缺点

- 默认配置更复杂
- 小白用户门槛更高
- 平台可控性最低

---

## 3. Managed 模式

## 3.1 定义

`Managed` 模式表示：

- 能力主要运行在 Rendo Cloud 或官方托管环境中
- 本地只保留接入点、SDK 和最小配置

### 特征

- 小白用户最省心
- 默认最优解最强
- 平台最可控

### 适合的能力

- 托管 Agent
- 托管 Workflow
- 托管 KB
- 托管搜索
- 官方 tool / integration

### 优点

- 默认开箱体验最好
- 更容易形成持续订阅

### 缺点

- 对 Agent 来说不如纯源码自然
- 需要更强的 provider 和控制面设计

---

## 4. Hybrid 模式

## 4.1 定义

`Hybrid` 模式表示：

- 一部分能力在本地源码和本地运行环境中
- 一部分能力由 Rendo Cloud 托管

### 特征

- 当前最现实
- 能兼顾小白用户和强 Agent
- 最适合作为主流默认路径

### 适合的能力

- 本地 UI + 云端 Agent
- 本地 DB schema + 云端 KB 检索
- 本地配置 + 云端 workflow

### 优点

- 平衡开放性与默认体验
- 适合 starter 逐步增强

### 缺点

- 需要更清晰的边界和 manifest
- 最容易在工程上“分裂成两套世界”

---

## 5. 三种模式的关系

它们不应被理解成互斥产品路线，而应被理解成：

- starter 或 pack 的运行方式声明

### 举例

- `Core Starter`：更偏 `source`
- `web-app-starter`：更偏 `source` 或 `hybrid`
- `managed-agent-pack`：更偏 `managed`
- `channel-pack`：视情况而定，常偏 `hybrid`

---

## 6. 哪个模式适合谁

## 6.1 Source

适合：

- 强 Agent 用户
- 工程团队
- 高自由度场景

## 6.2 Managed

适合：

- 小白用户
- 不想碰技术细节的团队
- 默认托底体验

## 6.3 Hybrid

适合：

- 大多数真实商业 starter
- 既需要源码可改，又希望默认接入能力顺滑的场景

---

## 7. 与商业模式的关系

### Source

更容易形成：

- 授权收入

### Managed

更容易形成：

- 订阅收入
- 用量收入

### Hybrid

更容易形成：

- 授权 + 订阅的组合收入

所以：

- `Hybrid` 往往是商业上最健康的默认模式

---

## 8. 默认建议

当前默认建议如下：

### `Core Starter`

- 默认 `source`

### 第一版 `Starter Template`

- 默认 `hybrid`

### 官方高价值能力包

- 默认 `managed` 或 `hybrid`

### 社区通用能力包

- 以 `source` 为主，必要时支持 `hybrid`

---

## 9. 最终结论

Rendo 必须在一开始就把：

- `source`
- `managed`
- `hybrid`

三种运行模式讲清楚，否则 starter、pack、平台、CLI 和 Agent 之间的语义会持续混乱。

一句话结论：

**运行模式不是实现细节，而是 Rendo starter 与 pack 体系的一级概念。**
