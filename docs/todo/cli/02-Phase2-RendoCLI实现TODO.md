# Phase 2 - Rendo CLI 实现 TODO

## 目标

让 `rendo cli` 从“本地开发辅助工具”升级为“生产级模板控制面入口”。

## 当前状态

- [x] Node CLI 与 Python CLI 都已实现基础命令
- [x] 已支持 `init / create / search / inspect / add / pull / upgrade / doctor`
- [x] 已支持 JSON 结构化输出
- [x] Node / Python 在本地 registry 下行为已基本对齐
- [x] `init` 已切换为 `rendo init <kind>`

## 仍需完成

- [ ] 抽象 `local registry provider` 与 `remote registry provider`
- [ ] 支持真正的远程模板搜索、检查与拉取
- [ ] 支持制品下载后的 digest 校验
- [ ] 支持远程版本解析与升级建议
- [ ] 支持更严格的非交互模式和错误码约定
- [ ] 支持 CLI 自身版本与 registry 协议版本协商
- [ ] 输出正式 CLI compatibility policy
- [ ] 设计 CLI 安装、发布和升级策略

## 完成标准

- [ ] CLI 可以在不依赖当前仓库源码的情况下消费远程模板
- [ ] CLI 对 local / remote 两种 provider 的用户语义保持一致
- [ ] Node / Python 两个实现的关键输出继续保持一致

