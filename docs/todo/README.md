# TODO 索引

## 使用方式

`doc/todo` 现在按两条主线组织：

- `cli/`
  - 模板契约、core/base/derived、CLI、本地与远程 registry 能力
- `rendo-platform/`
  - headless Rendo runtime、持久化存储、远程发布与狗粮验证

这些文件不再代表旧的“唯一 Core Starter 路线”。
即使文件名保留了旧阶段编号，也应按当前正式架构理解：

- `core -> base -> derived`
- `starter / feature / capability / provider / surface`
- `CLI + template system + headless runtime` 三线并行打磨

## 阅读顺序

1. [V1-发布门槛清单与交付成功定义.md](/D:/code/rendo/doc/todo/V1-发布门槛清单与交付成功定义.md)
2. [cli/00-Phase0-契约与规范TODO.md](/D:/code/rendo/doc/todo/cli/00-Phase0-契约与规范TODO.md)
3. [cli/01-Phase1-CoreStarter实现TODO.md](/D:/code/rendo/doc/todo/cli/01-Phase1-CoreStarter实现TODO.md)
4. [cli/02-Phase2-RendoCLI实现TODO.md](/D:/code/rendo/doc/todo/cli/02-Phase2-RendoCLI实现TODO.md)
5. [cli/03-Phase3-第一个DomainStarter实现TODO.md](/D:/code/rendo/doc/todo/cli/03-Phase3-第一个DomainStarter实现TODO.md)
6. [cli/04-Phase4-Pack机制实现TODO.md](/D:/code/rendo/doc/todo/cli/04-Phase4-Pack机制实现TODO.md)
7. [rendo-platform/10-Phase5-最小真实Rendo能力接入TODO.md](/D:/code/rendo/doc/todo/rendo-platform/10-Phase5-最小真实Rendo能力接入TODO.md)
8. [rendo-platform/11-Phase6-双模式与多端准备TODO.md](/D:/code/rendo/doc/todo/rendo-platform/11-Phase6-双模式与多端准备TODO.md)
9. [rendo-platform/12-Phase7-Rendo平台闭环TODO.md](/D:/code/rendo/doc/todo/rendo-platform/12-Phase7-Rendo平台闭环TODO.md)

## 当前重点

### 已完成的基础

- [x] 模板主干切换为 `core -> base -> derived`
- [x] 五类 `core` 模板已建立
- [x] 五类官方 `base` 模板已建立
- [x] `rendo init <kind>` 已支持五类 core 初始化
- [x] Node / Python CLI 本地 registry 行为已对齐

### 当前必须继续推进的工作

- [x] 把 CLI 从“本地 registry 读取器”升级为“local + remote provider”
- [ ] 建立 headless Rendo runtime
- [ ] 建立远程模板 registry、制品存储和版本解析
- [x] 做出一个能承载 Rendo 自身 runtime 的 derived SaaS starter
- [ ] 用 Rendo 自己吃这套模板和 CLI 的狗粮
