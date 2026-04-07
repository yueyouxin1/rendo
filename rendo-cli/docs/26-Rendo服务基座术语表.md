# Rendo 服务基座术语表

## 面向智能体的服务

以 Agent 为核心消费者设计的服务。

它的接口、行为和可发现性面向 Agent，而不是只面向人类点击界面。

## 服务基座

一个可演进、可部署、可被 Agent 理解和调用的工程起点。

在当前仓库里，服务基座通过模板体系来表达和生成。

## Template

任何被结构化描述、可复用、可被强 Agent 理解的服务基座模板资产。

## Template Kind

模板类型。

当前固定五类：

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

## Template Role

模板角色。

当前固定三层：

- `core`
- `base`
- `derived`

## Starter Template

服务基座根模板。

它负责创建可运行项目，是 `rendo create` 的目标模板种类。

## Feature / Capability / Provider / Surface Template

围绕服务基座装配的服务单元模板。

它们通常通过 `add / pull / upgrade` 进入宿主 starter。

## Core Template

模板类型级别的最小控制面契约。

## Base Template

某一模板类型的官方标准实现。

## Derived Template

从某个 base 继续长出的具体模板。

## Agent Callability

模板或服务基座被 Agent 发现、理解、调用、扩展的能力。

在当前规范层主要通过 `AGENTS.md`、`.agents/`、`interfaces/*` 和安装/文档契约来表达。

## Agent Entry Points

供 CLI 和强 Agent 快速定位模板控制面的固定入口。

当前标准包括：

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/skills/*/SKILL.md`
- `.agents/review-checklist.md`
- `interfaces/openapi/`
- `interfaces/mcp/`
- `interfaces/skills/`

## Formal Template Artifacts

Rendo 内部分发资产层。

当前目录是：

- `shared/templates`

它是 registry 和 CLI 实际消费的模板资产层。

## Authoring Source

模板作者侧源目录。

当前目录是：

- `shared/authoring/templates`

它不是 CLI 的直接运行时消费层。

## Template Asset

被 `add / pull / upgrade` 消费的非 starter 模板。

## Pack

仍保留的安装型资产语义，但不是模板分层的替代物。

当前阶段官方最小生命周期优先落在 template asset 上，pack 作为并行兼容语义存在。

## Registry

用于发布、搜索、检查和下载模板的索引与制品入口。

## Registry Provider

CLI 连接 registry 的方式。

当前支持：

- `local`
- `remote`

## Bundle

远程下载制品。

当前冻结格式：

- `rendo-bundle.v1`

## Bundle Digest

对原始 bundle 原文做的 `sha256` 校验值。

## Template Digest

对模板展开后文件列表和文件 digest 计算出的 `sha256` 校验值。

## Runtime Shape

模板的运行等级语义。

当前规范层固定两类：

- `standalone-runnable`
- `host-attached`

## Asset Install Plan

结构化的模板安装计划。

它回答：

- 加什么文件
- 更新什么文件
- 加什么 env
- 是否需要人工处理
- 是否会影响宿主中的 Agent 入口与接口描述面

## Runtime Mode

模板运行模式。

当前支持：

- `source`
- `managed`
- `hybrid`

## 种子工程

可作为市场或叙事表达使用，强调“真实项目沉淀 + 人类验证”的工程起点。

但在当前规范层：

- 不把“种子工程”作为 manifest 或 CLI 的正式字段名
- 统一以“服务基座”作为规范术语
