# Phase 1 - Core 模板层实现 TODO

## 目标

让每一种一等模板类型都有最小、稳定、agent 友好的 `core` 模板。

## 当前状态

- [x] 已建立 `starter-core-template`
- [x] 已建立 `feature-core-template`
- [x] 已建立 `capability-core-template`
- [x] 已建立 `provider-core-template`
- [x] 已建立 `surface-core-template`
- [x] 五类 core 模板都已进入本地 registry
- [x] `rendo init <kind>` 已能初始化对应 core 模板
- [x] 五类 core 模板均可通过最小 health check 验证

## 仍需完成

- [x] 统一五类 core 模板的共享骨架生成方式，减少手工漂移
- [x] 为每类 core 模板补齐更明确的 extension point 文档
- [x] 明确每类 core 模板允许继承和禁止继承的边界
- [x] 为 core 模板增加版本升级与兼容性说明
- [x] 增加对 core 模板结构漂移的自动校验

## 完成标准

- [x] 任何一个官方 base 模板都能明确指出自己继承自哪个 core 模板
- [x] 任何一个官方/社区 derived 模板都能明确指出自己继承自哪个 base 模板
- [x] 新增一个模板类型时，可以复用现有 core 模板设计方法
- [x] core 模板不含具体业务和具体厂商绑定
