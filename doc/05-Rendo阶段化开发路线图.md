# Rendo 阶段化开发路线图

- 文档版本：v1.0
- 日期：2026-04-04
- 文档性质：可执行开发路线文档
- 目标：定义从 `Core Starter` 到 `Rendo 平台闭环` 的阶段化开发顺序，明确每个阶段做什么、为什么做、交付什么

---

## 1. 总原则

Rendo 的开发顺序不能再沿用“先做平台、再填内容”的老思路。  
正确顺序是：

1. 先定义统一底座
2. 再做第一个可交付的高质量 starter
3. 再围绕 starter 建立自然扩展机制
4. 最后从 starter 和 pack 的真实使用中长出平台闭环

一句话：

**先契约，后 starter；先资产，后平台。**

---

## 2. 阶段总览

Rendo 的开发分成七个阶段：

1. `Phase 0`：契约与底座定义
2. `Phase 1`：`Core Starter` 落地
3. `Phase 2`：`Rendo CLI` 成为一级入口
4. `Phase 3`：第一个 `Starter Template` 落地
5. `Phase 4`：`Capability Template` 机制落地
6. `Phase 5`：最小真实 Rendo 能力接入
7. `Phase 6`：平台闭环能力落地

---

## 3. Phase 0：契约与底座定义

### 目标

在任何 starter 和 pack 实现之前，先定义最小统一契约。

### 本阶段要做什么

- 定义 `Core Starter` 契约
- 定义 `Starter Template` 分类
- 定义 `Template Manifest`
- 定义 `Capability Template Manifest`
- 定义 `Managed / Source / Hybrid`
- 定义 `Rendo CLI` 最小协议
- 定义 `Capability Template install plan`

### 为什么先做

如果没有这一步，后续 starter 会自由生长，最终无法统一升级、安装 pack 和被 Agent 自然理解。

### 本阶段交付物

- 契约文档完整成套
- CLI 协议草案
- starter / pack / runtime mode 的统一术语

---

## 4. Phase 1：Core Starter 落地

### 目标

做出唯一的基础底座 starter，但不绑定任何具体业务形态。

### 本阶段要做什么

- 建立 monorepo 基础结构
- 建立 shared packages
- 建立 docker / devcontainer 入口
- 建立 `rendo.template.json`
- 建立 agent instruction surfaces
- 建立 `rendo create` 的最小可用版本

### 为什么重要

`Core Starter` 是后续所有模板共享的工程语言。

### 本阶段交付物

- 一个可初始化的 `Core Starter`
- 最小 CLI
- 最小 Docker 工作区

---

## 5. Phase 2：`Rendo CLI` 成为一级入口

### 目标

让 starter、pack、provider 的默认最优解通过统一 CLI 落地。

### 本阶段要做什么

- 实现 `rendo create`
- 实现 `rendo inspect`
- 实现 `rendo doctor`
- 支持交互式与非交互式调用
- 让强 Agent 能自然调用 CLI

### 为什么重要

CLI 是：

- starter 的入口
- pack 的入口
- Agent 的入口
- 本地工作区的最小控制面

### 本阶段交付物

- 最小但可用的 `rendo cli`
- 可被人类和强 Agent 调用的统一入口

---

## 6. Phase 3：第一个 `Starter Template` 落地

### 目标

基于 `Core Starter` 做出第一个真正可交付的 starter。

### 当前建议

第一版优先：

- `web / ai-webapp / saas` 方向中的一个高价值 starter

### 本阶段要做什么

- 确定 vertical 场景
- 选择 base starter
- 填入默认 UI / Auth / Billing / DB / KB / Agent / Workflow 骨架
- 提供轻量后台
- 提供 Docker-first 运行环境

### 为什么重要

这是 Rendo 的第一个真实资产，也是后续所有模板的现实参照物。

### 本阶段交付物

- 一个高质量可运行的 `Starter Template`
- 可被强 Agent 继续开发
- 可被用户直接启动

---

## 7. Phase 4：`Capability Template` 机制落地

### 目标

把“能力按需安装”从概念变成可执行机制。

### 本阶段要做什么

- 实现 pack manifest 解析
- 实现 `search / inspect / add / pull / upgrade`
- 实现 install plan 可视化
- 设计官方 pack 与社区 pack 边界
- 设计 source / managed / hybrid pack 的安装规则

### 为什么重要

如果没有 pack 机制，starter 要么会太重，要么会太空。

### 本阶段交付物

- 最小 Pack Registry 协议
- 最小 CLI pack 工作流
- 1 到 3 个官方 pack 样例

---

## 8. Phase 5：最小真实 Rendo 能力接入

### 目标

让 starter 从 `Rendo-ready` 逐步变成 `Rendo-backed`，但不提前进入完整平台建设。

### 本阶段要做什么

- 接入 `Rendo API Key`
- 接入最小官方 registry
- 接入最小官方 managed pack
- 接入最小默认 provider

### 为什么重要

这一步决定：

- 默认最优解是否真实成立
- managed/source/hybrid 是否接受真实验证

### 本阶段交付物

- 最小真实后端能力接入
- starter 可使用官方托底能力

---

## 9. Phase 6：平台闭环能力落地

### 目标

从 starter 和 pack 的真实使用需求中，长出最小平台闭环。

### 本阶段要做什么

- 模板发现
- 模板详情
- 模板预览
- 下载 / 拉取
- 模板版本与升级提示
- 授权与购买
- 官方 pack 发现与安装
- 企业私有模板 / pack 管理

### 为什么最后做

这些能力都属于：

- starter / pack 的分发和治理层

它们必须建立在：

- 已经存在的 starter
- 已经存在的 pack

基础上才有意义。

### 本阶段交付物

- Rendo 平台闭环的最小可用产品面

---

## 10. 当前阶段应该停留在哪里

从当前讨论的成熟度看，Rendo 最合理的现实位置应是：

- `Phase 0` 已基本完成概念定义
- 应立即进入 `Phase 1`、`Phase 2` 和 `Phase 3`

也就是说：

**当前最重要的不是继续抽象平台，而是把 `Core Starter`、`rendo cli` 和第一个 `Starter Template` 做出来。**

---

## 11. 最终结论

Rendo 的开发路线，不能再遵循平台产品惯性，而应遵循资产优先和契约优先。

一句话结论：

**先把 `Core Starter`、`Rendo CLI`、`Starter Template` 和 `Capability Template` 做成，再逐步接入真实 Rendo 能力，最后才让平台闭环从它们的真实使用中长出来。**
