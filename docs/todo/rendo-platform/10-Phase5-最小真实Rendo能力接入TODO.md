# Phase 5 - Headless Rendo Runtime v0 TODO

> 该阶段不是当前第一顺位。必须先完成 `docs/29-Rendo服务基座首日架构与目录标准.md` 所要求的 `core -> base -> derived` 架构冻结与落实，再进入 runtime 线。

## 目标

先做没有前端的 Rendo 后端运行时，让 CLI 能从远程真正获取模板。

## 这个阶段必须交付的东西

- 远程 template registry API
- 模板元数据持久化
- 模板制品存储
- 发布、检索、检查、下载的最小闭环

## TODO

- [ ] 明确 runtime 服务边界
- [ ] 设计 PostgreSQL 元数据模型
- [ ] 设计对象存储中的模板制品布局
- [ ] 实现模板 publish API
- [ ] 实现 search API
- [ ] 实现 inspect API
- [ ] 实现 download / artifact resolve API
- [ ] 实现版本与渠道模型
- [ ] 实现 digest 校验信息下发
- [ ] 实现服务到 CLI 的最小鉴权
- [ ] 做一个最小运维部署方案

## 完成标准

- [ ] CLI 可以不依赖本地仓库文件，从远程拉取模板
- [ ] runtime 的元数据与制品不依赖手工同步
- [ ] 一次模板发布后，search / inspect / pull 都能命中远程结果
