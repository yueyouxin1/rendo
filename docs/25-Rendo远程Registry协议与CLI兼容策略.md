# Rendo 远程 Registry 协议与 CLI 兼容策略

## 目标

冻结一版可被 CLI、runtime 和强 Agent 直接消费的远程协议。

## 握手入口

远程 registry 必须暴露：

- `/.well-known/rendo-registry.json`

最小字段：

- `schemaVersion`
- `protocolVersion`
- `registryId`
- `registryTitle`
- `apiBaseUrl`
- `auth`
- `cliCompatibility`
- `bundleFormat`
- `digestAlgorithm`

## 当前协议版本

- registry protocol：`1.0.0`
- CLI minimum：`0.2.0`
- bundle format：`rendo-bundle.v1`
- digest algorithm：`sha256`

## 远程 API

### `GET /v1/search`

用途：

- 返回模板搜索结果

最小查询参数：

- `type`
- `keyword`

### `GET /v1/inspect`

用途：

- 返回模板 inspect payload
- 返回 manifest
- 返回 bundle 下载地址与 digest 元数据

最小查询参数：

- `ref`

### `GET /v1/bundles/:templateId`

用途：

- 返回 bundle 原文

## CLI 兼容策略

CLI 必须在发起远程操作前完成：

1. 握手读取
2. `cliCompatibility` 校验
3. protocol 版本检查
4. bundle digest 校验

不满足兼容条件时，CLI 必须拒绝继续执行，而不是猜测。

## 鉴权策略

当前冻结一版：

- `Authorization: Bearer <token>`

`auth.type` 当前支持：

- `none`
- `bearer-token`

## 制品完整性

远程 inspect 返回：

- bundle 下载 URL
- bundle digest
- template digest

CLI 在下载后必须校验：

1. 原始 bundle digest
2. bundle 内部文件 digest
3. template digest

## 签名策略

当前冻结策略：

- 官方实现先采用 `digest-only`
- `signature` 保留为后续扩展位，不在当前最小协议中强制要求

也就是说：

- 现在必须能校验完整性
- 现在不强制要求公钥签名体系先行落地

## 版本矩阵表达

模板 manifest 通过 `compatibility` 表达：

- `cli`
- `registryProtocol`
- `hosts`

这意味着：

- CLI 兼容性
- 远程协议兼容性
- 宿主模板兼容性

都不再依赖隐藏规则。
