# `rendo init` 与 `rendo create` 的命令分工说明

## 结论

`rendo init` 和 `rendo create` 不能再沿用“唯一 Core Starter vs Domain Starter”的旧分工。

新的分工是：

- `rendo init <kind>`：初始化对应模板类型的 `core` 模板
- `rendo create`：从 `starter-template` 的 `base` 或 `derived` 模板创建具体项目

## 为什么 `init` 不能继续默认创建一个 Core Starter

因为现在一等模板不止 starter。

如果 `init` 继续默认只创建一个 `Core Starter`，会导致：

- CLI 语义仍然偏向 starter
- 其他模板类型失去自然初始化入口
- `core -> base -> derived` 的主干被破坏

## 为什么 `create` 仍然只服务 starter

因为 `create` 的职责是创建可消费项目。

目前只有 starter 模板天然承担“项目起点”角色。

feature / capability / provider / surface 更适合通过：

- `add`
- `pull`

被装配进一个 starter 项目中。

