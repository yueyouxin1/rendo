# Phase 3 - 第一个生产可演进服务基座 Starter TODO

> 文件名保留历史名字，但当前语义已收敛为：把 `application-base-starter` 做成第一套真正符合 Rendo 标准的官方服务基座 base，而不是优先做承载 Rendo runtime 的 derived SaaS。

## 目标

做出一个从 `starter-core-template` 继承、并把首日架构标准真正落地的高质量 starter base。

这个 starter 不只是 demo，而是要成为：

- 第一套官方生产可演进服务基座 base
- 后续 feature / capability / provider / surface 的标准宿主
- 第一套默认就面向 Agent 设计的服务基座起点

## 当前状态

- [x] 已有 `application-base-starter`
- [x] 已支持 `web / miniapp / mobile` 的最小 surface 选择
- [x] 当前 application base starter 可运行
- [x] 当前 application base starter 已证明 base starter 可以多 surface

## 第一顺位仍需完成

- [x] 让 `application-base-starter` 完整落地首日标准目录
- [x] 让 starter 默认具备 `AGENTS.md / CLAUDE.md / .agents / interfaces` 宿主结构
- [x] 让 starter 默认具备 `src/` 内的职责分层
- [x] 让 starter 默认具备 `src/apps / src/packages / src/features / src/capabilities / src/providers / src/surfaces` 的标准挂载点（含保留槽位 `src/surfaces/desktop`）
- [x] 让 starter 默认具备 TDD 导向测试骨架与 smoke 校验
- [x] 让 starter 默认具备 `scripts / integration / ops`
- [x] 让 starter 以主流最佳实践方式提供第一套 `interfaces/openapi / interfaces/mcp / interfaces/skills` 接线示例

## 第二顺位仍需完成

- [x] 明确 application base starter 的正式场景与边界
- [x] 明确 web-first、multi-surface-by-request 的实现边界
- [x] 通过 `ops/docker/` 提供开箱即用容器化启动方案
- [x] 补齐 Agent 说明、操作说明和运维说明
- [x] 给 capability / provider / surface 安装提供标准宿主落点

## 明确不属于本阶段第一顺位的事项

以下内容可以后移：

- 承载 Rendo headless runtime
- 模板发布后台后端逻辑
- 认证、计费、完整控制台
- Rendo 自己的狗粮业务逻辑

## 完成标准

- [x] `application-base-starter` 可以被直接视为“第一套官方服务基座 base”
- [x] 强 Agent 读取 starter 后，不需要猜测核心能力、接口面和宿主扩展点的位置
- [x] 后续 capability / provider / surface 模板都能自然落到这套 starter 结构中
- [x] CLI `create / inspect / doctor` 输出能直接证明该 starter 对齐 `src/*` 槽位与 `integration/` 入口规范
- [x] 这套 starter 的结构不依赖某个框架特有目录才能成立
