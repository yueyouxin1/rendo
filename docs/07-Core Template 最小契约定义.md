# Core Template 最小契约定义

## 1. 角色

`core` 模板不是最终模板，也不是产品模板。

它的职责是：

- 为某个模板类型定义最小控制面
- 提供稳定、轻量、agent 可读的文件结构
- 为 `base` 模板提供明确继承点

## 2. 适用范围

当前每个一等模板类型都应有自己的 `core` 模板：

- starter
- feature
- capability
- provider
- surface

## 3. 必须包含

每个 `core` 模板至少应包含：

- `rendo.template.json`
- `rendo.project.json`
- `README.md`
- `AGENTS.md`
- `docs/structure.md`
- `docs/extension-points.md`
- 一个最小可执行或可校验的健康检查入口

## 4. 必须满足

`core` 模板必须：

- 最小
- 稳定
- 中立
- 不提前绑定具体业务
- 不提前绑定具体厂商
- 不把平台依赖做成硬前置

## 5. 明确不包含

`core` 模板不应默认包含：

- 具体产品 UI
- 具体业务模块
- 单一厂商 SDK 绑定
- 不可替换的真实平台依赖

## 6. 与 Base 的关系

`base` 模板必须显式声明它来自哪个 `core` 模板：

- `lineage.coreTemplate`

`base` 负责把该类型模板的最佳实践补齐，但不应破坏 core 层控制面。

