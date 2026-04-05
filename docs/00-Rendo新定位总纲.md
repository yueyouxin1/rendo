# Rendo 新定位总纲

## 目标

Rendo 现在要先做成一套可被强 Agent 理解、操作、扩展的模板资产系统，而不是先做平台产品。

当前正确主干是：

- `core`
- `base`
- `derived`

这条主干适用于所有一等模板类型，而不是只服务 `starter`。

## 一等模板类型

当前首批一等模板类型是：

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

这些都是真正的模板资产，不是某个 starter 的附属插件。

## 正确分层

### 1. `core`

`core` 是模板类型级别的最小契约层。

它负责：

- manifest 规则
- CLI 语义
- runtime mode 约束
- install / pull / upgrade / doctor 的统一理解方式
- agent 可读、可操作的最小文件结构

### 2. `base`

`base` 是每一种模板类型的官方标准示范层。

它负责：

- 给出该类型模板的 canonical best practice
- 提供后续 derived 模板可稳定继承的起点

### 3. `derived`

`derived` 是从某个 `base` 长出来的具体模板。

它负责：

- 承载具体产品形态
- 承载具体厂商绑定
- 承载具体场景差异

## 当前实施原则

1. 先把 `core` 和 `base` 做扎实，再放大 `derived`
2. `rendo cli` 必须直接服务这条主干
3. 不允许再把“唯一 Core Starter”当成整个系统的唯一底座描述
4. `starter` 仍然重要，但它只是第一类模板，不再是唯一模板中心

## 当前默认路径

当前默认实现路径是：

1. 完成五类 `core` 模板
2. 完成 `rendo init <kind>`
3. 完成五类官方 `base` 模板
4. 让 `starter-template` 先成为第一个可运行消费入口
5. 再逐步引入 `derived` 和更强的能力生命周期

## 非目标

现在不做：

- 平台 UI
- 模板 marketplace
- 企业管理面
- 全量 SaaS 能力
- 大而全的一体化 starter

