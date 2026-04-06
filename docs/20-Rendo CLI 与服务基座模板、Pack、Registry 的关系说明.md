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

当前还要明确区分两层：

- `shared/authoring/templates` 是 authoring 源
- `shared/templates` 是 formal generated artifacts

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

- capability / provider / surface 的安装、拉取、升级优先由 `template manifest + assetInstall` 驱动
- pack 作为并行兼容语义存在，但不是当前主干的唯一扩展模型

## 6. 一句话结论

CLI 面向的是整套服务基座模板控制面，registry 负责发现与分发，manifest 负责解释，`shared/templates` 负责承载正式模板产物，pack 只保留为并行兼容的安装语义。
