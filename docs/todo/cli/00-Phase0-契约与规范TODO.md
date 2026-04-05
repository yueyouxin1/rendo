# Phase 0 - 契约、分层与远程化前置约束 TODO

## 目标

把模板系统的底层契约定稳到足以支撑：

- 本地 CLI
- 远程 registry
- headless runtime
- 后续 v1 正式发布

## 当前状态

- [x] 已统一模板主干为 `core -> base -> derived`
- [x] 已统一模板类型为五类一等模板
- [x] 已有 `template-manifest`
- [x] 已有 `project-manifest`
- [x] 已有 `template-profile`
- [x] 已有本地 `templates registry`
- [x] 已统一 `rendo init <kind>` 与 `rendo create` 的基本分工

## 仍需完成

- [ ] 明确远程 registry API 契约
- [ ] 明确模板制品 bundle 格式
- [ ] 明确制品 digest / 签名 / 完整性校验规则
- [ ] 明确 `install / pull / upgrade / doctor` 的远程返回结构
- [ ] 明确模板版本兼容矩阵表达方式
- [ ] 明确 template 与 pack 的关系边界，避免双重语义
- [ ] 明确 CLI 与 runtime 间的鉴权方式
- [ ] 输出正式术语表，冻结一版命名

## 完成标准

- [ ] 新增一个 remote registry provider 时，不需要推翻现有 manifest 结构
- [ ] CLI 与 runtime 的请求/响应可以直接结构化消费
- [ ] Agent 不需要猜测“某类模板是否是附属物”

