# Rendo 模板资产分层与分类体系说明

- 文档版本：v2.0
- 日期：2026-04-04
- 文档性质：模板体系原则文档
- 目标：重新定义 Rendo 的模板资产体系，明确“模板是什么”、分层应该怎么理解，以及为什么正确逻辑应是 `Core Starter -> Base -> Derived`
- 核心结论：**Rendo 中几乎所有可复用资产本质上都属于模板。真正需要建立的不是“模板和扩展的二分法”，而是一套统一的模板资产体系：`Core Starter` 作为唯一基础底座，`Base Template` 作为每类模板的官方最佳实践标准示范，`Derived Template` 作为在其之上演化出的 starter、能力、Provider 或多端形态模板。**

---

## 1. 先定义“模板”到底是什么

在新的 Rendo 体系里，“模板”不能再狭义理解成：

- 一个页面样板
- 一个 starter 仓库
- 一个产品 demo

更准确的定义应是：

**任何被结构化描述、可复用、可被强 Agent 理解、可作为后续工程起点或扩展起点的资产，都属于 Rendo 的模板资产。**

也就是说，一个模板至少要满足：

1. 有明确结构
2. 有明确用途
3. 可被安装、派生、扩展或继续开发
4. 有统一 manifest / metadata
5. 能被平台和 CLI 识别

从这个角度看：

- starter 是模板
- Feature 模块是模板
- Capability 模块是模板
- Provider 接入件是模板
- 多端外观套件也是模板

所以真正的问题不再是：

- “哪些是模板，哪些不是模板”

而是：

- **模板资产应该如何分层**

---

## 2. 为什么原来按“starter / pack / shell”理解不够清晰

之前的表达里，容易把体系理解成：

- starter 是一类东西
- pack 是另一类东西
- shell 又是另一类东西

这在体系变简单的时候还勉强成立。  
但当 Rendo 开始支持：

- 多语言
- 多端
- 多形态 starter
- managed/source/hybrid
- 多种能力扩展

之后，这种理解会迅速变得不够用。

因为：

- Feature 模块也有 manifest
- Capability 也有 manifest
- Provider 也有 manifest
- 多端套件也可能整体交付

也就是说，它们都在模板化。

所以，Rendo 应把“模板资产”作为统一上位概念，再做层级划分。

---

## 3. 正确的模板资产分层：`Core Starter -> Base -> Derived`

### 3.1 总体结论

Rendo 模板资产体系的正确逻辑应是：

- **`Core Starter`**
- **`Base Template`**
- **`Derived Template`**

这是主干，不应再被其他名词打散。

---

## 4. `Core Starter` 是什么

## 4.1 定义

`Core Starter` 是：

- Rendo 体系唯一的基础脚手架底座
- 所有模板资产共享的统一规范层

## 4.2 它的角色

它不代表具体业务，不代表具体产品形态，也不代表具体端。

它负责定义：

- 工程组织原则
- 模板 manifest 契约
- Pack / Module 安装契约
- CLI 语义
- runtime mode 语义
- Agent 指令结构
- 最小可运行底座

## 4.3 它为什么必须唯一

因为它承担的是：

- **统一语言**

如果没有唯一 `Core Starter`，后续所有 starter 和扩展都会逐步分裂成不同体系，强 Agent 和平台也就无法维持统一理解方式。

## 4.4 一句话结论

**`Core Starter` 负责定义“怎么长”，而不是“长成什么业务”。**

---

## 5. `Base Template` 是什么

## 5.1 定义

`Base Template` 是：

- 某一类模板资产的官方标准示范

这里的“某一类”不只包括业务模板，也包括其他模板类型。

## 5.2 它的真正意义

`Base Template` 的作用不是：

- 直接服务某一个最终客户需求

而是：

- 给官方和社区提供一个该类型模板的最佳实践参考实现
- 让用户和强 Agent 有一个统一起点
- 让后续派生模板共享升级与理解路径

一句话：

**`Base Template` 是“该类模板的官方 canonical reference”。**

## 5.3 为什么每类模板都应该有 `Base Template`

这里是一个重要修正。

并不是只有 `Business Template` 需要 `Base Template`。  
更准确地说：

**任何模板类型都应该尽量有一个官方维护的 `Base Template`。**

这是因为：

- 用户和 Agent 需要知道“这一类模板的标准做法是什么”
- 否则每个模板都会自发长成不同风格
- 平台和 CLI 也无法统一管理和升级它们

所以：

- `Base Starter Template`
- `Base Feature Template`
- `Base Capability Template`
- `Base Provider Template`
- `Base Surface Template`

这些概念都成立。

---

## 6. `Derived Template` 是什么

## 6.1 定义

`Derived Template` 是：

- 建立在某个 `Base Template` 之上，面向更具体业务、能力、Provider 或交付形态演化出的模板

## 6.2 它的作用

它负责把：

- 官方标准示范

进一步变成：

- 真实业务可用模板
- 真实能力模块
- 真实场景扩展

## 6.3 一句话结论

**`Derived Template` 是基于标准示范继续演化出的实际模板资产。**

---

## 7. `Base / Derived` 与模板类型的关系

这里必须进一步讲清楚：

- `Base / Derived`
不是模板种类，  
而是：
- **模板角色**

模板种类和模板角色应分开理解。

### 模板种类

例如：

- `Domain`
- `Feature`
- `Capability`
- `Provider`
- `Surface`

### 模板角色

例如：

- `Base`
- `Derived`

所以一个模板应被准确理解为：

- `Base Starter Template`
- `Derived Starter Template`
- `Base Feature Template`
- `Derived Feature Template`
- `Base Capability Template`
- `Derived Capability Template`
- `Base Provider Template`
- `Derived Provider Template`
- `Base Surface Template`
- `Derived Surface Template`

这套逻辑比以前“模板 / pack / shell”混在一起清晰得多。

---

## 8. 模板类型如何理解

在 `Core Starter -> Base -> Derived` 这条主干之下，模板类型可以这样理解：

## 8.1 `Starter Template`

表示：

- 某一类业务场景或产品形态的模板

例如：

- SaaS
- AI Web App
- Headless Agent
- Workflow Service

## 8.2 `Feature Template`

表示：

- 某类业务功能块

例如：

- 企业信息查询
- CRM
- Approval Center
- Billing Center

## 8.3 `Capability Template`

表示：

- 某类基础能力接入

例如：

- Redis
- PostgreSQL
- Search
- Storage
- KB

## 8.4 `Provider Template`

表示：

- 某类 provider 或外部平台接入方式

例如：

- Rendo provider
- OpenAI provider
- Feishu provider
- WeChat provider

## 8.5 `Surface Template`

表示：

- 某类端形态或多端外观套件

例如：

- Web admin surface
- Miniapp surface
- Multi-surface suite

但注意：

`Surface Template` 不应被理解成零散 shell 插件，而更应理解成：

- **面向兼容模板基座的一整套交付形态**

---

## 9. 为什么不能再把一切都叫 pack

CLI 中仍然可以保留：

- `rendo add`

这样的动作，但这不代表所有东西都该在语义上被叫做 pack。

因为：

- 有的模板是完整 starter
- 有的模板是能力块
- 有的模板是业务块
- 有的模板是 provider
- 有的模板是 surface 套件

如果这些都叫 pack，就会失去：

- 分类清晰度
- 用户心智清晰度
- Agent 判断清晰度

更合理的做法是：

- **在交付动作上统一**
- **在语义层上分清**

也就是说：

- CLI 可以统一是安装 / 添加
- 但 manifest 必须说明它到底是哪类模板、是 base 还是 derived

---

## 10. 为什么 `Surface Template` 不应作为零散后装壳存在

这里也要把之前讨论进一步收敛。

如果把：

- Web shell
- Miniapp shell
- Admin shell

做成零散后装件，会出现问题：

- 用户要自己理解端形态怎么拼
- 已耦合业务逻辑的模板后加壳会越来越不自然
- 强 Agent 会在业务与端之间产生混乱

因此，`Surface Template` 更合理的理解应是：

- 一种成套的、多端交付方案
- 并且只作用于兼容的基座模板

所以这里正确的做法不是：

- 弱化 `Surface Template`

而是：

- **把它定义清楚**

---

## 11. 正确的整体关系

综合以上，Rendo 模板资产体系的正确关系应当是：

### 第一层

- `Core Starter`

### 第二层

- 各类型的 `Base Template`

### 第三层

- 各类型的 `Derived Template`

然后每个模板都拥有两个维度：

1. 它属于什么类型
2. 它在该类型中是 `Base` 还是 `Derived`

这就形成了一套真正清晰的模板资产体系。

---

## 12. 最终结论

Rendo 当前最需要的，不是更多模板，而是：

- **清晰的模板资产分层体系**

最准确的逻辑应当是：

1. `Core Starter` 是唯一底座
2. 每一种模板类型都尽量有一个官方维护的 `Base Template`
3. 官方和用户都可以在 `Base Template` 之上派生 `Derived Template`
4. 模板种类和模板角色必须分开理解

一句话结论：

**Rendo 的正确模板逻辑不是“starter / pack / shell 并列”，而是“`Core Starter -> Base Template -> Derived Template` 这条主干，叠加清晰的模板类型分类”，其中代表完整业务与形态起点的主类型应统一使用 `Starter Template` 语义。**
