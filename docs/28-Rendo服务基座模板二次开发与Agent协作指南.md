# Rendo 服务基座模板二次开发与 Agent 协作指南

## 目标

让强 Agent 在接手任意 Rendo 模板时，能快速、无歧义地理解：

- 模板身份
- 目录职责
- Agent 可调用入口
- 安全扩展点
- 不该破坏的边界

---

## 1. 推荐工作流

1. 先读 `rendo.template.json`
2. 再读 `agentArtifacts` 和 `documentation` 指向的文件
3. 明确当前模板属于 `core / base / derived` 哪一层
4. 明确它是 starter 根模板还是非 starter 装配模板
5. 再决定是“继续派生”还是“直接修改当前模板”

---

## 2. Starter 二开原则

- 共享逻辑优先进入 `packages/*`
- Surface 代码留在 `apps/*`
- 非 starter 资产优先进入 `features/`、`capabilities/`、`providers/`、`surfaces/`
- 与 Agent 可调用相关的说明优先留在 `.agent/`、`api/`、`mcp/`、`skills/`、`docs/modules/`
- 不要让单一 surface 目录变成整个项目的垃圾场

---

## 3. 非 Starter 二开原则

- feature：保持宿主可装配性
- capability：保持 install plan、env 契约和 Agent 接口影响面显式
- provider：保持 credential 与 adapter 契约显式
- surface：保持 slot 与宿主挂载边界显式

---

## 4. 什么时候应该做 Derived

满足以下任一条件时，应优先做新的 `derived` 模板，而不是继续污染 `base`：

- 需要明确业务或行业场景
- 需要明确厂商绑定
- 需要默认带上某些能力组合
- 需要明显不同于官方标准示范的交付形态

---

## 5. 什么时候不该动 Core

以下变化通常不应直接进入 `core`：

- 具体产品路由
- 默认业务模块
- 单厂商 SDK 强绑定
- 隐式依赖某个宿主 starter
- 不可逆 install 行为

一句话：

**Core 负责定义控制面，Base 负责定义标准做法，Derived 才负责定义具体产品。**
