# 最小轻量化模板策略与多模板主干

## 结论

Rendo 现在不再采用“唯一 Core Starter + 其他附属模板”的结构。

当前正确结构是：

- 多种一等模板类型
- 统一的 `core -> base -> derived` 主干

## 轻量化要求

轻量化不意味着只保留一个 starter 底座。

轻量化真正意味着：

- 每个 `core` 模板都足够小
- 每个 `base` 模板都只补该类型最必要的 best practice
- 复杂场景继续上移到 `derived`

## 当前实践

当前已实现：

- 五类 core 模板
- 五类 base 模板
- `rendo init <kind>`
- starter 的 `rendo create`

