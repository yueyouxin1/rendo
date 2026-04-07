# 多端预留与客户端策略 TODO

## 目标

`application/saas-starter` 必须是 `multi-surface-by-default`。

## 默认 surface

- [ ] `web`：完整实现
- [ ] `miniapp`：一等预留
- [ ] `mobile`：一等预留
- [ ] `desktop`：一等预留

## 推荐路线

- [ ] `web` 采用 `Next.js`
- [ ] `miniapp` 路线冻结为 `Taro (React)`
- [ ] `mobile` 路线冻结为 `React Native + Expo`
- [ ] `desktop` 路线冻结为保留位，后续优先 `Electron` 派生

## 共享层

- [ ] 统一共享 contracts / API client / auth model / design token
- [ ] 统一共享 locale / i18n message model / number-date-currency formatting strategy
- [ ] 不用“一套 UI 代码硬跑所有端”伪装成多端最佳实践
- [ ] 每个端都明确自己与 canonical API / MCP / worker 的关系

## 最小交付

- [ ] `src/apps/miniapp` 存在并有 README、接线说明、最小 client 占位
- [ ] `src/apps/mobile` 存在并有 README、接线说明、最小 client 占位
- [ ] `src/apps/desktop` 存在并有 README、接线说明、最小 client 占位
- [ ] 文档明确说明当前优先完整实现 `web`，其他端为一等预留而非被忽略
- [ ] 文档明确说明多端共享 locale 与 design token，而不是复制粘贴界面文案

## 完成标准

- [ ] 后续扩展小程序、APP、桌面端时不需要推翻基座
- [ ] 多端预留不是口头承诺，而是目录、契约和接线层面真实存在
