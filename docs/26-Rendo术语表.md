# Rendo 术语表

## Template

任何被结构化描述、可复用、可被强 Agent 理解的模板资产。

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

## Core Template

模板类型级别的最小控制面契约。

## Base Template

某一模板类型的官方标准实现。

## Derived Template

从某个 base 继续长出的具体模板。

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

## Asset Install Plan

结构化的模板安装计划。

它回答：

- 加什么文件
- 更新什么文件
- 加什么 env
- 是否需要人工处理

## Runtime Mode

模板运行模式。

当前支持：

- `source`
- `managed`
- `hybrid`
