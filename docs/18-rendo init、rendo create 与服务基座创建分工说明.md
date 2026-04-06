# `rendo init`、`rendo create` 与服务基座创建分工说明

## 结论

新的分工是：

- `rendo init <kind>`：初始化对应模板类型的 `core` 模板
- `rendo create`：从 `starter-template` 的 `base` 或 `derived` 模板创建具体服务基座项目

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

## 一句话理解

- `init` 负责创建模板契约工作区
- `create` 负责创建服务基座项目实例
