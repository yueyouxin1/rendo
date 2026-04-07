# Rendo CLI 与服务基座模板、Pack、Registry 的关系说明

## 1. CLI 与 Template 的关系

CLI 直接面向服务基座模板工作。

它通过 registry 和 manifest 理解：

- 模板类型
- 模板层级
- 它是服务基座根模板还是可装配服务单元
- 模板路径
- 模板消费方式
- 文档入口、宿主影响面与安装影响面

## 2. CLI 与 Core / Base / Derived 的关系

CLI 需要知道：

- 哪些模板是 `core`
- 哪些模板是 `base`
- 哪些模板是 `derived`

因此：

- `init` 依赖 `core`
- `create` 依赖 starter 的 `base / derived`
- `add / pull` 依赖非 starter 模板与 pack

## 3. CLI 与 Registry 的关系

registry 提供：

- 模板 id
- ref
- aliases
- templateKind
- templateRole
- manifestPath
- templatePath
- bundle 制品定位与 digest
- runtime-pre snapshot 与 handshake 入口

当前还要明确区分两层：

- `shared/authoring/templates` 是 authoring 源
- `shared/templates` 是 internal distribution artifacts

同时还要区分：

- 工作区 registry 索引：`shared/registry/*.json`
- runtime-pre 导出目录：`templates.snapshot.json`、`.well-known/rendo-registry.json`、`bundles/*`

CLI 与 registry 当前消费的是：

- `shared/templates`

而不是 authoring overlays。

## 4. CLI 与 Local / Remote Provider 的关系

当前 CLI 已有两种 provider 语义：

- `local`
- `remote`

其中：

- local provider 读取本地 `shared/registry` 和 `shared/templates`
- remote provider 通过 HTTP 协议返回搜索结果、inspect 结果与 bundle 下载地址
- runtime-pre registry 还可额外暴露 `templates.snapshot.json` 和 handshake 中的 `snapshot` 指针，供后续 runtime 或强 Agent 做确定性消费
- 当前测试已用 fixture registry 证明远程协议闭环

因此当前缺的不是“远程能力是否存在”，而是：

- 持久化官方 registry 后端
- 更正式的发布与分发策略
- 最终的自包含 CLI 包装策略

## 5. CLI 与 Pack 的关系

pack 仍然存在，但 pack 不是服务基座模板分层的替代物。

模板负责：

- 结构
- 角色
- 类型
- 服务基座根与服务单元的边界

pack 更偏向：

- 安装计划
- 能力补充
- 生命周期操作

当前阶段的官方最小生命周期优先落在：

- 非 starter `template asset`

也就是说：

- capability / provider / surface 的安装、拉取、升级优先由 `template manifest + assetIntegration` 驱动
- pack 作为并行兼容语义存在，但不是当前主干的唯一扩展模型

## 6. CLI 与 Runtime-pre 制品的关系

当前 CLI 已经把 runtime 前阶段需要的最小制品边界做出来：

- `rendo bundle <ref>`：导出单模板 bundle 制品
- `scripts/generate-runtime-catalog.ts`：导出 `bundles/*.json`、`templates.snapshot.json`、`index.json`、`.well-known/rendo-registry.json`

这意味着：

- 当前已经能把内部分发资产层导出成 runtime-pre 可消费目录
- 这仍然不是官方远程 `publish`
- 后续 runtime / SaaS 阶段应消费这些确定性制品，而不是直接消费 authoring 源

## 7. 一句话结论

CLI 面向的是整套服务基座模板控制面，registry 负责发现与分发，manifest 负责解释，`shared/templates` 负责承载 Rendo 内部分发资产，bundle 与 runtime-pre snapshot 负责进入下一阶段前的确定性制品交付，pack 只保留为并行兼容的安装语义。
