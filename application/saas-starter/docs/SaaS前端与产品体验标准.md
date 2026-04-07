# SaaS 前端与产品体验标准

> 文档定位：把 `application/saas-starter` 的产品门面、管理端体验、前端技术补充和多语言/动效规则冻结成可执行标准。
>
> 本文不是 UI 灵感草稿，而是当前独立工作区内给人类与 Agent 共用的前端 source of truth。

---

## 1. 前端总方向

### 1.1 Visual thesis

默认视觉方向是：

- `Vercel` 风格的克制、锐利、专业云服务商界面
- 明亮浅色主题优先
- 大留白、少颜色、强层级
- 首屏避免堆砌卡片和仪表盘拼贴

第一屏必须像一张产品海报，而不是组件目录。

### 1.2 Content plan

默认 public-facing 门面按四段结构组织：

1. Hero：品牌、价值主张、主 CTA、一个主视觉锚点
2. Support：一个最关键能力或差异点
3. Detail：工作流、产品深度或可信度
4. Final CTA：注册、试用、升级或联系销售

默认 app/admin 面则按 utility UI 组织：

1. 当前对象或工作区上下文
2. 状态 / 指标 / 列表 / 任务
3. 可执行操作
4. 配置、日志或辅助上下文

### 1.3 Interaction thesis

从 day one 必须具备 3 类动效：

1. 首屏进入动效：分层 reveal，不用花哨装饰动画
2. 关键操作动效：抽屉、弹层、切换、保存反馈
3. 滚动或悬停动效：用来建立层级和氛围，而不是制造噪音

---

## 2. 前端技术补充

在主技术栈之外，前端默认补充冻结为：

- `Geist Sans + Geist Mono`
- `next-intl`
- `next-themes`
- `motion/react`
- `lucide-react`

### 2.1 字体

默认字体系统：

- 正文字体：`Geist Sans`
- 等宽字体：`Geist Mono`

原因：

- 和 Vercel 风格更一致
- 字重、数字、代码和控制台场景都更稳定
- 适合 marketing 与 app/admin 共用

### 2.2 i18n

默认从第一天做好多语言：

- 默认 locale：`zh-CN`
- 第一 fallback locale：`en`
- 任何用户可见文案都不得硬编码为单语常量
- 日期、数字、价格、配额都必须通过 `Intl` 体系格式化

默认建议：

- `src/packages/config/i18n/` 维护 locale 配置
- `src/packages/contracts` 与 `src/packages/application` 不直接嵌入显示文案
- `web / admin / pricing / billing / onboarding` 共用同一套 locale 策略

### 2.3 Theme

默认主题策略：

- `shadcn/ui` 浅色主题为默认体验
- 支持多色彩主题切换
- 深色主题不是第一优先级，但结构上必须可扩展

禁止：

- 紫色渐变白底的通用 AI 模板风格
- 一页内多个强竞争的强调色
- 首页和管理端使用完全不同的设计语言

### 2.4 Motion

默认使用：

- `motion/react`

规则：

- 所有主要动效必须支持 `prefers-reduced-motion`
- 不能让 dashboard / admin 常用操作因为动效变慢
- 不允许用动效掩盖信息架构问题

建议默认实现：

- 首屏 stagger reveal
- 导航抽屉 / modal / sheet presence animation
- hover / press / save / loading 的微交互反馈

---

## 3. 功能面细化

### 3.1 Public-facing 门面

默认必须规划这些页面：

- landing
- pricing
- login / signup
- onboarding
- billing / usage
- help / docs entry
- error / empty / loading states

### 3.2 Product app

默认必须规划这些工作面：

- dashboard 首页
- 项目列表
- 项目详情
- 使用量与限额
- 订阅与账单
- workspace / tenant settings

### 3.3 Admin

默认必须规划这些管理面：

- 用户管理
- 组织 / 工作区管理
- 角色与权限
- 审计日志
- 行为记录
- 系统健康与观测
- 产品 / 套餐 / entitlement 配置
- 支付 / 订阅配置
- 数据库 / 存储 / 邮件 / 队列配置

---

## 4. 设计约束

默认遵循这些设计约束：

- Hero 不用卡片拼贴做主视觉
- 首页不先上“统计卡片矩阵”
- 产品 UI 默认以布局、排版和层级组织，而不是全卡片化
- 管理端文案优先 utility copy，不写营销口号
- 任何失败路径必须可见、可理解、可操作
- 未配置支付、存储、数据库、邮件时，要显式报错，不可静默失败

---

## 5. 验收线

只有同时满足以下条件，才算前端与产品体验达到当前基线：

1. `zh-CN` 与 `en` 的 i18n 结构已从 day one 存在。
2. 默认主题、字体、颜色和动效规则已冻结。
3. public-facing 门面、app、admin 三类界面职责已经明确。
4. 默认视觉方向不再退化成 generic SaaS card grid。
5. 关键状态和失败路径的反馈策略已写清楚并进入 TODO。
