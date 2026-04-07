# `rendo init`、`rendo create` 与服务基座创建分工说明

## 结论

新的分工是：

- `rendo init <kind>`：从官方 `core` 源初始化一个 Rendo 可识别工作区
- `rendo create`：从 `starter-template` 的 `base` 或 `derived` 模板创建一个 Rendo 可识别工作区

两者都不应只是“拷贝快照”。

两者都应：

- 初始化 `.rendo/`
- 生成本地唯一工作区 ID
- 记录来源模板与来源角色
- 用 CLI 管理工作区可发布元信息

## 为什么 `init` 不能继续默认围绕单一 `starter-core-template`

因为现在一等模板不止 starter，而且 Rendo 当前的定位也不再是“只围绕 starter 的模板系统”。

如果 `init` 继续默认只围绕单一 `starter-core-template`，会导致：

- CLI 语义仍然偏向 starter
- 其他模板类型失去自然初始化入口
- `core -> base -> derived` 的主干被破坏
- 服务基座模板体系重新退回“单一项目模板中心”

## 为什么 `create` 仍然只服务 starter

因为 `create` 的职责是创建：

- **可运行的服务基座根项目**

目前只有 starter 模板天然承担“项目起点”角色。

feature / capability / provider / surface 更适合通过：

- `add`
- `pull`

被装配进一个 starter 服务基座中。

## 发布语义如何处理

这里必须区分：

1. 本地工作区来源
2. 发布后的模板角色

本地工作区可以来源于：

- `core`
- `base`
- `derived`

但在社区发布时，若该工作区不是官方维护模板，则 Rendo 应自动把其发布角色归一化为：

- `derived`

并保留来源 lineage，例如：

- 来源于 `starter-core-template`
- 来源于 `application-base-starter`
- 来源于某个已有 `derived`

这样用户不用手工思考“我现在是不是 core / base / derived”，
而是由 Rendo 在发布时自动完成最终角色投影。

## 一句话理解

- `init` 负责从官方 `core` 源生成可识别工作区
- `create` 负责从 starter `base / derived` 源生成可识别工作区
- `.rendo/` 负责承载本地工作区身份
- 社区发布时，非官方工作区统一自动投影为 `derived`
