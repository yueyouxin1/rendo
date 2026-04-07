# Rendo 服务基座首日架构与目录标准

- 文档版本：v2.2
- 日期：2026-04-06
- 文档性质：首日架构与目录冻结文档
- 目标：在第一天就冻结 `core -> base -> derived` 的统一工程语义，确保所有模板都为“面向 Agent 的服务”而生
- 核心结论：**Rendo 的首日标准不是先定某个框架，而是先定模板根语义、实现根语义、宿主挂载位语义、Agent 可读入口语义、运行等级语义和验证语义。**

---

## 1. 文档要解决的问题

Rendo 要解决的不是“再做一套模板”，而是：

- 把“面向 Agent 的服务”在工程架构层面标准化

因此第一天必须先冻结：

- 什么是模板根
- 什么是 Rendo 可识别工作区
- 什么是实现入口
- 什么是宿主挂载位
- 什么是 Agent 入口
- 什么是接口描述面
- 什么是运行与交付面
- 什么是测试和验证骨架

如果这些语义在 `core` 阶段没有定对，后面就会出现：

- 每类模板目录各自发明结构
- 同一语义在不同模板里用不同目录名表达
- `core -> base -> derived` 无法稳定继承
- Agent 需要猜测“该看哪里、该改哪里、能力在哪暴露”
- CLI 无法做可靠校验和自动化操作

---

## 2. 首日冻结的总原则

### 2.1 模板根表达“模板是什么”

模板根目录负责表达：

- 这是哪一类模板
- 这是 `core`、`base` 还是 `derived`
- 这份模板的契约、说明、测试和安装边界在哪里

模板根不负责重复表达实现层类型语义。

同时还必须冻结：

- `.rendo/` 是 Rendo 可识别工作区命名空间
- CLI 管理的 `rendo.template.json` 与 `rendo.project.json` 应进入 `.rendo/`
- 用户不应被迫在仓库根手工维护这些元信息

例如：

- `shared/templates/core/provider/` 已经表达“这是 provider 的 core 模板”
- 因此模板内部默认不应再用 `src/provider/` 去重复表达“我是 provider”

### 2.2 `src/` 表达“实现从哪里开始”

模板内部的默认实现入口统一使用：

- `src/`

`src/` 的职责是表达“实现根”，不是表达模板类型。

因此默认禁止把模板类型名称再作为 `src` 下一级标准目录（该禁止规则不适用于 starter 的宿主挂载槽目录，如 `src/features/`、`src/providers/`），例如：

- 不把 `src/provider` 作为 provider-template 的默认标准结构
- 不把 `src/feature` 作为 feature-template 的默认标准结构
- 不把 `src/capability` 作为 capability-template 的默认标准结构
- 不把 `src/surface` 作为 surface-template 的默认标准结构

`src/` 内部只表达真实职责，例如：

- `src/domain/`
- `src/application/`
- `src/adapters/`
- `src/runtime/`

### 2.3 宿主根表达“装配到哪里”

只有宿主 starter 才负责表达装配挂载位，但这些挂载位也属于实现层，必须落在 `src/` 下，例如：

- `src/apps/`
- `src/packages/`
- `src/features/`
- `src/capabilities/`
- `src/providers/`
- `src/surfaces/`
- `src/surfaces/desktop/`（保留槽位，可先占位）

这些目录表达的是：

- 其他模板被安装到宿主时，应该挂到哪一类位置

它们不等同于模板资产自身的实现入口。

### 2.4 Agent 可读入口必须独立且稳定

Agent 入口不能隐藏在业务实现目录里，也不能散落在多个命名不一致的位置。

统一要求：

- 根目录必须有 `AGENTS.md`
- 根目录必须有 `CLAUDE.md`
- 根目录必须有 `.agents/`
- 根目录必须有 `.gitignore`

其中：

- `AGENTS.md` 是仓库或模板的人类/Agent 共读主入口
- `CLAUDE.md` 应优先做软链接指向 `AGENTS.md`
- 若软链接不可用，可用极薄 shim 文件保持语义同源
- `.agents/` 只承载结构化 Agent 伴随资产

### 2.5 接口描述面与业务实现必须分层

`OpenAPI`、`MCP`、`Skills` 是对外暴露面，不是核心业务实现层。

统一要求：

- 接口定义、协议描述、注册信息、预览、配置放在 `interfaces/`
- 真实业务实现放在 `src/`
- 如需协议接线，可在 `src/` 内使用薄适配层，不得让 `interfaces/` 承载核心业务逻辑

### 2.6 不是所有模板都必须独立运行，但所有模板都必须可验证

Rendo 必须避免把所有模板都误建模为“独立服务”。

统一要求是：

- 所有模板都必须可验证
- 只有宿主型模板或显式声明为独立运行型的模板，才必须可独立运行
- 健康检查、readiness、liveness、heartbeat 只对独立运行型模板强制成立

因此首日标准区分两类运行形态：

- `standalone-runnable`
- `host-attached`

### 2.7 `docker` 不是所有模板的通用根目录

`docker` 是交付手段，不是所有模板共有的抽象语义。

因此：

- 不把顶层 `docker/` 作为所有模板的通用强制目录
- 如果模板提供容器化开箱即用方案，标准位置应是 `ops/docker/`
- 官方 `starter-template` 的 `base` 应提供 `ops/docker/`

---

## 3. Rendo 的统一目录语义

Rendo 统一把目录语义拆成五层：

### 3.1 模板控制面

负责描述模板、约束模板、指导 Agent 和开发者理解模板：

- `.rendo/`
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.agents/`
- `.gitignore`
- `docs/`

其中 `.rendo/` 建议至少包含：

- `.rendo/rendo.template.json`
- `.rendo/rendo.project.json`

### 3.2 实现面

负责承载真实实现：

- `src/`

### 3.3 接口描述面

负责描述能力如何被外部发现和调用：

- `interfaces/`

`interfaces/` 下的标准子目录为：

- `interfaces/openapi/`
- `interfaces/mcp/`
- `interfaces/skills/`

这些目录默认只放：

- 描述文件
- 配置文件
- 契约文件
- 注册信息
- 预览信息
- 示例与说明

### 3.4 验证与装配面

负责测试、脚本和模板级集成说明：

- `tests/`
- `scripts/`
- `integration/`

对于 starter 宿主，装配槽位也在 `src/` 内统一表达：

- `src/apps/`
- `src/packages/`
- `src/features/`
- `src/capabilities/`
- `src/providers/`
- `src/surfaces/`
- `src/surfaces/desktop/`（保留槽位，可先占位）

需要强调：

- `integration/` 只表达人类/Agent 可读的接入说明与宿主影响，不是物理集成根目录
- 物理集成根目录由 manifest `assetIntegration.modes[].targetRoot` 机器可读声明

### 3.5 运行与交付面

只对宿主模板或显式声明为独立运行型的模板成立：

- `ops/`

`ops/` 的职责是承载：

- 运行约定
- 部署约定
- 健康检查约定
- 环境配置约定
- 观测与值班约定

如果模板提供容器化开箱即用方案，标准位置为：

- `ops/docker/`

---

## 4. 所有模板类型必须共享的通用骨架

以下目录和文件是五类模板的首日通用骨架。

五类模板包括：

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

### 4.1 通用根结构

```txt
<template-root>/
├── .rendo/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .agents/
├── docs/
├── interfaces/
├── src/
├── tests/
├── scripts/
└── integration/
```

### 4.2 通用条件扩展目录

以下目录不是所有模板的通用强制项，但在满足条件时必须启用：

```txt
<template-root>/
└── ops/
    └── docker/
```

适用规则：

- `starter-template` 必须有 `ops/`
- 官方 `starter-template` 的 `base` 应提供 `ops/docker/` 作为开箱即用方案
- 任何显式声明为 `standalone-runnable` 的模板都必须有 `ops/`
- 只有在提供容器化运行方案时，才要求 `ops/docker/`
- 默认的 `feature / capability / provider / surface` 模板不因模板类型而自动强制 `ops/`

### 4.3 通用骨架的职责

#### `.rendo/rendo.template.json`

必须表达：

- 模板 ID
- 模板 kind
- 模板层级：`core` / `base` / `derived`
- 是否创建宿主根还是附着到宿主
- 运行形态：`standalone-runnable` 或 `host-attached`
- 读取顺序和关键文档
- 是否符合首日架构标准

#### `.rendo/rendo.project.json`

负责本地工作区身份与来源信息，例如：

- workspace id
- 本地项目名
- origin template
- origin role
- 已安装模板资产
- 已选择 surface

注意：

- 这是 CLI 管理文件
- 不要求用户手工维护
- 若工作区删除 `.rendo/`，则可退化为普通项目

#### `README.md`

面向人类的简明入口，说明：

- 这是哪个模板
- 用来做什么
- 与宿主或子模板的关系

#### `AGENTS.md`

面向人类与 Agent 的共读说明，必须说明：

- 该模板的边界
- 该模板的结构
- 该模板允许修改和禁止修改的位置
- 该模板的验证入口

#### `CLAUDE.md`

必须与 `AGENTS.md` 保持语义同源。

推荐顺序：

1. 软链接到 `AGENTS.md`
2. 若平台不稳定，则使用薄 shim 文件引用 `AGENTS.md`

禁止复制一份长期独立维护的正文。

#### `.agents/`

结构化 Agent 伴随目录，建议至少包含：

- `.agents/skills/*/SKILL.md`
- `review-checklist.md`
- `glossary.md`

如有项目级技能，可放在：

- `.agents/skills/`

注意：

- `skills/` 不是所有 Agent 资产的总称
- `.agents/skills/` 只是 `.agents/` 的一个子目录

#### `.gitignore`

每个模板默认必须提供 `.gitignore`，并满足：

- 同时服务 Git 工作流与 `rendo publish --local`
- 不要求用户维护独立的发布过滤文件
- 即使 `.gitignore` 忽略 `.rendo/`，发布时也必须由 CLI 强制保留 `.rendo/rendo.project.json` 与 `.rendo/rendo.template.json`

#### `docs/`

必须承载模板自身说明，建议至少包含：

- `structure.md`
- `extension-points.md`
- `inheritance-boundaries.md`
- `secondary-development.md`

#### `interfaces/`

统一承载对外描述面，标准子目录为：

- `interfaces/openapi/`
- `interfaces/mcp/`
- `interfaces/skills/`

#### `src/`

统一承载模板自身实现，不重复模板 kind 命名。

#### `tests/`

统一承载验证骨架。

最少应预留：

- `tests/unit/`
- `tests/contracts/`
- `tests/integration/`
- `tests/smoke/`
- `tests/fixtures/`

#### `scripts/`

承载校验、同步、生成、检查等脚本入口。

#### `integration/`

承载模板级集成说明、接入步骤、文件变更规则、宿主影响说明。

注意：

- 历史模板内 `install/` 接入说明语义统一更名为 `integration/`
- `integration/` 不是物理集成根目录
- 物理集成根目录必须由 manifest `assetIntegration.modes[].targetRoot` 定义

#### `ops/`

条件启用目录。

当模板是宿主模板或显式声明为 `standalone-runnable` 时，必须提供：

- 运行说明
- 健康检查说明
- 环境要求
- 部署入口

如果提供容器方案，应放在：

- `ops/docker/`

---

## 5. Starter 模板的增量结构

`starter-template` 是宿主根模板，因此在通用骨架之上必须额外表达装配挂载位和宿主架构语义。

### 5.1 Starter 的标准根结构

```txt
<starter-template-root>/
├── .rendo/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .agents/
├── docs/
├── interfaces/
│   ├── openapi/
│   ├── mcp/
│   └── skills/
├── src/
│   ├── apps/
│   ├── packages/
│   ├── features/
│   ├── capabilities/
│   ├── providers/
│   └── surfaces/
│       └── desktop/
├── tests/
├── scripts/
├── integration/
└── ops/
```

### 5.2 Starter 各目录的职责

#### `src/apps/`

宿主应用实现的标准目录，承载 starter 内可运行应用入口。

#### `src/packages/`

宿主共享包、跨端共享库和可复用模块的标准目录。

#### `src/features/`

宿主中业务特性模板的标准挂载位。

#### `src/capabilities/`

宿主中通用能力模板的标准挂载位。

#### `src/providers/`

宿主中供应商接入模板的标准挂载位。

#### `src/surfaces/`

宿主中面向人类交互端或 UI 端的标准挂载位。

#### `src/surfaces/desktop/`

保留的 desktop surface 槽位。当前官方 starter `base` 可先使用占位实现，但目录语义必须从首日冻结。

#### `ops/`

宿主的运行、部署、观测、环境、值班和运维约定入口。

对于官方 starter `base`，`ops/` 应至少明确：

- 本地启动路径
- smoke 验证路径
- 健康检查路径
- `ops/docker/` 容器化启动方案

### 5.3 Starter 的 `src/` 语义

starter 内部实现默认也只使用：

- `src/`

如需进一步分层，应按职责拆分，而不是按模板类型重复命名，例如：

```txt
src/
├── domain/
├── application/
├── adapters/
├── runtime/
└── bootstrap/
```

禁止把以下结构定义为 starter 的标准：

- 根目录 `apps/`
- 根目录 `packages/`
- 根目录 `features/`
- 根目录 `capabilities/`
- 根目录 `providers/`
- 根目录 `surfaces/`
- `src/starter/`
- `src/provider/`
- `src/feature/`

因为这些命名要么重复模板身份，要么混淆宿主装配位与实现位。

---

## 6. 非 starter 模板的增量结构

`feature / capability / provider / surface` 模板不是宿主根，但必须遵守相同的通用骨架。

### 6.1 非 starter 模板的标准根结构

```txt
<non-starter-template-root>/
├── .rendo/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .agents/
├── docs/
├── interfaces/
│   ├── openapi/
│   ├── mcp/
│   └── skills/
├── src/
├── tests/
├── scripts/
└── integration/
```

### 6.2 非 starter 模板必须说明的内容

每个非 starter 模板必须在 `integration/` 和 `docs/` 中写清楚：

1. 它安装到宿主的哪个挂载位
2. 它会改动宿主的哪些标准目录
3. 它会新增或更新哪些能力 ID
4. 它会新增或更新哪些 `interfaces/*` 描述
5. 它会新增哪些测试与验证入口
6. 它会新增哪些环境变量、运行依赖或运维要求

并且：

- manifest `assetIntegration.modes[].targetRoot` 负责机器可读的物理集成根目录
- `integration/` 负责人类与 Agent 可读的接入与宿主影响说明

### 6.3 非 starter 模板不能做的事

非 starter 模板不得：

- 绕开宿主挂载位随意散落文件
- 只改 `src/` 而不更新对应的 `interfaces/*`
- 把接口描述文件和核心业务实现混在同一目录
- 用 `provider/`、`feature/`、`capability/`、`surface/` 作为模板内部默认实现根目录

### 6.4 非 starter 模板的运行要求

默认情况下，非 starter 模板应被视为：

- `host-attached`

这意味着：

- 不强制独立进程启动
- 不强制独立 HTTP 健康检查
- 不强制心跳端点

但仍然必须做到：

- 可安装到标准宿主或 fixture host
- 可完成结构校验
- 可完成接口描述面校验
- 可完成安装后集成验证

如果某个非 starter 模板显式声明自己是：

- `standalone-runnable`

那么它必须额外提供：

- `ops/`
- 启动路径
- smoke 验证路径
- 健康检查或等价心跳机制

---

## 7. 运行等级与验证标准

### 7.1 所有模板都必须可验证

“可验证”是全模板共性，“可独立运行”不是。

因此所有模板至少都必须支持：

- 结构完整性校验
- manifest 与文档一致性校验
- `AGENTS.md / CLAUDE.md / .agents/` 存在性校验
- `interfaces/*` 描述面校验
- 与其运行形态相匹配的 smoke 或集成验证

### 7.2 `standalone-runnable` 模板的要求

当模板被定义为 `standalone-runnable` 时，必须满足：

- 可以独立启动
- 可以做 smoke 验证
- 有健康检查约定
- 有 readiness / liveness / heartbeat 或等价机制
- 若提供容器方案，则放在 `ops/docker/`

这类模板通常包括：

- `starter-template`
- 少数被明确建模为独立服务的 `surface-template` 或 `provider-template`

### 7.3 `host-attached` 模板的要求

当模板被定义为 `host-attached` 时，不要求它单独作为一个服务进程存在。

但它必须满足：

- 可被安装到宿主
- 可被宿主发现
- 安装后可完成集成验证
- 其能力映射在 `.agents/` 与 `interfaces/*` 中可追踪

这类模板通常包括：

- 大多数 `feature-template`
- 大多数 `capability-template`
- 大多数 `provider-template`
- 大多数 `surface-template`

---

## 8. `core -> base -> derived` 的继承规则

### 8.1 `core`

`core` 负责冻结：

- Rendo 工程语言规范
- 通用骨架
- 目录语义
- Agent 入口
- 接口描述面
- 运行等级语义
- 测试骨架
- 安装与验证边界

`core` 不负责冻结：

- 具体框架
- 具体供应商
- 具体产品化业务实现

### 8.2 `base`

`base` 负责把 `core` 冻结的语义落实成：

- 可验证
- 可测试
- 可演进
- 符合主流最佳实践

`base` 的价值不是“薄壳”本身，而是：

- 官方参考实现
- 官方推荐技术栈与工程实践的稳定承载层

如果该模板被定义为 `standalone-runnable`，`base` 还必须把它落实成：

- 可启动
- 可 smoke
- 可检查健康状态

`base` 可以选择具体技术栈，但不得破坏：

- 通用骨架
- `AGENTS.md / CLAUDE.md / .agents/`
- `interfaces/`
- `src/`
- `tests/`
- `integration/`

对于 starter 的 `base`，还不得破坏：

- `src/apps/`
- `src/packages/`
- `src/features/`
- `src/capabilities/`
- `src/providers/`
- `src/surfaces/`
- `src/surfaces/desktop/`（保留槽位）
- `ops/`

### 8.3 `derived`

`derived` 可以做场景化延展，但只能：

- 增补实现
- 增补接口暴露
- 增补测试
- 增补运维方案

`derived` 的价值是：

- 承载具体产品、具体社区模板、具体场景模板
- 在不破坏 `core` 工程语言和 `base` 参考实现边界的前提下形成真正可发布产物

不能：

- 重命名或移除冻结的根语义
- 把 `src/` 变成类型同名目录的壳
- 把宿主挂载位和模板内部实现位混为一谈
- 改写已声明的运行等级语义

---

## 9. TDD 与验证骨架

Rendo 的首日标准不是“以后补测试”，而是从 `core` 起就预留验证骨架。

### 9.1 每类 core 模板都必须提供

- `tests/unit/`
- `tests/contracts/`
- `tests/integration/`
- `tests/smoke/`
- `tests/fixtures/`

### 9.2 `base` 必须落实的最低验证

至少要能验证：

- 模板结构完整
- `AGENTS.md` 与 `CLAUDE.md` 存在且同源
- `.agents/` 存在且包含最小 Agent 资产
- `interfaces/openapi/`、`interfaces/mcp/`、`interfaces/skills/` 存在并可校验
- 非 starter 模板的 `integration/` 能清晰说明宿主影响，并与 `assetIntegration.modes[].targetRoot` 一致
- 若模板是 `standalone-runnable`，则其启动、smoke、健康检查或等价心跳机制可验证

### 9.3 `derived` 必须补充的验证

- 场景回归验证
- 宿主集成验证
- Agent 驱动路径验证

---

## 10. 面向 Agent 的能力映射规则

Rendo 不要求每个能力同时暴露为 `OpenAPI`、`MCP`、`Skills` 三种形式，
但要求能力的存在、位置和接线方式必须显式可追踪。

### 10.1 能力映射的标准落点

能力至少应在以下位置保持一致性追踪：

1. `.agents/skills/*/SKILL.md`
2. `interfaces/openapi/`
3. `interfaces/mcp/`
4. `interfaces/skills/`

### 10.2 能力映射的标准要求

必须能回答：

- 这个能力的稳定 ID 是什么
- 它由哪个模板提供
- 它安装到宿主的哪个挂载位
- 它暴露到了哪些接口描述面
- 它的验证入口在哪里

---

## 11. 模板仓库路径约定

如果一个模板类型只有一个官方 `core` 模板，标准仓库路径应尽量避免重复命名。

推荐形态为：

```txt
shared/templates/core/starter/
shared/templates/core/feature/
shared/templates/core/capability/
shared/templates/core/provider/
shared/templates/core/surface/
```

而不是：

```txt
shared/templates/core/provider/provider-core-template/provider/
```

原因是：

- `core/provider` 已经表达模板类型
- 模板 ID 应主要由 `rendo.template.json` 表达
- 模板内部实现应由 `src/` 表达
- 再追加 `provider-core-template/provider` 只会制造重复和歧义

需要注意当前仓库状态：

- 现在的正式模板产物层和 registry 仍使用 `shared/templates/core/<kind>/<template-id>/`
- 也就是说，当前消费契约仍是“formal artifact path”
- 上述更短路径是后续目录收敛目标，不是当前 CLI/registry 已切换完成的消费路径

因此这一条的正确理解是：

- `shared/authoring/templates` 是 authoring 源
- `shared/templates` 是 Rendo 内部分发资产层，不是用户日常开发入口
- 路径简化是后续迁移目标，不能在未迁移 registry 与 CLI 之前直接假定已经生效

---

## 12. 成功定义

首日架构与目录标准真正成立，至少要同时满足以下条件：

1. 五类模板都共享同一套通用根骨架。
2. 每个 core 模板都具备 `AGENTS.md`、`CLAUDE.md`、`.agents/`。
3. 模板内部统一使用 `src/` 作为实现根，而不是重复模板类型目录。
4. starter 宿主把挂载位统一冻结在 `src/apps/ src/packages/ src/features/ src/capabilities/ src/providers/ src/surfaces/`，并保留 `src/surfaces/desktop/`。
5. `interfaces/` 与 `src/` 的职责边界清晰，不混放核心业务逻辑。
6. `starter-template` 与所有 `standalone-runnable` 模板具备明确的 `ops/` 语义；如提供容器方案，则落在 `ops/docker/`。
7. 所有模板都可验证，但只有 `standalone-runnable` 模板被要求可独立运行并提供健康检查或等价心跳机制。
8. `core -> base -> derived` 的继承不会破坏以上语义。
9. 强 Agent 读取模板后，不需要猜测“入口在哪、能力在哪、该改哪里、该验证哪里”。
10. CLI 和结构校验工具最终可以基于这些标准做自动检查。

---

## 13. 一句话结论

Rendo 的首日标准不是：

- 先定某个语言模板长什么样

而是：

- **先定所有模板共享的控制面、实现面、接口描述面、验证面、运行面和宿主挂载位语义**

只有这样，`core -> base -> derived` 才能真正成为面向 Agent 的服务基座继承链，而不是一组命名相似但结构漂移的模板目录。
