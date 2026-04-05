# Rendo Managed、Source、Hybrid 运行模式定义

## 目标

运行模式要成为模板资产的统一属性，而不是只服务某一个 starter。

## 三种模式

### `source`

含义：

- 主要依赖本地源码、本地配置和本地运行时

### `managed`

含义：

- 主要依赖托管能力、托管资源或平台侧运行时

### `hybrid`

含义：

- 本地源码与托管能力共同承担运行

## 使用方式

运行模式由模板 manifest 的 `runtimeModes` 声明。

`core` 模板应先声明其可支持范围，`base` 与 `derived` 再按需要继承或收缩。

## 当前实践

- `starter-core-template`：`source / managed / hybrid`
- `feature-core-template`：`source / hybrid`
- `capability-core-template`：`source / managed / hybrid`
- `provider-core-template`：`source / hybrid`
- `surface-core-template`：`source / hybrid`

