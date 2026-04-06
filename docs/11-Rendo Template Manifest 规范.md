# Rendo Template Manifest 规范

## 目标

模板 manifest 必须让 CLI、人类和强 Agent 用统一方式理解模板资产。

## 最小字段

当前模板 manifest 最小字段如下：

- `schemaVersion`
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
- `documentation`
- `surfaceCapabilities`
- `defaultSurfaces`
- `surfacePaths`
- `supports`
- `compatibility`
- `assetInstall`

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

### `documentation`

当前最小结构：

- `overview`
- `structure`
- `extensionPoints`
- `inheritanceBoundaries`
- `secondaryDevelopment`

含义：

- 让 manifest 直接告诉人类和 Agent 应先读哪些文件
- 让 `inspect` 输出可以直接暴露正确文档入口
- 避免强 Agent 需要先穷举目录再猜测规范文件

## 设计要求

manifest 必须：

- 机器可校验
- 对 Agent 可读
- 能明确表达模板分层与模板类型
- 能直接暴露文档入口与二次开发入口
- 能支撑 `search / inspect / init / create / add / pull`
- 能表达 CLI / registry / host compatibility
- 能表达非 starter 模板的 install plan 元数据
