# `rendo init` 与 `rendo create` 的命令分工说明

## 文档目标

明确 `rendo init` 与 `rendo create` 的职责边界，避免 CLI 语义混乱。

---

## 1. 核心结论

### `rendo init`

用于：

- 初始化 `Core Starter`
- 搭底座
- 从统一规范开始

它更适合：

- 模板作者
- 高级用户
- 强 Agent
- 从零搭领域 starter 的场景

### `rendo create`

用于：

- 基于某个 `Domain Starter` 创建真正可用的项目

它更适合：

- 普通用户
- 想直接开始某类业务 starter 的团队
- 强 Agent 的默认主流工作流

一句话：

**`init` 负责底座，`create` 负责产品形态。**

---

## 2. 为什么不能只保留一个命令

如果只有一个命令，会把：

- 基础底座初始化
- 具体 starter 创建

混在一起。  
这会导致：

- `Core Starter` 和 `Domain Starter` 边界变糊
- CLI 心智变乱

---

## 3. 推荐心智模型

### `rendo init`

像：

- `git init`
- `npm init`

### `rendo create`

像：

- `create-next-app`
- `npm create`

---

## 4. 最终结论

如果 `Core Starter` 是唯一底座，那么它更适合由：

- `rendo init`

来初始化。  
而大多数用户真正会用的主入口应该是：

- `rendo create`

---

## 5. 一句话结论

**`init` 创建底座，`create` 创建项目。**
