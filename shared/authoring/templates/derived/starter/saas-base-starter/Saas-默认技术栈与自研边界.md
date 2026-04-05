# 默认技术栈与自研边界

## 总原则

站在成熟生态肩膀上，不继续自研通用 runtime。

## 默认主栈

- 前端 / 全栈应用框架：**Next.js App Router**
- 语言：**TypeScript**
- UI：**Tailwind CSS v4 + shadcn/ui**
- 认证：**Better Auth**
- 数据库：**PostgreSQL**
- ORM / migration：**Drizzle ORM**
- 缓存 / 协调：**Redis**
- 默认知识库(用于高级检索模板)：**PostgreSQL + pgvector**
- Durable workflow / jobs：**Trigger.dev**
- 支付：**Stripe Billing**
- 工作区交付：**Docker Compose / Dev Container**

## 为什么这样选

1. 对强 Agent 自然
2. 对 starter 足够成熟
3. 文档和生态完善
4. 不会把团队重新拖回自研通用基础设施

## 关于数据库与缓存

### PostgreSQL

仍然作为默认主数据库。

### Drizzle ORM

默认`Drizzle`，原因是：

- 更贴近 TypeScript / SQL 真相
- 更少额外抽象层
- 更适合强 Agent 直接理解和修改
- 与当前主流 Next.js 路线更一致

### Redis

`Redis` 默认纳入 starter 基础设施，作为：

- 缓存
- ratelimit
- 短期状态协调
- 幂等与去重辅助
- 轻量异步协调层

它不应被视为“可选附加”，而应被视为：

- **默认基础设施组件**

### Kafka / RabbitMQ

不进入默认 starter。

原因：

- 对第一版 vertical starter 来说过重
- 运维复杂度高
- 与“开箱即用”的目标冲突

后续只在明确需要的模板变体中再考虑。

## 哪些部分不要自研

不要继续自研：

- 通用认证系统
- 通用数据库运行时
- 通用缓存 / 消息系统
- 通用支付引擎

## 哪些部分值得自研

只自研：

- starter 标准
- 模板 metadata / manifest
- 初始化 CLI
- 默认接入层
- 国内适配
- 模板升级机制
- 与 starter 直接相关的最小治理约定