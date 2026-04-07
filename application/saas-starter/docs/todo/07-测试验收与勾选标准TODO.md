# 测试验收与勾选标准 TODO

## 目标

定义 `application/saas-starter` 的最终验收闭环，确保实现完成后能真实回勾，而不是口头宣称完成。

## 必做测试

- [ ] unit tests
- [ ] contract tests
- [ ] integration tests
- [ ] Playwright smoke / e2e
- [ ] API / MCP 基础验证
- [ ] auth / tenant / billing / queue / storage 基础验证
- [ ] docker 启动与健康检查验证

## UI 与体验验收

- [ ] 默认门面达到专业 SaaS 观感
- [ ] 管理端完整可进入和操作
- [ ] 默认中文 (`zh-CN`) 与英文 fallback (`en`) 文案结构已存在
- [ ] 默认主题、字体和 Motion 策略已落地
- [ ] 所有关键错误场景都有显式反馈
- [ ] 未配置商业化功能时有优雅弹窗错误，不静默失败

## 文档与勾选闭环

- [ ] 所有实现完成的事项必须回勾本目录 TODO
- [ ] 同步回勾 `docs/todo/README.md` 中对应的上层事项
- [ ] 若有延期项，必须显式写明原因与后置阶段

## 最终成功定义

- [ ] `application/saas-starter` 可以被直接视为高质量、专业、可生产演进的 SaaS 基座
- [ ] 当前阶段不依赖任何 runtime / 平台化实现也能独立证明其价值
- [ ] docker 开箱即用
- [ ] 验收通过后，本目录和上层 `todo` 都已完成回勾
