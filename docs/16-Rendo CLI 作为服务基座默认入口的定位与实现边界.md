# Rendo CLI 作为服务基座默认入口的定位与实现边界

## 结论

`rendo cli` 应作为独立工具存在，但必须严格遵循模板契约。

它不属于某个具体 `core` 模板内部脚本。

## 为什么

因为 CLI 面向的是整套服务基座模板系统：

- core
- base
- derived
- pack
- registry

而不是只面向 starter。

## 当前边界

- CLI 负责命令语义和模板消费入口
- 模板负责 manifest、文件结构、Agent 入口和分层语义
