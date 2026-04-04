# Starter Template 分类标准

## 文档目标

定义 `Starter Template` 应如何分类、各类 starter 的典型边界是什么、如何判断一个新 starter 应属于哪一类。

---

## 1. 什么是 `Starter Template`

`Starter Template` 是建立在 `Core Starter` 之上的具体产品形态与场景模板。

它负责定义：

- 默认产品形态
- 默认运行方式
- 默认前端壳
- 默认能力骨架
- 默认 pack 组合

一句话：

**`Starter Template` 定义“长成什么业务起点”。**

---

## 2. 分类原则

分类不能按“技术栈”来分，而应优先按：

1. 是否有图形界面
2. 是否以 Web 为主
3. 是否以 Agent / Workflow / automation 为主
4. 是否面向 SaaS 商业化
5. 是否是特定垂直业务场景

---

## 3. 推荐的一级分类

## 3.1 `web-app-starter`

适合：

- 有 Web UI
- 不一定带商业化
- 适合一般产品应用

默认壳：

- `Next.js`

## 3.2 `saas-starter`

适合：

- 带用户认证
- 带订阅与支付
- 带管理后台
- 面向 SaaS 交付

默认壳：

- `Next.js`

## 3.3 `ai-webapp-starter`

适合：

- Web 应用
- 强 AI / Agent / KB 交互
- 聊天或 AI-native UI

默认壳：

- `Next.js`

## 3.4 `headless-agent-starter`

适合：

- 没有图形界面
- 以 Agent / API / automation 为核心

默认壳：

- 无 UI 壳

## 3.5 `workflow-service-starter`

适合：

- durable workflow
- async jobs
- automation service

默认壳：

- worker / Trigger.dev 主导

## 3.6 `internal-tool-starter`

适合：

- 企业内部系统
- 管理面板
- 轻量业务后台

默认壳：

- `Next.js`

---

## 4. 垂直场景 starter 的定义

在一级分类之上，还可以叠加垂直场景：

- 客服
- 内容生产
- 知识工作台
- 企业信息查询
- CRM / OA
- 教育 / 医疗 / 法务等行业工具

判断原则：

只有当某个垂直场景具有：

- 高重复性
- 高相似结构
- 高商业价值
- 高交付沉淀价值

时，才值得独立成 starter。

---

## 5. 如何判断新需求该落到哪个 starter

判断顺序建议：

1. 先判断是否需要 UI
2. 再判断是否需要商业化骨架
3. 再判断是否以 Agent / Workflow 为主
4. 最后判断是否值得抽成垂直场景 starter

---

## 6. 最终结论

`Starter Template` 的分类必须服务于真实交付和真实复用，而不是为了把模板目录做得更好看。

一句话结论：

**starter 的分类依据应是“业务形态和交付模式”，而不是“技术名词”。**
