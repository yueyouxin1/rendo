# Phase 2 - Rendo CLI 实现 TODO

## 目标

继续把 `rendo cli` 打磨成“服务基座模板控制面入口”，
并让 CLI 能显式暴露与校验首日架构标准。

当前不再把 CLI 理解为“本地开发辅助工具起步”，而是：

- 已可工作的模板消费入口
- 当前基于仓库/目录式资产布局运行
- 后续再演进到更独立的分发与发布形态

## 当前状态

- [x] Node CLI 与 Python CLI 都已实现基础命令
- [x] 已支持 `init / create / search / inspect / add / pull / upgrade / doctor`
- [x] 已支持 JSON 结构化输出
- [x] Node / Python 在本地 registry 下行为已基本对齐
- [x] `init` 已切换为 `rendo init <kind>`
- [x] 已支持远程 fixture registry 的 `search / inspect / create / add / pull`

## 第一顺位仍需完成

- [ ] `inspect` 明确暴露模板的标准目录入口、宿主影响面与运行等级
- [ ] `doctor` 能检查 `AGENTS.md / CLAUDE.md / .agents / interfaces / tests / ops` 等关键接口面是否存在
- [ ] `init` 生成结果与首日架构标准一致
- [ ] `add / upgrade` 在输出中显式说明对 Agent 入口与接口描述面的影响
- [ ] CLI 错误信息明确指出“是目录标准问题、契约问题还是运行问题”

## 第二顺位仍需完成

- [x] 抽象 `local registry provider` 与 `remote registry provider`
- [x] 支持真正的远程模板搜索、检查与拉取
- [x] 支持制品下载后的 digest 校验
- [x] 支持 CLI 自身版本与 registry 协议版本协商
- [ ] 支持更严格的非交互模式和错误码约定
- [ ] 明确 CLI 的正式发布策略
- [ ] 明确“仓库/目录式资产布局运行”和“自包含分发”之间的迁移方案

## 完成标准

- [ ] CLI 可以稳定消费本地正式模板产物层与远程 bundle
- [ ] CLI 对 local / remote 两种 provider 的用户语义保持一致
- [ ] Node / Python 两个实现的关键输出继续保持一致
- [ ] 强 Agent 可以通过 `inspect / doctor` 直接看到服务基座关键入口面，而不需要人工遍历目录
- [ ] 是否需要自包含分发已有明确结论，不再与当前功能可用性混淆
