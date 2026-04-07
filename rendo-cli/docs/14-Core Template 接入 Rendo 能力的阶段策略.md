# Core Template 接入 Rendo 能力的阶段策略

## 结论

所有 `core` 模板都应该从第一天就做到：

- `Rendo-ready`

但不应该从第一天就做到：

- `Rendo-dependent`

## 实施原则

1. 先定义接口和文件契约
2. 优先使用本地 mock、显式 manifest、本地 adapter
3. 只有在验证模型成立所必需时，才接真实平台能力

## 边界

`core` 模板不应因为没有真实平台 key 就无法被理解、初始化或做最小健康校验。

