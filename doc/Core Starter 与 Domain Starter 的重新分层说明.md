# Core Starter 与 Domain Starter 的重新分层说明

- 文档版本：v1.0
- 日期：2026-04-04
- 文档性质：Rendo 新定位下的核心脚手架分层说明
- 目标：明确 `Core Starter` 与 `Domain Starter` 的职责边界，说明为什么 `Core Starter` 不应默认采用 `Next.js`，以及为什么 `Next.js` 应作为某类 `Domain Starter` 的默认壳
- 核心结论：**`Core Starter` 应该是唯一的、最轻量的基础脚手架，不默认选择 `Next.js`、图形界面或前后端统一产品形态；`Next.js` 应降级为某些领域最佳实践模板的默认壳，而不是整个 Rendo 体系的唯一基础形态。**

---

## 1. 问题定义

在前面的讨论中，一个容易被忽略但非常关键的问题出现了：

**如果 `Core Starter` 被定义为唯一基础脚手架，那么它是否应该继续默认采用 `Next.js`？**

如果答案是“是”，那就意味着：

- Rendo 默认首先服务于 Web 产品
- 默认首先服务于图形界面场景
- 默认首先服务于前后端统一的 Web 应用

但现实中，很多有效用户和有效场景并不符合这个前提。

他们可能只需要：

- 一个本地代码工程
- 一个纯粹的 workflow 项目
- 一个 headless AI 服务
- 一个自动化工具工程
- 一个没有图形界面的内部流程系统

因此，这个问题不是技术偏好问题，而是：

- **Rendo 脚手架的根模型到底是什么**

---

## 2. 结论先行

### 2.1 结论

**`Core Starter` 不应该继续默认采用 `Next.js`。**

### 2.2 更准确的说法

`Core Starter` 应该是：

- 唯一的
- 最轻量的
- 最抽象的
- 与产品形态无关的

基础脚手架。

而 `Next.js` 应该被重新定位为：

- 某一类 `Domain Starter` 的默认壳

例如：

- `web-app-starter`
- `saas-starter`
- `ai-webapp-starter`

换句话说：

**`Core Starter` 定义“怎么长”，`Domain Starter` 定义“长成什么”。**

---

## 3. 为什么 `Core Starter` 不能默认是 `Next.js`

## 3.1 因为 `Next.js` 已经隐含了产品形态

一旦默认 `Next.js`，你实际上已经做了这些决定：

- 这是一个 Web 项目
- 它有图形界面
- 它有页面路由
- 它可能需要管理后台
- 它走 React Web 产品路径

这不是“基础脚手架”，而是：

- **某一种具体产品形态的脚手架**

## 3.2 因为很多有效场景根本不需要图形界面

在新定位下，Rendo 的模板不一定都应该是：

- SaaS 应用
- 带后台的 Web 产品
- AI 对话应用

它们也可能是：

- headless agent service
- workflow automation project
- code-first internal tool
- local automation runner

这些场景里，`Next.js` 不是自然起点。

## 3.3 因为唯一基础脚手架必须对“产品形态”保持中立

如果 `Core Starter` 是整个 Rendo 体系的唯一基础层，那么它必须尽量只回答：

1. 工程怎么组织
2. Agent 怎么理解工程
3. 能力怎么扩展
4. 默认运行环境怎么启动

而不应先回答：

1. 页面怎么组织
2. Web 路由怎么定义
3. 管理后台长什么样

这些都属于具体领域模板要回答的问题。

---

## 4. `Core Starter` 应该是什么

`Core Starter` 的职责应被重新定义为：

## 4.1 唯一基础骨架

它应该提供：

- Monorepo 结构
- TypeScript 工程约定
- package 组织方式
- lint / format / test 最小规范
- 环境变量规范
- Docker / devcontainer 基础入口

## 4.2 统一扩展机制

它应提供：

- 模板 metadata / manifest
- pack / capability 扩展约定
- provider / adapter 约定
- 初始化 CLI 基础

## 4.3 Agent 友好结构

它应默认包含：

- `AGENTS.md`
- `CLAUDE.md`
- Copilot instructions
- 可被 Agent 理解的目录和文档结构

## 4.4 最小默认能力入口

它可以提供：

- 配置层
- SDK 接入点
- provider 占位

但不应默认包含：

- 图形界面
- Web 后端
- 后台面板
- 具体数据库栈
- 具体 Auth / Billing / KB / Workflow 模块

---

## 5. `Domain Starter` 应该是什么

`Domain Starter` 是建立在 `Core Starter` 之上的具体产品形态脚手架。

它负责回答：

- 这个 starter 属于什么产品类型
- 默认采用什么前端壳
- 默认采用什么后端形态
- 默认包含哪些能力

### 典型示例

- `web-app-starter`
- `ai-webapp-starter`
- `saas-starter`
- `headless-agent-starter`
- `workflow-service-starter`
- `internal-tool-starter`

在这里，`Next.js` 才回到合理位置：

- 不是整个系统的唯一基础
- 而是某类领域模板的默认形态

---

## 6. 为什么这样分层更合理

## 6.1 避免唯一基础脚手架带有过强产品偏见

如果唯一基础层默认 `Next.js`，就等于默默宣布：

- Rendo 首先服务于 Web 应用

这会让其他场景天然成为“非主流”。

## 6.2 让 Rendo 覆盖更多真实需求

很多真实业务并不需要：

- 页面
- Web UI
- SaaS 后台

它们同样应该成为 Rendo 模板体系的一部分。

## 6.3 更符合强 Agent 的自然工作方式

强 Agent 可以很好地：

- 理解抽象工程骨架
- 选择领域模板
- 继续装 pack

这种组合式工作流比“所有东西都从 `Next.js` 开始”更自然。

## 6.4 更适合后续多端扩展

如果以后有：

- `Next.js` Web
- `Taro` 小程序
- `Expo` App
- `Tauri` 桌面壳

那么只有当最底层脚手架本身不偏某一个端，整个体系才容易扩展。

---

## 7. 与此前讨论的一致性

这个结论与前面已经达成的多项判断是完全一致的：

1. 不再以平台为主语，而以 starter 为主语
2. 运行时层优先采用成熟主流方案
3. 按领域和类型区分 starter
4. 采用轻量化和 pack 优先原则
5. 多前端壳共享统一后端与共享核心

从这个角度看，`Core Starter` 去掉 `Next.js` 只是把此前的逻辑再推进一步：

- 从“Next.js 是默认 starter”
- 变成“Next.js 是某类 starter 的默认壳”

---

## 8. 推荐的新分层模型

建议正式采用以下三层结构：

## 8.1 `Core Starter`

唯一基础层，负责：

- 工程组织
- 扩展机制
- Agent 说明
- CLI 基础
- Docker 基础入口

## 8.2 `Domain Starter`

领域层，负责：

- 产品形态
- 默认前端 / 后端壳
- 默认能力骨架

## 8.3 `Capability Pack`

能力层，负责：

- 数据库
- 缓存
- KB
- Agent
- Workflow
- Billing
- Channels
- Admin 模块

---

## 9. 实施建议

## 9.1 当前阶段

当前不应直接去定义“唯一 starter = Next.js starter”。  
应先：

1. 定义 `Core Starter`
2. 再选一个第一版 `Domain Starter`

## 9.2 第一版 Domain Starter

即使 `Core Starter` 不默认采用 `Next.js`，  
第一版 `Domain Starter` 仍然完全可以选择：

- `Next.js + AI Web App`

因为当前最现实、最容易落地的第一版仍然是 Web-first。

这两件事并不冲突：

- `Core Starter` 中立
- `第一版 Domain Starter` 用 `Next.js`

## 9.3 文档与工程需要同步调整

后续文档和实现都应避免再写：

- “唯一 starter 默认是 Next.js”

而应改成：

- “唯一 `Core Starter` 不绑定形态”
- “当前第一版 `Domain Starter` 采用 Next.js”

---

## 10. 最终结论

回到最初的问题：

**`Core Starter` 不应继续默认采用 `Next.js`。**

更合理的结构是：

- `Core Starter` 作为唯一基础脚手架，保持对产品形态中立
- `Next.js` 作为 `Web / SaaS / AI 应用` 这类 `Domain Starter` 的默认壳

一句话结论：

**`Core Starter` 负责定义底座，`Domain Starter` 负责定义形态；`Next.js` 应属于后者，而不应属于前者。**
