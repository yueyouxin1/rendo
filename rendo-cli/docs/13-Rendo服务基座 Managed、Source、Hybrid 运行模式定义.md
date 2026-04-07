# Rendo 服务基座 Managed、Source、Hybrid 运行模式定义

## 目标

运行模式要成为服务基座模板的统一属性，而不是只服务某一个 starter。

它既适用于服务基座根模板，也适用于围绕基座装配的服务单元模板。

## 三种模式

### `source`

含义：

- 主要依赖本地源码、本地配置和本地运行时
- Agent 可调用层主要由项目自身代码暴露

### `managed`

含义：

- 主要依赖托管能力、托管资源或平台侧运行时
- 项目本地更多承担接入、配置和权限边界

### `hybrid`

含义：

- 本地源码与托管能力共同承担运行
- 本地和托管侧一起构成最终的 Agent 可调用服务

## 使用方式

运行模式由模板 manifest 的 `runtimeModes` 声明。

`core` 模板应先声明其可支持范围，`base` 与 `derived` 再按需要继承或收缩。

## 服务基座视角下的判断原则

- 如果一个 starter 创建后即可主要依靠本地服务对外暴露能力，应优先视为 `source`
- 如果一个模板的核心能力主要来自托管资源或官方平台，应允许声明 `managed`
- 如果宿主必须同时保留本地代码和托管资源，才使用 `hybrid`

## 当前实践

- `starter-core-template`：`source / managed / hybrid`
- `feature-core-template`：`source / hybrid`
- `capability-core-template`：`source / managed / hybrid`
- `provider-core-template`：`source / hybrid`
- `surface-core-template`：`source / hybrid`
