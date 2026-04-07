# Rendo 服务基座 Core Template 最小契约定义

## 1. 角色

`core` 模板不是最终模板，也不是最终服务基座产品。

它的职责是：

- 为某个模板类型定义最小控制面
- 提供稳定、轻量、agent 可读的文件结构
- 为 `base` 模板提供明确继承点

## 2. 适用范围

当前每个一等模板类型都应有自己的 `core` 模板：

- starter
- feature
- capability
- provider
- surface

## 3. 必须包含

每个 `core` 模板至少应包含：

- `rendo.template.json`
- `rendo.project.json`
- `package.json`
- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.agents/skills/*/SKILL.md`
- `.agents/review-checklist.md`
- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`
- `interfaces/openapi/README.md`
- `interfaces/mcp/README.md`
- `interfaces/skills/README.md`
- `src/`
- `tests/`
- `scripts/`
- `integration/`
- 一个最小可执行或可校验的健康检查入口

其中 `rendo.template.json` 应显式提供 `documentation` 字段，指向这些规范文件，方便 CLI、人类和强 Agent 从 manifest 直接找到正确入口。

其中还应明确：

- `integration/` 是人类与 Agent 可读的宿主接入说明目录
- `integration/` 不是物理集成根目录
- 物理集成根目录由 manifest `assetIntegration.modes[].targetRoot` 机器可读声明
- `src/` 是唯一实现根目录

对于目录标准本身，所有 `core` 模板还必须服从：

- `docs/29-Rendo服务基座首日架构与目录标准.md`

如果是 `starter-core-template`，则应进一步提供：

- `src/apps/`
- `src/apps/desktop/`（保留槽位）
- `src/packages/`
- `src/features/`
- `src/capabilities/`
- `src/providers/`
- `src/surfaces/`
- `ops/`

并预留：

- `interfaces/openapi/`
- `interfaces/mcp/`
- `interfaces/skills/`

如果是非 starter `core` 模板，则至少应提供：

- 它安装到宿主的哪个挂载位
- 它如何扩展宿主 starter 的 `interfaces/openapi/`
- 它如何扩展宿主 starter 的 `interfaces/mcp/`
- 它如何扩展宿主 starter 的 `interfaces/skills/`
- 它如何更新宿主的 `.agents/skills/*` 与 `interfaces/*`
- 它通过 manifest `assetIntegration.modes[].targetRoot` 安装到宿主 `src/features/`、`src/capabilities/`、`src/providers/` 或 `src/surfaces/`

## 4. 必须满足

`core` 模板必须：

- 最小
- 稳定
- 中立
- 不提前绑定具体业务
- 不提前绑定具体厂商
- 不把平台依赖做成硬前置
- 把 Agent 可调用相关入口保留成显式契约
- 全部可验证

只有被显式定义为 `standalone-runnable` 的 `core` 模板，才要求最小可启动和健康检查。

## 5. 明确不包含

`core` 模板不应默认包含：

- 具体产品 UI
- 具体业务模块
- 单一厂商 SDK 绑定
- 不可替换的真实平台依赖

## 6. 与 Base 的关系

`base` 模板必须显式声明它来自哪个 `core` 模板：

- `lineage.coreTemplate`

`base` 负责把该类型模板的最佳实践补齐，但不应破坏 core 层控制面。
