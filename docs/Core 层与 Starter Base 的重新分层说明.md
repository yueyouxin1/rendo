# Core 层与 Starter Base 的重新分层说明

> 本文件保留原路径名，但内容已更新为新架构。

## 结论

不再使用“唯一 Core Starter -> Domain Starter”的旧分层。

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

### derived starter

负责：

- 具体业务场景
- 具体技术绑定
- 具体形态策略

