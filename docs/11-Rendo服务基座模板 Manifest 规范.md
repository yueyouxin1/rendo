# Rendo 服务基座模板 Manifest 规范

## 目标

模板 manifest 必须让 CLI、人类和强 Agent 用统一方式理解：

- 这是哪一类服务基座模板
- 它属于 `core / base / derived` 哪一层
- 它是服务基座根模板，还是可装配服务单元
- 它如何被创建、宿主、集成、升级和校验
- 它的继承、架构与兼容边界是什么

同时还要明确：

- 模板正式产物元信息
- 本地工作区元信息

不是同一层语义。

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
- `architecture`
- `surfaceCapabilities`
- `defaultSurfaces`
- `surfacePaths`
- `supports`
- `compatibility`
- `assetIntegration`

注意：

- 上述字段描述的是模板 manifest 语义
- 推荐位置应为 `.rendo/rendo.template.json`
- `.rendo/rendo.project.json` 不应与模板 manifest 混为一谈

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

这里表达的是：

- 正式模板产物角色

不应直接等同于：

- 本地工作区在开发过程中的唯一状态

### `lineage`

当前最小结构：

- `coreTemplate`
- `baseTemplate`
- `parentTemplate`

含义：

- `coreTemplate` 指向其继承的 core 模板
- `baseTemplate` 指向其继承的 base 模板
- `parentTemplate` 指向当前模板的直接父模板

约束：

- `core` 模板通常为 `null / null / null`
- `base` 模板通常是 `coreTemplate != null`、`baseTemplate = null`、`parentTemplate = 对应 core`
- `derived` 模板允许 `parentTemplate` 指向某个 `base` 或另一个 `derived`

补充理解：

- 本地工作区可以来源于 `core`、`base` 或 `derived`
- 本地非官方工作区在 `init / create / pull` 时就应根据 `.rendo/rendo.project.json` 中的 origin 信息投影为 `derived`
- 社区发布时不应要求用户再次切换角色，只需继续保留该 `derived` 投影并同步来源 lineage

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
- 当前“运行等级”已经通过 `architecture.runtimeClass` 显式表达
- 宿主根 / 宿主附着关系已经通过 `architecture.hostModel` 显式表达

### `compatibility`

除 CLI / registry / host 兼容性之外，还应明确：

- 该模板面向哪些宿主基础版本
- 需要哪些接口或目录扩展点
- 是否依赖宿主已存在的 `interfaces/openapi` / `interfaces/mcp` / `interfaces/skills` 结构

### `assetIntegration`

这里表达的是：

- 支持哪些宿主模板
- 以什么模式集成
- 集成会影响哪些文件和配置
- `assetIntegration.modes[].targetRoot` 机器可读地定义物理集成根目录

它是非 starter 模板生命周期的核心控制面。

补充边界：

- `assetIntegration` 是机器可读合同
- 历史模板内 `install/` 接入说明语义统一更名为 `integration/`
- `integration/` 是人类与 Agent 可读的接入说明和宿主影响说明
- `integration/` 不参与物理安装根决策

### Runtime 前的字段边界

在进入真实 runtime、持久化 registry 和官方远程发布链路之前，manifest 的强契约应优先依赖代码层可确定的数据：

- 模板身份、层级和继承关系
- 架构与目录语义
- runtime / compatibility / surface / env / toolchain
- `assetIntegration`

而以下信息虽然有价值，但当前不应成为 CLI 或 runtime 正确性的前置依赖：

- 面向发布的扩展说明性文案
- 更细粒度的技术栈解读
- richer 场景标签或发布说明

这些信息后续可以由强 Agent 在发布前 enrich。

### Runtime 前的派生制品边界

当前阶段不再拆第二份“发布 manifest”。

正确关系是：

- `rendo.template.json` 仍是模板作者声明的 canonical manifest
- `rendo bundle` 是由正式模板产物导出的传输制品
- `templates.snapshot.json` 是从 manifest 和 bundle 中提取出来的 runtime-pre deterministic catalog

因此：

- manifest 仍保留 `title`、`description` 等对人类有价值的字段
- runtime-pre snapshot 只保留 runtime / CLI / registry 需要稳定消费的确定性字段和制品 digest
- richer 发布说明可在后续由强 Agent enrich，但不反向改写当前强契约

## `.rendo/` 工作区命名空间

推荐的本地工作区命名空间为：

```txt
.rendo/
├── rendo.project.json
└── rendo.template.json
```

建议职责：

### `.rendo/rendo.project.json`

负责本地工作区状态，例如：

- workspace id
- 本地项目名
- origin template
- origin role
- selected surfaces
- installed assets

### `.rendo/rendo.template.json`

负责 CLI 管理的模板发布投影，例如：

- template kind
- publishable title / description
- lineage
- architecture
- compatibility
- assetIntegration

用户不应被要求手工维护这两份文件；
CLI 应负责：

- 初始化
- 校验
- 默认值补齐
- 发布前归一化

## Agent 入口如何表达

当前实现中的 manifest 还没有把全部 Agent 入口做成单独必填字段。

因此现阶段应这样理解：

- `documentation` 提供文档入口
- 固定目录契约提供 `AGENTS.md`、`CLAUDE.md`、`.agents/`、`interfaces/*` 的稳定位置
- `assetIntegration` 说明非 starter 模板对这些入口的机器可读影响
- `integration/` 说明非 starter 模板对宿主的可读接入与变更影响

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
- 能表达非 starter 模板的 integration metadata 与 `assetIntegration.modes[].targetRoot` 目标根
- 能与 `.rendo/rendo.project.json` 一起支撑“来源 lineage”和“发布角色投影”分离
