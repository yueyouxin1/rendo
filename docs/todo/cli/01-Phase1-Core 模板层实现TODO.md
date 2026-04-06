# Phase 1 - Core 模板层实现 TODO

## 目标

让每一种一等模板类型都有最小、稳定、agent 友好的 `core` 模板，
并且它们共同服从“首日服务基座架构与目录标准”。

## 当前状态

- [x] 已建立 `starter-core-template`
- [x] 已建立 `feature-core-template`
- [x] 已建立 `capability-core-template`
- [x] 已建立 `provider-core-template`
- [x] 已建立 `surface-core-template`
- [x] 五类 core 模板都已进入本地 registry
- [x] `rendo init <kind>` 已能初始化对应 core 模板
- [x] 五类 core 模板均可通过最小 health check 或结构验证入口验证

## 第一顺位仍需完成

- [ ] 五类 core 模板统一采用同一套语言无关目录语义
- [ ] 五类 core 模板统一提供 `AGENTS.md / CLAUDE.md / .agents / docs / interfaces / src / tests / scripts / install`
- [ ] `starter-core-template` 统一提供宿主挂载位与 `ops/`
- [ ] `starter-core-template` 提供最小 `interfaces/openapi/`、`interfaces/mcp/`、`interfaces/skills/`
- [ ] 非 starter core 模板明确宿主扩展位，而不是只给散乱模板片段
- [ ] 五类 core 模板都提供 TDD 导向的测试骨架与 fixtures
- [ ] 五类 core 模板都提供清晰的 extension points / inheritance boundaries / install docs

## 第二顺位仍需完成

- [x] 统一五类 core 模板的共享骨架生成方式，减少手工漂移
- [x] 为每类 core 模板补齐更明确的 extension point 文档
- [x] 明确每类 core 模板允许继承和禁止继承的边界
- [x] 为 core 模板增加版本升级与兼容性说明
- [x] 增加对 core 模板结构漂移的自动校验
- [ ] 增加对 Agent 入口与接口描述面存在性的自动校验
- [ ] 明确 `shared/authoring/templates/core/common/skeleton` 与 `shared/templates/core/*` 的同步和唯一编辑入口规则

## 完成标准

- [ ] 任何一个官方 base 模板都继承同一套 core 目录语义，而不是各自定义结构
- [ ] 任何一个官方/社区 derived 模板都不能绕开 core 冻结的标准接口面
- [ ] 新增一个模板类型时，可以复用现有 core 模板设计方法
- [ ] core 模板不含具体业务和具体厂商绑定
- [ ] 强 Agent 可以仅凭 core 模板就判断“能力定义在哪、接口定义在哪、测试入口在哪、它属于哪种运行等级”
