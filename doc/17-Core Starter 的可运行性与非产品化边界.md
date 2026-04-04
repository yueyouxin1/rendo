# Core Starter 的可运行性与非产品化边界

- 文档版本：v1.0
- 日期：2026-04-04
- 文档性质：边界定义文档
- 目标：说明 `Core Starter` 是否必须可运行、为什么它必须可运行、为什么它又不应演变成完整产品，以及其推荐的最小运行形态
- 核心结论：**`Core Starter` 必须可运行，但不应被定义为一个完整产品或默认图形界面模板。它应是一个“最小可运行的工程底座”，用于承载统一规范、CLI、manifest、pack 和 Rendo 能力接入验证。**

---

## 1. 问题定义

当 `Core Starter` 被定义为：

- 唯一基础脚手架
- 所有 `Starter Template` 的底座
- 强 Agent 理解和扩展的统一起点

就会自然出现一个问题：

**它到底是不是一个“可运行的东西”？**

如果答案是否定的，它就会更像：

- 一份规范文档
- 一个目录模板
- 一组抽象约定

如果答案是肯定的，又会担心：

- 它会不会慢慢变成一个完整产品
- 会不会和 `Starter Template` 职责重叠

这份文档就是为了解决这个边界问题。

---

## 2. 结论先行

### 2.1 结论

**`Core Starter` 必须可运行。**

### 2.2 但更准确的说法是

`Core Starter` 应是：

- **最小可运行**

而不是：

- **完整产品可运行**

### 2.3 一句话定义

`Core Starter` 不是给最终用户直接消费的产品，而是：

- 给 `Starter Template`
- 给强 Agent
- 给模板作者
- 给 starter / pack 协议

使用的“活底座”。

---

## 3. 为什么 `Core Starter` 必须可运行

如果 `Core Starter` 只是：

- 目录规范
- 文档
- 配置协议

但不能运行，那它会有几个严重问题。

## 3.1 强 Agent 无法把它当成真实工程起点

强 Agent 最自然的工作对象不是抽象文档，而是：

- 文件
- 配置
- 命令
- 可启动环境

如果 `Core Starter` 跑不起来，它就无法承担：

- Agent 理解工程
- Agent 修改配置
- Agent 验证 starter 结构

这些职责。

## 3.2 `Starter Template` 失去稳定底座

`Starter Template` 建立在 `Core Starter` 之上。
如果底座本身不活，后续 `Starter Template` 的很多问题就无法分辨：

- 是领域模板问题
- 还是底座问题

所以底座必须能被运行和验证。

## 3.3 Pack 机制也无法自然验证

如果 `Core Starter` 不可运行，就很难验证：

- pack 安装后是否真的生效
- manifest 与 install plan 是否合理
- runtime mode 语义是否通顺

所以为了验证协议，底座本身必须是活的。

---

## 4. 为什么它又不应该变成完整产品

如果把 `Core Starter` 做成：

- 完整 Web UI
- 完整后台
- 完整 Auth / Billing / KB / Agent / Workflow

那它就不再是底座，而已经变成：

- 某种 `Starter Template`

这会直接破坏分层。

## 4.1 会重新绑定产品形态

一旦默认有完整 UI 或后台，就等于在说：

- `Core Starter` 默认首先服务某种具体产品形态

这和“基础底座保持中立”的原则冲突。

## 4.2 会让 `Starter Template` 失去意义

如果底座本身就很像一个完整应用，那领域模板和底座之间的差异会越来越模糊。

## 4.3 会让 starter 重新变重

你前面已经确认：

- starter 必须轻
- 能力包应自然长能力

如果 `Core Starter` 自己先变重，就会再次陷入旧问题。

---

## 5. 正确的理解方式

`Core Starter` 的最佳理解不是：

- 一个基础模板

而是：

- **一个可启动、可进入、可验证、可扩展的工程底座**

它要同时满足两件事：

### A. 对工程而言是活的

- 能启动
- 能跑命令
- 有 Docker 环境
- 有最小 healthcheck
- 有最小配置入口

### B. 对产品而言是中立的

- 不默认绑定某种 UI
- 不默认绑定某种业务
- 不默认带重型后台
- 不默认带全部能力模块

---

## 6. 推荐的最小运行形态

推荐把 `Core Starter` 设计成：

## 6.1 Headless-first 的最小可运行底座

例如：

- 一个最小 TypeScript 工程
- 一个最小 CLI
- 一套 `manifest`
- 一套 pack 入口
- 一个最小 Docker / compose
- 一个 health route 或 health command
- 一个 provider 配置入口

这类形态的好处是：

- 对 Agent 自然
- 不绑定具体 UI
- 足够轻

## 6.2 可选：极轻的可视壳

如果确实需要一点可视反馈，可以有：

- 一个极轻的 shell
- 只显示 starter 状态 / config 状态 / docs 入口

但它绝不能演化成：

- 默认产品页面
- 默认管理后台

否则就越界了。

---

## 7. `Core Starter` 应该至少包含什么

最小可运行底座至少应包含：

1. Monorepo 基础结构
2. `packages/contracts`
3. `packages/domain`
4. `packages/sdk`
5. `packages/config`
6. `rendo.template.json`
7. `AGENTS.md`
8. `CLAUDE.md`
9. `.github/copilot-instructions.md`
10. Docker / compose 基础入口
11. 最小 CLI
12. 最小 healthcheck

这些已经足以让它成为：

- 活底座

但还不足以让它变成：

- 完整产品

---

## 8. 与 `Starter Template` 的关系

## `Core Starter`

负责：

- 工程底座
- 扩展机制
- 统一契约

## `Starter Template`

负责：

- 产品形态
- 默认前端壳
- 默认后端壳
- 默认能力骨架

所以：

- `Core Starter` 可运行，但不是最终产品
- `Starter Template` 才是用户更直接感知的 starter

---

## 9. 最终结论

回到最初的问题：

**`Core Starter` 必须可运行。**

但这里的“可运行”应被理解为：

- 可启动
- 可验证
- 可扩展
- 可被 Agent 当成真实工程处理

而不是：

- 默认就是一个完整可交互产品

一句话结论：

**`Core Starter` 应该是“最小可运行的工程底座”，而不是“最小可交付的产品模板”。**
