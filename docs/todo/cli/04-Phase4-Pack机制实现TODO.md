# Phase 4 - Capability / Pack 生命周期实现 TODO

## 目标

让 capability、provider、surface 这类可安装资产具备真正可生产使用的生命周期。

前提：

- 首日服务基座架构标准已经冻结
- 宿主 starter 已具备标准 Agent 入口与目录结构

## 当前状态

- [x] 已支持非 starter 模板的 `search / inspect / add / pull`
- [x] 已有 `storage-capability-base-template`
- [x] 已有 `llm-provider-base-template`
- [x] 已有 `admin-surface-base-template`
- [x] 安装记录已能写入 `rendo.project.json`

## 仍需完成

- [x] 明确 template asset 与 pack 的长期关系
- [x] 完成 install plan preview 的正式协议
- [x] 完成冲突检测与覆盖策略
- [x] 完成 upgrade plan 与变更摘要
- [x] 支持回滚或至少支持失败后的安全中止
- [x] 支持版本约束与宿主兼容性检查
- [x] 支持 source / managed / hybrid 的真实安装差异
- [x] 至少做 1 到 3 个可远程发布和升级的官方能力资产
- [ ] install plan 明确说明对 `AGENTS.md / CLAUDE.md / .agents / interfaces/* / install / ops` 的影响
- [ ] capability / provider / surface 安装后会同步更新宿主能力清单与接口暴露说明

## 完成标准

- [x] `add / pull / upgrade` 都能走统一 manifest 与 install plan
- [x] 安装行为对人类和 Agent 都是可预期、可审计的
- [x] 升级不会悄悄破坏宿主工程主权
- [ ] Agent 可以直接从 install plan 判断这次安装是否改变了服务基座的可调用能力面
