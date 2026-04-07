# Rendo 服务基座 CLI 最小协议定义

## 1. CLI 的角色

`rendo cli` 是服务基座模板系统的统一入口，不是某个 starter 内部脚本。

它要让人类和强 Agent 都能通过同一组命令理解：

- 这是什么模板
- 它属于哪一类
- 它处于 `core / base / derived` 的哪一层
- 它是服务基座根模板，还是可装配服务单元
- 它该如何初始化、创建、安装、拉取、升级和诊断

## 2. 当前交付边界

当前 CLI 已经有两种可用形态：

- `rendo-cli/` 内的开发工作区形态
- 本地 MVP 二进制 `rendo.exe` 形态

这意味着：

- local provider 直接读取 `shared/registry` 和 `shared/templates`
- remote provider 通过 HTTP registry 协议做 `search / inspect / create / add / pull`，并下载 bundle 做 digest 校验
- `rendo bundle <ref>` 已作为内部模板资产的本地制品导出入口落地
- `rendo publish --local` 已作为本地工作区到 publish bundle 的最小闭环落地
- `scripts/generate-runtime-catalog.ts` 已作为 runtime-pre deterministic snapshot 生成入口落地
- authoring overlays 和 `shared/authoring/templates` 不直接进入 CLI 运行时消费路径
- 当前实现既适用于开发工作区，也适用于带打包资产的本地可执行分发
- 当前已经不再把“是否有本地可执行二进制”视为未完成项；后续仍待完成的是更正式的跨平台分发、远程 publish 与 runtime 集成

同时，CLI 还需要明确本地工作区语义：

- `.rendo/` 应作为 Rendo 可识别工作区的命名空间
- `.rendo/rendo.project.json` 负责本地工作区身份
- `.rendo/rendo.template.json` 负责 CLI 管理的发布投影元信息
- `.gitignore` 应作为工作区默认存在的发布过滤文件，并被 `publish --local` 直接复用
- 用户不应被要求手工维护这些文件

## 3. 核心命令

### `rendo init <kind>`

用途：

- 初始化某一模板类型的官方 `core` 源
- 创建一个最小、可校验、可发布的 Rendo 可识别工作区
- 初始化 `.rendo/`、工作区 ID 和来源 lineage

当前支持：

- `starter`
- `feature`
- `capability`
- `provider`
- `surface`

### `rendo create`

用途：

- 从 `starter-template` 的 `base` 或 `derived` 模板创建可运行的服务基座工作区
- 初始化 `.rendo/`、工作区 ID、本地项目名和来源 lineage

约束：

- 不接受 `core` 模板
- 不接受非 starter 模板

### `rendo search`

用途：

- 搜索 starter 根模板、可装配服务单元模板，以及保留兼容的 pack
- 支持 `local` 与 `remote registry provider`

### `rendo inspect`

用途：

- 查看 manifest、结构化元信息、文档入口、兼容矩阵与 integration plan 元数据
- 显式暴露 `lineage.coreTemplate / baseTemplate / parentTemplate`
- 显式暴露 `assetIntegration.modes[].targetRoot` 与 `integration/` 指南入口
- 面向强 Agent 暴露模板身份、目录契约和宿主影响面

### `rendo add`

用途：

- 向当前服务基座项目添加非 starter 模板或 pack
- 对 template asset 使用 manifest 驱动的 integration plan

### `rendo pull`

用途：

- 把模板或 pack 拉到本地目录进行查看、对比或二次加工
- 远程拉取时对 bundle 做 digest 校验

### `rendo bundle`

用途：

- 从正式模板产物层导出单个模板的本地 bundle 制品
- 为 runtime-pre snapshot、离线检查和后续 registry/runtime 导入提供统一制品入口

边界：

- 当前是本地正式制品导出，不等于官方远程 `publish`
- 输出 bundle 仍来自 `shared/templates` 对应的正式模板产物

### `rendo publish --local`

当前已实现的 `publish` 仅面向本地工作区导出，不等于官方远程 `publish`。

当前语义：

- `publish --local` 读取 `.rendo/` 中的工作区元信息
- 只要 `.rendo/` 仍然存在且合法，工作区就被视为可发布工作区
- `rendo init / create / pull` 生成的本地非官方工作区，应立即投影为 `derived`
- 导出时默认基于 `.gitignore` 过滤文件，以避免用户维护两套过滤规则
- `.rendo/**` 必须被强制保留，不能被 `.gitignore` 意外排除
- CLI 负责补齐来源 lineage、唯一 workspace id、标题、名称和默认投影值，而不是要求用户手工维护

### 本地安装

当前本地 MVP 二进制可通过以下方式安装到用户目录：

- `npm run build:release`
- `npm run install:local-cli`

默认安装目标为 `%LOCALAPPDATA%\\Programs\\Rendo\\bin\\rendo.exe`。

### 未来的官方远程 `publish`

官方远程 `publish` 仍未纳入当前最小协议。

### `rendo upgrade`

用途：

- 升级已安装 template asset 或 pack

### `rendo doctor`

用途：

- 诊断当前环境、registry 连接与项目状态
- 显式暴露 starter 当前继承的首日架构标准、`src/*` 标准槽位与根目录契约
- 校验已安装非 starter 模板记录的 `assetIntegration.modes[].targetRoot` 与实际落地路径是否一致
- 校验已安装模板自身 `integration/` 根是否完整可读
- 当 remote registry 暴露 handshake `snapshot` 指针时，输出 `registrySnapshot` 摘要供 runtime-pre handoff 和 Agent 消费

## 4. 语义边界

- `init` 负责从官方 `core` 源初始化工作区
- `create` 负责从 starter `base / derived` 源初始化工作区
- `add / pull` 负责非 starter 模板与 pack 的消费
- `starter-template` 是服务基座根模板
- `feature / capability / provider / surface` 是围绕服务基座装配的服务单元模板
- `.rendo/` 负责标识本地是否仍然是 Rendo 可识别工作区
- 工作区删除 `.rendo/` 后，可退化为普通项目
- 模板实现根统一为 `src/`；starter 的标准槽位为 `src/apps/ src/packages/ src/features/ src/capabilities/ src/providers/ src/surfaces/`（含保留槽位 `src/surfaces/desktop/`）
- 非 starter 物理安装根由 `assetIntegration.modes[].targetRoot` 决定，`integration/` 只负责可读接入说明
- `--registry <provider>` 负责切换 `local` 与 `remote`
- `--registry-token` 负责 bearer token 鉴权

## 5. 当前不纳入最小协议的能力

以下能力属于后续阶段，不是当前最小 CLI 协议的一部分：

- `rendo validate`
- `rendo gen mcp`
- 官方远程 `publish`
- 更正式的跨平台 CLI 分发
- 服务基座预览与在线试跑
- Agent 可调用性评分

## 6. Agent 友好要求

CLI 输出应尽量让强 Agent 在不翻大量代码的情况下就能知道：

- 该模板属于哪一类、哪一层
- 它是根模板还是附加模板
- 推荐先看哪些文档文件
- 它当前属于 `standalone-runnable` 还是 `host-attached`
- 它通过哪些 `AGENTS.md / .agents / interfaces/* / integration/*` 入口被理解和消费
- 非 starter 的真实安装位置是否由 `assetIntegration.modes[].targetRoot` 明确
- 它能被谁创建、谁安装、谁宿主
- 当前是否已经有 bundle 制品和 runtime-pre snapshot 可供下游 runtime 或强 Agent 直接消费
