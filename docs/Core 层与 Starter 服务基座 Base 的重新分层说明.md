# Core 层与 Starter 服务基座 Base 的重新分层说明

> 本文件内容已更新为服务基座新架构下的 starter 分层说明。

## 结论

新的 starter 相关分层应理解为：

- `starter-core-template`
- `application-base-starter`
- 未来各种 derived starter

## 为什么要改

因为 starter 已不再是系统里唯一的一等模板类型。

如果继续把 `Core Starter` 当成唯一底座，会让：

- CLI 语义继续偏向 starter
- 其他模板类型难以获得自然的 core / base / derived 主干

## 当前正确理解

### `starter-core-template`

负责：

- starter 类型的最小控制面
- starter 类型的最小文件契约

### `application-base-starter`

负责：

- starter 类型的官方标准示范层
- 第一个可运行的 starter best practice
- 第一个标准服务基座宿主

### derived starter

负责：

- 具体业务场景
- 具体技术绑定
- 具体形态策略
