# Phase 3 - 第一个可用于 Rendo 自身Saas的 Starter TODO

> 文件名保留历史名字，但当前语义是：从 `starter-core-template` 和 `application-base-starter` 继续长出第一个真正有生产价值的 derived SaaS starter。

## 目标

做出一个从 `application-base-starter` 派生的高质量 derived starter。

这个 starter 不只是 demo，而是要能承载：

- Rendo headless runtime
- 模板发布与拉取
- 模板元数据持久化

## 当前状态

- [x] 已有 `application-base-starter`
- [x] 已支持 `web / miniapp / mobile` 的最小 surface 选择
- [x] 当前 application base starter 可运行
- [x] 当前 application base starter 已证明 base starter 可以多 surface

## 仍需完成

- [ ] 明确 derived SaaS starter 的正式场景与边界
- [ ] 从 application base starter 派生一个官方 SaaS starter
- [ ] 接入认证
- [ ] 接入数据库与迁移
- [ ] 接入 Redis
- [ ] 接入制品存储
- [ ] 接入模板发布后台最小后端逻辑
- [ ] 接入模板搜索、inspect、download 所需 API
- [ ] 接入 capability / provider / surface 的安装宿主能力
- [ ] 提供 Docker-first 启动与本地开发方案
- [ ] 补齐 Agent 说明、操作说明和运维说明

## 完成标准

- [ ] 该 derived starter 可以运行 Rendo headless runtime
- [ ] 该 starter 可以成为 Rendo 自己的第一套狗粮宿主
- [ ] 后续 CLI 和 runtime 的协议变更能首先在这套 starter 上被验证

