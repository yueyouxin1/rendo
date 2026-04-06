# Phase 0 - 首日架构、契约与规范冻结 TODO

## 目标

先把 Rendo 的服务基座首日架构标准冻结到足以支撑：

- `core -> base -> derived`
- 面向 Agent 的服务设计
- 统一的 `interfaces/openapi / interfaces/mcp / interfaces/skills` 能力暴露
- 后续 CLI、base 模板和模板资产生命周期

## 当前状态

- [x] 已统一模板主干为 `core -> base -> derived`
- [x] 已统一模板类型为五类一等模板
- [x] 已输出正式术语表
- [x] 已输出首日架构与目录标准文档
- [x] `README.md` / `AGENTS.md` 已提升该标准为 source of truth

## 第一顺位仍需完成

- [ ] 冻结所有模板共享的通用根骨架
- [ ] 冻结 `AGENTS.md / CLAUDE.md / .agents / interfaces / src / tests / scripts / install` 的最小语义
- [ ] 冻结 starter 宿主挂载位 `features / capabilities / providers / surfaces / ops`
- [ ] 冻结 `standalone-runnable / host-attached` 的运行等级边界
- [ ] 冻结 `ops/docker` 的条件启用语义
- [ ] 冻结非 starter 模板接入宿主 starter 的标准扩展模型
- [ ] 冻结 capability 安装时对 Agent 入口与接口描述面的更新规则
- [ ] 冻结 `shared/authoring/templates` 与 `shared/templates` 的 authoring/产物职责边界

## 第二顺位仍需完成

- [x] 明确远程 registry API 契约
- [x] 明确模板制品 bundle 格式
- [x] 明确制品 digest / 签名 / 完整性校验规则
- [ ] 明确 `install / pull / upgrade / doctor` 的远程返回结构
- [x] 明确模板版本兼容矩阵表达方式
- [x] 明确 template 与 pack 的关系边界，避免双重语义
- [x] 明确 CLI 与 runtime 间的鉴权方式

## 完成标准

- [ ] 五类模板的 `core` 都能被同一种目录与接口面模型解释
- [ ] 强 Agent 不需要猜测“应该去哪里找能力定义和接线位置”
- [ ] `base` 与 `derived` 对 `core` 的继承边界可直接文档化和脚本校验
- [ ] authoring 源与正式模板产物层职责清晰且不混用
- [ ] 后续 CLI、starter、template asset lifecycle 都不需要重新发明结构约定
