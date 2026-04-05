# Rendo Template Manifest 规范

## 目标

模板 manifest 必须让 CLI、人类和强 Agent 用统一方式理解模板资产。

## 最小字段

当前模板 manifest 最小字段如下：

- `id`
- `name`
- `version`
- `type`
- `templateKind`
- `templateRole`
- `category`
- `title`
- `description`
- `uiMode`
- `domainTags`
- `scenarioTags`
- `runtimeModes`
- `defaultProviders`
- `recommendedPacks`
- `requiredEnv`
- `toolchains`
- `lineage`
- `surfaceCapabilities`
- `defaultSurfaces`
- `surfacePaths`
- `supports`

## 关键语义

### `type`

当前统一固定为：

- `template`

### `templateKind`

当前支持：

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

### `templateRole`

当前支持：

- `core`
- `base`
- `derived`

### `lineage`

当前最小结构：

- `coreTemplate`
- `baseTemplate`

含义：

- `coreTemplate` 指向其继承的 core 模板
- `baseTemplate` 指向其继承的 base 模板

## 设计要求

manifest 必须：

- 机器可校验
- 对 Agent 可读
- 能明确表达模板分层与模板类型
- 能支撑 `search / inspect / init / create / add / pull`

