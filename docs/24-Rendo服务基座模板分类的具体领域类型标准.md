# Rendo 服务基座模板分类的具体领域类型标准

- 文档版本：v5.0
- 日期：2026-04-06
- 文档性质：模板分类标准文档
- 目标：明确服务基座模板应如何做“类型分类 + 根/装配位置分类 + 领域分类 + 场景分类 + Agent 接口声明 + 端能力声明”
- 核心结论：**模板分类应先回答“它是什么模板、属于哪一层、是根模板还是装配模板”，再回答“它服务什么领域、什么场景、暴露哪些 Agent 接口、支持哪些端”。**

---

## 1. 分类目标

分类首先服务于：

1. 用户浏览和筛选
2. 强 Agent 理解和选择
3. CLI / registry / 平台治理

因此分类体系应优先表达：

- 模板类型
- 模板层级
- 服务基座位置
- 领域分类
- 场景分类
- Agent 接口能力
- 端能力

---

## 2. 六层分类模型

推荐把模板分类拆成六层：

1. 模板类型与层级
2. 服务基座位置
3. 领域分类
4. 场景分类（可选）
5. Agent 接口能力
6. 端能力属性

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

- 面向用户和 Agent 的完整服务基座根模板

### 3.3 `Feature Template`

表示：

- 可装配到宿主服务基座 starter 的业务模块模板

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

## 4. 第二层：服务基座位置

推荐只用两个判断结果：

- `foundation-root`
- `foundation-attachable`

当前约定：

- `starter-template` 默认是 `foundation-root`
- `feature / capability / provider / surface` 默认是 `foundation-attachable`

---

## 5. Starter 的领域分类

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

### 5.1 `application-base-starter`

应明确存在官方维护的：

- `Application Base Starter`

它的定位是：

- 带界面应用服务基座的 canonical base
- multi-surface-capable
- web-first
- multi-surface-by-request

默认最优解：

- `rendo create application --surfaces web`

而不是默认物理生成所有端。

---

## 6. Starter 的场景分类（可选）

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

## 7. Feature 的领域分类

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

## 8. Capability 的领域分类

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

## 9. Provider 的领域分类

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

## 10. Surface 的领域分类

推荐标签：

- `web-surface`
- `admin-surface`
- `miniapp-surface`
- `mobile-surface`
- `desktop-surface`
- `multi-surface-suite`

---

## 11. Agent 接口声明规则

Agent 接口是模板分类的重要属性，建议显式声明：

- `mcp`
- `skill`
- `openapi`
- `a2ui`

默认原则：

- starter 根模板应尽量明确声明它最终会暴露哪些接口面
- 非 starter 模板应明确它是“提供接口片段”还是“扩展宿主接口面”

---

## 12. 端能力声明规则

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

## 13. 最终结论

Rendo 服务基座模板分类的正确顺序是：

1. 先看模板是什么类型、属于哪一层
2. 再看它是根模板还是装配模板
3. 再看它服务什么领域
4. 再看是否贴近某个场景
5. 再看它暴露哪些 Agent 接口
6. 最后看它支持哪些端

一句话：

**先确定模板身份，再确定服务基座位置，再确定业务标签和 Agent 接口，最后声明端能力。**
