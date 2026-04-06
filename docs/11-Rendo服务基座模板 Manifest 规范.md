# Rendo 服务基座模板 Manifest 规范

## 目标

模板 manifest 必须让 CLI、人类和强 Agent 用统一方式理解：

- 这是哪一类服务基座模板
- 它属于 `core / base / derived` 哪一层
- 它是服务基座根模板，还是可装配服务单元
- 它如何被创建、宿主、安装、升级和校验
- 它的正式模板产物路径与兼容边界是什么

## 当前最小字段

当前实现中的模板 manifest 最小字段如下：

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

含义：

- 让 manifest 直接告诉人类和 Agent 应先读哪些文件
- 让 `inspect` 输出可以直接暴露正确文档入口
- 避免强 Agent 需要先穷举目录再猜测规范文件

### `runtimeModes`

这里表达的是：

- `source`
- `managed`
- `hybrid`

的运行模式语义。

注意：

- `runtimeModes` 不是 `standalone-runnable / host-attached` 的替代字段
- 当前“运行等级”主要由目录标准和文档语义冻结，后续可再增强为 manifest 显式字段

### `compatibility`

除 CLI / registry / host 兼容性之外，还应明确：

- 该模板面向哪些宿主基础版本
- 需要哪些接口或目录扩展点
- 是否依赖宿主已存在的 `interfaces/openapi` / `interfaces/mcp` / `interfaces/skills` 结构

### `assetInstall`

这里表达的是：

- 支持哪些宿主模板
- 以什么模式安装
- 安装会影响哪些文件和配置

它是非 starter 模板生命周期的核心控制面。

## Agent 入口如何表达

当前实现中的 manifest 还没有把全部 Agent 入口做成单独必填字段。

因此现阶段应这样理解：

- `documentation` 提供文档入口
- 固定目录契约提供 `AGENTS.md`、`CLAUDE.md`、`.agents/`、`interfaces/*` 的稳定位置
- `assetInstall` 说明非 starter 模板对这些入口的影响

后续可以继续增强为更强的显式 Agent 元数据，但当前最小 schema 先以以上三者配合成立。

## 设计要求

manifest 必须：

- 机器可校验
- 对 Agent 可读
- 能明确表达模板分层与模板类型
- 能明确表达根模板与装配模板的消费关系
- 能直接暴露文档入口与二次开发入口
- 能支撑 `search / inspect / init / create / add / pull`
- 能表达 CLI / registry / host compatibility
- 能表达非 starter 模板的 install plan 元数据
