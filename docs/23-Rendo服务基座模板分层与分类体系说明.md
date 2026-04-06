# Rendo 服务基座模板分层与分类体系说明

- 文档版本：v4.0
- 日期：2026-04-06
- 文档性质：模板体系原则文档
- 目标：统一服务基座模板的分层、身份、目录、命名与继承理解
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

Rendo 需要统一的服务基座模板体系，而不是把这些资产拆成互相平行、语义混乱的名字堆。

---

## 2. 正确主干：`core -> base -> derived`

### 2.1 `core`

`core` 是模板类型级别的最小控制面。

它负责：

- manifest 最小语义
- CLI 最小语义
- runtime mode 边界
- agent 可读的最小文件结构
- `.agent`、`api`、`mcp`、`skills`、`docs/modules` 的最小接入边界
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
- 它提供或扩展哪些 Agent 可调用接口

也就是说，Agent 不应只看名字判断模板，而应同时看：

- 它是什么种类
- 它在第几层
- 它属于什么领域分类
- 它的稳定标识是什么
- 它要落到宿主的哪一层接口面

---

## 5. 目录规范

### 5.1 Authoring 源目录

作者侧目录统一为：

```txt
shared/authoring/templates/<role>/<kind>/<category>/<template-id>/
```

例子：

- `shared/authoring/templates/base/starter/application/application-base-starter/`
- `shared/authoring/templates/base/provider/llm/llm-provider-base-template/`

### 5.2 Generated 产物目录

运行时消费目录统一为：

```txt
shared/templates/core/<kind>/<template-id>/
shared/templates/base/<kind>/<category>/<template-id>/
shared/templates/derived/<kind>/<category>/<template-id>/
```

这样做的原因是：

- `core` 的消费方更关心模板类型
- `base / derived` 既要保留种类，也要保留类别
- 目录本身就能帮助 Agent 快速判断模板身份

---

## 6. 命名规范

### 6.1 Core 模板

固定使用：

- `starter-core-template`
- `feature-core-template`
- `capability-core-template`
- `provider-core-template`
- `surface-core-template`

### 6.2 Base 模板

推荐规则：

- starter：`<category>-base-starter`
- 其他模板：`<category>-<kind>-base-template`

当前官方例子：

- `application-base-starter`
- `dashboard-feature-base-template`
- `storage-capability-base-template`
- `llm-provider-base-template`
- `admin-surface-base-template`

### 6.3 Derived 模板

推荐规则：

- 直接表达具体产品或场景身份
- 但必须通过 `lineage` 指向自己的 `core` 和 `base`

---

## 7. 服务基座的标准接口面

一个可运行的 starter 服务基座最终应清晰暴露：

- `.agent/`
- `api/`
- `mcp/`
- `skills/`
- `docs/modules/`

对于非 starter 模板，这些接口面可以表现为：

- 自身携带的片段
- 或对宿主中对应目录和契约的显式扩展说明

重点不是每个模板都长成完整应用，而是：

- 必须把 Agent 可调用面和扩展点写清楚

---

## 8. Starter 的特殊性

`starter-template` 仍然是当前最重要的消费对象，因为：

- `rendo create` 只面向 starter
- 用户最常从 starter 开始
- 非 starter 模板往往要被宿主 starter 装配

但这不意味着：

- starter 是唯一底座
- 其他模板是 starter 的附属物

正确理解是：

- starter 是最重要的一类模板
- 但它和其他模板种类一样，也有自己的 `core / base / derived`

---

## 9. `application-base-starter` 的正确定位

`application-base-starter` 是当前官方 starter base 中最关键的一个。

它应承担：

- 界面型服务基座 starter 的 canonical base
- 面向大项目演进的稳定目录模型
- 多端共享核心和 surface 生成规则的清晰示范
- Agent 可调用接口面的标准宿主

它必须是：

- multi-surface-capable
- web-first
- multi-surface-by-request
- 大型项目可演进

它不应是：

- 默认物理生成所有端
- 默认捆绑 admin、业务模块、provider 厂商
- 巨型一体化 SaaS 模板

---

## 10. 非 starter 模板的宿主规则

当前阶段，feature / capability / provider / surface 等非 starter 模板，应优先通过 manifest 驱动的 install plan 装入 starter 宿主。

推荐宿主根目录应保持显式：

- `features/`
- `capabilities/`
- `providers/`
- `surfaces/`

同时还应清晰说明它会如何触达宿主中的：

- `.agent/`
- `api/`
- `mcp/`
- `skills/`
- `docs/modules/`

这样做有三个收益：

- 安装与升级边界清晰
- Agent 更容易判断资产归属
- Starter 自身目录不会被模板资产随意污染

---

## 11. 对 Agent 友好的最低要求

一个高质量模板体系，必须让强 Agent 在短时间内回答：

1. 这是什么模板，属于哪一层
2. 先读哪些文档
3. 可以改哪里，不该改哪里
4. 它由谁创建、谁宿主、如何安装
5. 它会影响哪些 Agent 可调用入口

因此模板 manifest 和模板目录都应明确暴露：

- `documentation`
- `agentArtifacts`
- `lineage`
- `compatibility`
- `assetInstall`

---

## 12. 最终结论

Rendo 当前模板体系的正确主干不是：

- “唯一 Core Starter + 其他附属模板”

而是：

- **五类一等模板各自拥有 `core -> base -> derived` 主干**

同时：

- `starter-template` 是服务基座根模板
- `feature / capability / provider / surface` 是服务基座装配模板
- `application-base-starter` 是当前最关键的 starter base
- 目录、命名、manifest 和 install 语义都应服务于“让强 Agent 无歧义理解服务基座模板系统”
