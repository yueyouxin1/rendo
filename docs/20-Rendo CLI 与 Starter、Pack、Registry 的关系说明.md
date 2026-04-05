# Rendo CLI 与 Template、Pack、Registry 的关系说明

## 1. CLI 与 Template 的关系

CLI 直接面向模板资产工作。

它通过 registry 和 manifest 理解：

- 模板类型
- 模板层级
- 模板路径
- 模板消费方式

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

CLI 不应把这些信息硬编码在业务分支里。

## 4. CLI 与 Pack 的关系

pack 仍然存在，但 pack 不是模板分层的替代物。

模板负责：

- 结构
- 角色
- 类型

pack 更偏向：

- 安装计划
- 能力补充
- 生命周期操作

