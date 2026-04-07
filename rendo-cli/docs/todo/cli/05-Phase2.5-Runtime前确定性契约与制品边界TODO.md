# Phase 2.5 - Runtime 前确定性契约与制品边界 TODO

## 目标

在进入任何真实 runtime、持久化 registry 或平台发布链路之前，
先把 Rendo 当前阶段真正需要稳定的内容收敛清楚：

- 哪些 manifest / CLI / bundle 字段必须是代码层可确定的
- 哪些说明性信息允许由未来的强 Agent 在发布前补全
- 哪些“发布能力”当前只需要做到本地正式制品导出与本地 workspace publish，而不需要远程官方发布

这一步的目的不是扩平台，而是降低当前阶段的契约噪音。

## 当前判断

- [x] 当前 CLI 已能消费本地正式模板产物层与远程 fixture registry
- [x] 当前 bundle、digest、registry handshake 已有最小协议
- [x] 当前模板资产已具备机器可读宿主接入契约
- [x] 当前模板资产机器契约已统一迁移为 `assetIntegration`
- [x] 当前已明确不拆第二份发布 manifest，而是通过 runtime-pre snapshot 导出 deterministic 子集
- [x] 当前已单独定义“本地制品发布/导出”和“远程官方发布”的边界
- [x] 当前已落地 `rendo publish --local` 作为 workspace 到 publish bundle 的最小闭环

## 当前阶段必须冻结的边界

### 1. 运行时与 CLI 强依赖字段

这类字段必须由代码、模板生成链或可校验配置直接确定，并可被脚本验证：

- 模板身份：`id`、`version`、`templateKind`、`templateRole`
- 继承关系：`lineage`
- 运行与宿主边界：`runtimeModes`、`compatibility`
- 首日架构：`architecture`
- surface 与挂载位：`surfaceCapabilities`、`defaultSurfaces`、`surfacePaths`、`supports`
- 环境与工具链：`requiredEnv`、`toolchains`
- 模板资产宿主接入契约：`assetIntegration`

### 2. 允许未来由 AI 发布前 enrich 的信息

这类信息对人类与 Agent 很有价值，但不应成为当前 runtime/CLI 正确性的前置依赖：

- 面向发布或检索优化的文案
- 更细粒度的技术栈分析
- 更完整的二开说明
- 更丰富的领域/场景标签
- 发布说明、升级说明、对比说明

当前阶段应避免让 CLI 或 runtime 因这些信息缺失而失效。

### 3. 发布能力边界

当前阶段不做：

- 官方远程 `publish` API
- 发布审核、回退、权限与持久化后台
- 平台级发布工作流

当前阶段可以考虑的最小发布能力只有：

- [x] 从正式模板产物层导出 bundle
- [x] 从本地 workspace 导出 publish bundle
- [x] 对 bundle 做 schema / digest / drift 校验
- [x] 生成可被 local / remote registry / runtime-pre handoff 消费的正式制品

## 第一顺位仍需完成

- [x] 将模板资产契约从 `assetInstall` 统一迁移为 `assetIntegration`
- [x] 将 `assetIntegration.modes[].install` 统一迁移为 `changes`
- [x] 让 CLI `inspect / add / upgrade` 与模板资产相关输出统一使用 `assetIntegration`
- [x] 让 schema、Node CLI、Python CLI、测试、正式模板产物同步完成契约迁移
- [x] 在文档层明确 manifest 中哪些字段是“当前强依赖确定性字段”，哪些字段属于“允许发布前 enrich”
- [x] 明确“本地制品导出/打包”与“远程官方发布”是两个不同阶段
- [x] 当前阶段明确不实现远程官方 `publish`；如后续实现，仅先落到本地制品导出语义

## 第二顺位仍需完成

- [x] 落地 `rendo bundle` 作为本地正式制品导出入口
- [x] 明确不拆第二份 manifest，而是通过 `templates.snapshot.json` 提取 deterministic / enriched 边界
- [x] 落地 runtime-pre registry snapshot schema 与导出脚本，保存 manifest 派生字段、bundle digest、template digest 与 lineage 信息
- [x] 让 CLI `doctor` 校验已安装模板的 `targetRoot / integration` 一致性，并在 remote registry 可用时消费 handshake `snapshot` 摘要
- [x] 已明确未来发布前 AI enrich 只补说明性字段，可由项目管理 skills/工作流提供，而不改写 runtime 强契约
- [ ] runtime / SaaS 阶段正式消费 `templates.snapshot.json`、bundle 制品与 handshake `snapshot` 指针

## 完成标准

- [x] 仓库中不再并存 `assetInstall` 与 `assetIntegration` 两套模板资产契约词汇
- [x] 强 Agent 仅凭 manifest、CLI 输出和 bundle 即可理解宿主接入方式，不需要猜“这是安装还是集成”
- [x] 当前 runtime 前阶段已经明确：Rendo 先稳定确定性契约，再引入 AI enrich 与平台发布链路
- [x] 即使未来引入项目管理 skills，CLI 与 runtime 依赖的字段仍然可被代码和脚本直接验证
- [x] `publish` 是否进入当前阶段已有明确结论，不再与远程 registry 平台能力混淆
- [x] bundle、snapshot 与 handshake `snapshot` 指针已经足以作为 runtime 前的正式制品交付边界
