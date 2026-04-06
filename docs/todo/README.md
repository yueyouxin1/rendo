# TODO 索引

## 使用方式

`docs/todo` 现在按两条主线组织：

- `cli/`
  - 模板契约、首日架构标准、authoring/产物分层、core/base/derived、CLI、模板资产生命周期
- `rendo-platform/`
  - headless Rendo runtime、持久化存储、远程发布与狗粮验证

当前必须先完成的不是平台线，而是：

- **把“面向 Agent 的服务基座”首日架构与目录标准真正冻结并落实到 `core -> base -> derived`**

这些文件不再代表旧的“唯一 Core Starter 路线”。
即使文件名保留了旧阶段编号，也应按当前正式架构理解：

- `core -> base -> derived`
- `starter / feature / capability / provider / surface`
- `首日架构标准 -> core/base/derived -> CLI -> template asset lifecycle` 是当前主线
- `rendo-platform/` 目录代表后续阶段，不应挤占当前第一顺位

## 阅读顺序

1. [29-Rendo服务基座首日架构与目录标准.md](/D:/code/rendo/docs/29-Rendo服务基座首日架构与目录标准.md)
2. [V1-发布门槛清单与交付成功定义.md](/D:/code/rendo/docs/todo/V1-发布门槛清单与交付成功定义.md)
3. [cli/00-Phase0-契约与规范TODO.md](/D:/code/rendo/docs/todo/cli/00-Phase0-契约与规范TODO.md)
4. [cli/01-Phase1-Core 模板层实现TODO.md](/D:/code/rendo/docs/todo/cli/01-Phase1-Core 模板层实现TODO.md)
5. [cli/02-Phase2-RendoCLI实现TODO.md](/D:/code/rendo/docs/todo/cli/02-Phase2-RendoCLI实现TODO.md)
6. [cli/03-Phase3-第一个SaasStarter实现TODO.md](/D:/code/rendo/docs/todo/cli/03-Phase3-第一个SaasStarter实现TODO.md)
7. [cli/04-Phase4-Pack机制实现TODO.md](/D:/code/rendo/docs/todo/cli/04-Phase4-Pack机制实现TODO.md)
8. [rendo-platform/10-Phase5-最小真实Rendo能力接入TODO.md](/D:/code/rendo/docs/todo/rendo-platform/10-Phase5-最小真实Rendo能力接入TODO.md)
9. [rendo-platform/11-Phase6-双模式与多端准备TODO.md](/D:/code/rendo/docs/todo/rendo-platform/11-Phase6-双模式与多端准备TODO.md)
10. [rendo-platform/12-Phase7-Rendo平台闭环TODO.md](/D:/code/rendo/docs/todo/rendo-platform/12-Phase7-Rendo平台闭环TODO.md)

## 当前重点

### 第一顺位

- [ ] 冻结并落实首日服务基座架构与目录标准
- [ ] 让五类 `core` 模板共享同一套语言无关目录语义
- [ ] 让所有模板统一具备 `AGENTS.md / CLAUDE.md / .agents / interfaces / src / tests / scripts / install`
- [ ] 让 `starter-core-template` 从第一天就提供宿主挂载位和 `ops/`
- [ ] 让非 starter 模板从第一天就按宿主扩展模型设计
- [ ] 让 `application-base-starter` 成为第一套生产可演进的标准服务基座 base

### 已有基础

- [x] 模板主干切换为 `core -> base -> derived`
- [x] 五类 `core` 模板已建立
- [x] 五类官方 `base` 模板已建立
- [x] `rendo init <kind>` 已支持五类 core 初始化
- [x] Node / Python CLI 本地 registry 行为已对齐
- [x] 远程 fixture registry 已证明 `search / inspect / create / add / pull` 协议闭环
- [x] `shared/authoring/templates` 与 `shared/templates` 的角色边界已澄清

### 第二顺位

- [ ] 让 CLI 对首日架构标准具备更强的 inspect / doctor / compatibility 暴露能力
- [ ] 让 capability lifecycle 显式更新 Agent 入口与接口描述面
- [ ] 明确 CLI 的正式发布形态，从仓库/目录布局交付走向更独立的分发策略
- [ ] 再进入更后续的远程 runtime 与平台线
