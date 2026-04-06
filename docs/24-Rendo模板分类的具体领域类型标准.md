# Rendo 模板分类的具体领域类型标准

- 文档版本：v4.0
- 日期：2026-04-05
- 文档性质：模板分类标准文档
- 目标：明确模板应如何做“类型分类 + 领域分类 + 场景分类 + 端能力声明”
- 核心结论：**模板分类应先回答“它是什么模板、属于哪一层”，再回答“它服务什么领域、什么场景、支持哪些端”。**

---

## 1. 分类目标

分类首先服务于：

1. 用户浏览和筛选
2. 强 Agent 理解和选择
3. CLI / registry / 平台治理

因此分类体系应优先表达：

- 模板类型
- 模板层级
- 领域分类
- 场景分类
- 端能力

---

## 2. 四层分类模型

推荐把模板分类拆成四层：

1. 模板类型
2. 领域分类
3. 场景分类（可选）
4. 端能力属性

---

## 3. 第一层：模板类型

### 3.1 `Core Template`

表示：

- 某一模板类型的最小控制面
- 不是最终用户消费模板
- 不是具体产品模板

当前有五个：

- starter core
- feature core
- capability core
- provider core
- surface core

### 3.2 `Starter Template`

表示：

- 面向用户和 Agent 的完整项目起点模板

### 3.3 `Feature Template`

表示：

- 可装配到宿主 starter 的业务模块模板

### 3.4 `Capability Template`

表示：

- 基础能力接入模板

### 3.5 `Provider Template`

表示：

- 外部平台或 provider 接入模板

### 3.6 `Surface Template`

表示：

- 一套端形态或交互外观方案模板

---

## 4. Starter 的领域分类

Starter 是最重要的一类模板，应有最清晰的领域标签。

推荐领域包括：

- `saas`
- `ai`
- `blog`
- `cms`
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

### 4.1 `application-base-starter`

应明确存在官方维护的：

- `Application Base Starter`

它的定位是：

- 带界面应用 starter 的 canonical base
- multi-surface-capable
- web-first
- multi-surface-by-request

默认最优解：

- `rendo create application --surfaces web`

而不是默认物理生成所有端。

---

## 5. Starter 的场景分类（可选）

推荐标签：

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

---

## 6. Feature 的领域分类

推荐标签：

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

---

## 7. Capability 的领域分类

推荐标签：

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

---

## 8. Provider 的领域分类

推荐标签：

- `llm-provider`
- `auth-provider`
- `payment-provider`
- `channel-provider`
- `search-provider`
- `storage-provider`
- `workflow-provider`
- `agent-provider`
- `enterprise-integration`

---

## 9. Surface 的领域分类

推荐标签：

- `web-surface`
- `admin-surface`
- `miniapp-surface`
- `mobile-surface`
- `desktop-surface`
- `multi-surface-suite`

---

## 10. 端能力声明规则

端能力是属性，不是一级分类。

推荐值：

- `web`
- `miniapp`
- `mobile`
- `desktop`

默认原则：

- 有界面模板默认至少支持 `web`
- 其他端能力按 manifest 显式声明

---

## 11. 最终结论

Rendo 模板分类的正确顺序是：

1. 先看模板是什么类型、属于哪一层
2. 再看它服务什么领域
3. 再看是否贴近某个场景
4. 最后看它支持哪些端

一句话：

**先确定模板身份，再确定业务标签，最后声明端能力。**
