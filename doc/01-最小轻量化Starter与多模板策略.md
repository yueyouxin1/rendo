# 最小轻量化 Starter 与多模板策略

## 核心结论

**Rendo 不应只有一个“万能最佳实践模板”。**

正确的结构应该是：

- 一个唯一 `Core Starter`
- 多个按领域 / 形态划分的 `Starter Template`

## 为什么不能只有一个重型 starter

重型 starter 会带来：

1. 默认依赖过多
2. 启动镜像过大
3. 维护复杂
4. Pack 难以插拔
5. 很多用户只需要其中一小部分能力

## 最小轻量化原则

starter 默认只保留：

- 该领域 80% 场景下不可或缺的骨架

不默认塞入：

- 未来可能会用到的大量能力

## 多模板策略

### `Core Starter`

不绑定领域，不绑定 UI，不绑定 Web。

### `Starter Template`

应至少分成：

- `web-app-starter`
- `saas-starter`
- `ai-webapp-starter`
- `headless-agent-starter`
- `workflow-service-starter`

后续再根据真实案例扩展。

## 默认基础设施策略

### 默认不强制重基础设施

例如：

- 向量数据库
- 大型消息队列
- 重型企业后台

这些不应无脑默认塞进每个 starter。

### 默认优先轻量方案

例如：

- 无持久化：纯运行
- 轻持久化：SQLite / 本地文件
- 需要再升级：通过 pack 安装 Postgres / Redis / pgvector / Milvus

## 最终原则

**starter 先轻，能力再长。**
