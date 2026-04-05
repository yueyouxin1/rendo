# Phase 6 - 生产级运行时与狗粮验证 TODO

## 目标

让 headless runtime 不只是能跑，而是能支撑生产级验证和 Rendo 自身狗粮。

## TODO

- [ ] 用官方 derived SaaS starter 承载 runtime
- [ ] 跑通 publish -> search -> inspect -> pull -> add -> upgrade 的完整闭环
- [ ] 建立本地 provider 与远程 provider 的一致性测试
- [ ] 建立数据库迁移与回滚策略
- [ ] 建立对象存储清理与版本保留策略
- [ ] 建立审计日志和操作记录
- [ ] 建立监控、告警和错误追踪
- [ ] 建立最小备份恢复方案
- [ ] 补齐安全边界：鉴权、授权、digest、访问控制

## 完成标准

- [ ] Rendo 自己的模板发布与消费依赖这套 runtime，而不是绕过它
- [ ] CLI、模板体系和 runtime 的契约不再频繁返工
- [ ] 主要故障都能被定位、回滚或恢复

