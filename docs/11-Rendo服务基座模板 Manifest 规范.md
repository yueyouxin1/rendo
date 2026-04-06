# Rendo 服务基座模板 Manifest 规范

## 目标

模板 manifest 必须让 CLI、人类和强 Agent 用统一方式理解：

- 这是哪一类服务基座模板
- 它属于 `core / base / derived` 哪一层
- 它是服务基座根模板，还是可装配服务单元
- 它暴露或扩展哪些 Agent 可调用入口
- 它如何被创建、宿主、安装、升级和校验

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
- `agentArtifacts`
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

补充理解：

- `starter-template` 默认对应服务基座根模板
- 其他四类默认对应可装配服务单元模板

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
- `moduleDocs`

含义：

- 让 manifest 直接告诉人类和 Agent 应先读哪些文件
- 让 `inspect` 输出可以直接暴露正确文档入口
- 避免强 Agent 需要先穷举目录再猜测规范文件

### `agentArtifacts`

当前最小结构建议包含：

- `instructions`
- `capabilities`
- `reviewChecklist`
- `openapi`
- `mcp`
- `skills`

含义：

- 显式暴露 `.agent` / `api` / `mcp` / `skills` 的入口文件
- 让 CLI 和 Agent 能直接定位服务基座的可调用面
- 对于非 starter 模板，可以指向自身片段或指向其宿主扩展点说明

### `supports`

这里应表达该模板提供或扩展的接口能力，例如：

- `mcp`
- `skill`
- `openapi`
- `a2ui`

`supports` 关心的是：

- 模板最终要让宿主或自身具备什么 Agent 可调用能力

### `compatibility`

除 CLI / registry / host 兼容性之外，还应明确：

- 该模板面向哪些宿主基础版本
- 需要哪些接口或目录扩展点
- 是否依赖宿主已存在的 `api` / `mcp` / `skills` 结构

## 设计要求

manifest 必须：

- 机器可校验
- 对 Agent 可读
- 能明确表达模板分层与模板类型
- 能明确表达根模板与装配模板的消费关系
- 能直接暴露文档入口、Agent 入口与二次开发入口
- 能支撑 `search / inspect / init / create / add / pull`
- 能表达 CLI / registry / host compatibility
- 能表达非 starter 模板的 install plan 元数据
