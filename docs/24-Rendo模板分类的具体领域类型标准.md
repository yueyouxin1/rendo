# Rendo 模板分类的具体领域类型标准

- 文档版本：v3.0
- 日期：2026-04-04
- 文档性质：模板分类标准文档
- 目标：明确 Rendo 模板资产在平台中的具体分类方式，包括模板分类、领域分类、场景分类与端能力声明
- 核心结论：**Rendo 模板的正确分类方式应是“模板分类 + 领域分类 + 场景分类（可选） + 端能力属性”。其中带界面的模板默认最优解是至少支持 `web`，其他端属于能力扩展属性而不是一级分类。**

---

## 1. 模板分类的目标

模板分类不应首先服务于：

- 技术实现
- 某个框架
- 某个运行时

而应首先服务于：

1. 用户浏览和筛选
2. 强 Agent 理解和选择
3. 平台治理、升级和推荐

所以模板分类必须回答：

- 这是什么类型的模板
- 它主要解决什么业务 / 产品问题
- 它是否贴近某个垂直场景
- 它支持哪些端

---

## 2. 总体分类结构

Rendo 模板分类建议分成四层：

## 2.1 第一层：模板分类

回答：

- **它在 Rendo 体系中属于什么类型**

这是顶层分类。

## 2.2 第二层：领域分类

回答：

- **它主要属于什么产品 / 能力领域**

这是一层稳定的业务标签。

## 2.3 第三层：场景分类（可选）

回答：

- **它更贴近哪个垂直场景或行业**

这是一层增强筛选能力的标签，不要求所有模板都必须有。

## 2.4 第四层：端能力属性

回答：

- **它支持哪些端**

例如：

- `web`
- `miniapp`
- `mobile`
- `desktop`

这层只作为能力属性，不作为一级分类。

---

## 3. 第一层：模板分类

这是最顶层、必填分类。

## 3.1 `Core Starter`

表示：

- 唯一基础底座
- 定义统一工程语言和契约

特点：

- 可运行
- 不绑定具体业务形态
- 不绑定具体产品端

## 3.2 `Starter Template`

表示：

- 面向用户和强 Agent 的完整业务 / 产品起点模板

特点：

- 可独立形成完整闭环
- 是用户主要消费对象
- 可以有界面，也可以没有界面

## 3.3 `Feature Template`

表示：

- 一块可复用的业务功能模块模板

特点：

- 不能独立构成完整产品
- 用于增强现有 starter

## 3.4 `Capability Template`

表示：

- 一类基础能力接入模板

特点：

- 偏基础设施与通用能力
- 不负责业务完整闭环

## 3.5 `Provider Template`

表示：

- 一类 provider / 外部平台接入模板

特点：

- 与授权和配置强相关
- 更偏接入和集成

## 3.6 `Surface Template`

表示：

- 一套端形态 / 外观 / 交互交付方案

特点：

- 不应该是零散 shell
- 更适合作为成套交付
- 只作用于兼容的模板基座

---

## 4. `Starter Template` 的领域分类

### 4.0 `Application Base Starter Template` 的默认最优解

在所有带界面的 starter 中，应明确存在一个官方维护的：

- **`Application Base Starter Template`**

它的角色是：

- 带界面应用型 starter 的 canonical base
- 定义统一的应用工程规范
- 定义多端共享核心和端能力生成规则

但要注意：

- 它应是 **multi-surface-capable**
- 而不是 **multi-surface-by-default**

也就是说：

- 这个 base 内建多端最佳实践蓝图
- 实际创建项目时，不默认物理生成所有端

正确做法是由 CLI 在创建时按需指定端组合，例如：

- `--surfaces web`
- `--surfaces web,miniapp`
- `--surfaces web,mobile`

默认最优解：

- **仅生成 `web`**

并且：

- `admin` 不属于 `Application Base Starter Template` 的必选项
- 它应作为可选模块或更具体模板的默认能力存在

`Starter Template` 是最重要的一类模板，因此需要最清晰的领域分类。

推荐的领域类型包括：

- `saas`
- `ai`
- `blog`
- `cms`
- `web3`
- `commerce`
- `internal-tool`
- `workflow`
- `knowledge`
- `agent`
- `content`
- `community`
- `education`
- `productivity`
- `developer-tool`

### 说明

这些标签可以多选。  
例如：

- 一个 AI SaaS 模板可同时标记：
  - `saas`
  - `ai`
  - `agent`

---

## 5. `Starter Template` 的场景分类（可选）

`Starter Template` 非常适合增加一层场景分类。

推荐的场景标签包括：

- `healthcare`
- `finance`
- `ecommerce`
- `education`
- `legal`
- `real-estate`
- `customer-support`
- `content-studio`
- `creator-economy`
- `enterprise-service`
- `private-traffic`
- `productivity-office`

### 说明

场景分类不是为了替代领域分类，而是：

- 进一步帮助用户和 Agent 在垂直方向上做精细筛选

---

## 6. `Feature Template` 的领域分类

`Feature Template` 用来补业务模块。

推荐的领域类型包括：

- `auth`
- `billing`
- `approval`
- `crm`
- `knowledge-admin`
- `content-editor`
- `analytics`
- `search-ui`
- `dashboard`
- `notification`
- `multitenancy`
- `admin`

### 场景分类是否需要

通常：

- **可选**

如果某个 feature 明显服务于垂直场景，可以继续附加场景标签。  
例如：

- 医疗问诊表单模块
- 金融合规模块
- 电商订单管理模块

---

## 7. `Capability Template` 的领域分类

`Capability Template` 用来补基础能力。

推荐的领域类型包括：

- `database`
- `cache`
- `vector-store`
- `search`
- `storage`
- `auth-runtime`
- `billing-runtime`
- `queue`
- `workflow-runtime`
- `agent-runtime`
- `observability`
- `deployment`

### 场景分类是否需要

通常：

- **不需要**

原因：

- 这类模板更偏通用基础设施能力
- 用户更关心它“能做什么”，不太关心它服务哪个行业

---

## 8. `Provider Template` 的领域分类

`Provider Template` 用来补 provider 或外部平台接入。

推荐的领域类型包括：

- `llm-provider`
- `auth-provider`
- `payment-provider`
- `channel-provider`
- `search-provider`
- `storage-provider`
- `workflow-provider`
- `agent-provider`
- `enterprise-integration`

### 场景分类是否需要

通常：

- **不需要**

因为这类模板的重点是：

- 接谁
- 怎么接

而不是：

- 服务哪个垂直场景

---

## 9. `Surface Template` 的领域分类

`Surface Template` 是端形态或成套外观方案。

推荐的领域类型包括：

- `web-surface`
- `admin-surface`
- `miniapp-surface`
- `mobile-surface`
- `desktop-surface`
- `multi-surface-suite`

### `Surface Template` 的场景分类（可选）

这类模板也很适合带场景标签，因为不同业务主题往往对应不同的 surface 方案。

推荐的场景标签包括：

- `saas-admin`
- `customer-support`
- `creator-workbench`
- `knowledge-workbench`
- `internal-ops`
- `education-panel`
- `ecommerce-ops`

### 说明

`Surface Template` 不应被理解成：

- 任意零散壳扩展

更合理的理解应是：

- 与某类 starter 兼容的一整套端形态交付

---

## 10. 多类型模板的表达方式

一个模板通常不会只有一个标签。  
更自然的做法是：

- **模板分类单选**
- **领域分类多选**
- **场景分类可选多选**
- **端能力属性多选**

### 示例 1

某 AI SaaS 模板：

- 模板分类：`Starter Template`
- 领域分类：`saas`, `ai`, `agent`
- 场景分类：`enterprise-service`, `customer-support`
- 端能力：`web`, `miniapp`

### 示例 2

某企业信息查询模块：

- 模板分类：`Feature Template`
- 领域分类：`analytics`, `search-ui`
- 场景分类：`enterprise-service`
- 端能力：`web`

### 示例 3

某 Redis 能力模板：

- 模板分类：`Capability Template`
- 领域分类：`cache`
- 场景分类：无
- 端能力：无

---

## 11. 默认最优解说明

为了避免心智负担，平台和 CLI 在有图形界面的模板上，应默认：

- 至少支持 `web`

其他端能力：

- `miniapp`
- `mobile`
- `desktop`

作为能力属性显式声明即可。  
不需要在分类层再单独引入：

- `web-only`
- `miniapp-only`

等概念。

这会让用户和 Agent 更容易理解：

- 先看模板是什么
- 再看它支持哪些端

---

## 12. 最终结论

Rendo 模板分类的正确方式，应当是：

1. 先确定模板分类（它是什么类型的模板）
2. 再确定领域分类（它主要解决什么问题）
3. 再在需要时增加场景分类（它更贴近哪个垂直场景）
4. 最后声明端能力（它支持哪些端）

一句话结论：

**模板分类应先回答“它属于哪一类模板、适合什么领域和场景”，再回答“它支持哪些端”，默认最优解是带界面模板至少支持 `web`。**
