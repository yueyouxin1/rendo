# Rendo CLI 作为默认最优解入口的定位与实现边界

- 文档版本：v1.0
- 日期：2026-04-04
- 文档性质：产品与工程边界说明
- 目标：明确 `rendo cli` 在新定位中的角色，说明为什么它是第一个默认最优解入口、用户绕过它会失去什么，以及它应作为独立工具还是 `Core Starter` 的一部分
- 核心结论：**`rendo cli` 应被视为 Rendo 面向用户和强 Agent 的第一个默认最优解入口。用户当然可以绕开它直接修改源码或手工集成，但那会失去 Rendo 在 starter 初始化、pack 安装、默认 provider 接入、升级和诊断上的核心便利性。`rendo cli` 应作为独立工具存在，由 `Core Starter` 约束其协议，但不应被埋入 `Core Starter` 内部。**

---

## 1. 为什么现在必须重视 `rendo cli`

在当前新定位下，Rendo 不再首先是一个平台 UI，也不再首先是一个 runtime。  
它首先是：

- starter 资产体系
- pack 能力生态
- 默认最优解体验

而这三者之间，最自然的统一入口不是：

- 平台页面
- SDK API
- 纯源码文档

而是：

- **CLI**

因为 CLI 同时满足：

1. 对人类用户足够简单
2. 对强 Agent 足够自然
3. 对本地源码工程足够贴近
4. 对 starter / pack / provider 的协议最容易统一

一句话：

**在 Rendo 体系里，CLI 不是附属工具，而是最先成立的产品入口。**

---

## 2. `rendo cli` 是否是第一个默认最优解

## 2.1 结论

**是。**

而且它很可能就是新 Rendo 最早、最真实、最重要的默认最优解。

## 2.2 为什么成立

因为用户和强 Agent 最先遇到的问题不是：

- 平台界面长什么样
- 市场页怎么设计
- SaaS 管理后台怎么组织

而是：

- 怎么创建 starter
- 怎么启动 starter
- 怎么装能力包
- 怎么接默认 provider
- 怎么升级模板
- 怎么排查环境问题

这些问题最适合由 CLI 统一解决。

## 2.3 它的默认最优解价值来自哪里

`rendo cli` 的默认最优解价值主要来自：

1. **初始化最省事**
   - `rendo create`

2. **扩展最自然**
   - `rendo search / inspect / add`

3. **默认 provider 最顺**
   - 自动生成配置
   - 自动接入默认能力

4. **升级和维护最一致**
   - `rendo upgrade`

5. **诊断最友好**
   - `rendo doctor`

所以，CLI 并不是“包装一堆脚本”，而是：

- **把复杂 starter 和 pack 生态压缩成一个可执行入口**

---

## 3. 用户不使用 `rendo cli` 会怎样

## 3.1 可以不用

用户当然可以：

- 直接下载源码
- 手工修改工程
- 手工安装 pack
- 手工配置 provider
- 让 Agent 直接改文件

也就是说：

- `rendo cli` 不应成为强制依赖

## 3.2 但会失去很多便利性

如果绕开 CLI，用户和 Agent 往往会失去：

### A. Starter 初始化便利

- 不再有统一创建流程
- 需要自己理解目录结构和配置入口

### B. Pack 安装便利

- 需要手工看 manifest
- 需要自己改文件
- 需要自己补 env 和 migration

### C. 默认 provider 接入便利

- 需要自己理解什么是默认最优解
- 需要自己决定怎么接官方能力

### D. 升级便利

- 没有统一 `upgrade` 路径
- 很难做兼容升级

### E. 诊断便利

- 没有统一 `doctor`
- 环境问题和 starter 问题更难定位

所以更准确的说法不是：

- “不用 CLI 就不能开发”

而是：

- **“不用 CLI 仍然能开发，但会失去 Rendo 最重要的一层默认最优解。”**

---

## 4. 为什么 `rendo cli` 对用户和强 Agent 都很重要

## 4.1 对小白用户

CLI 的价值不是让小白“懂命令行”，而是：

- 把复杂操作压缩成极少量固定动作

例如：

- `rendo create`
- `rendo add`
- `rendo doctor`

小白用户即使自己不直接敲 CLI，也可以：

- 跟着向导
- 或让 Agent 调用 CLI

## 4.2 对强 Agent

CLI 对强 Agent 更重要，因为它能提供：

- 统一且可预测的入口
- 统一命令语义
- 统一错误输出
- 统一 install / upgrade 机制

Agent 最喜欢处理的是：

- 文件
- 命令
- 结构化输出

CLI 恰好同时满足这三点。

## 4.3 对平台未来

CLI 还能反过来统一：

- starter contract
- pack contract
- runtime mode
- 默认 provider 体验

也就是说，CLI 不是只服务当前，而是在帮未来平台做协议统一。

---

## 5. `rendo cli` 应该放在 `Core Starter` 里还是独立做

## 5.1 结论

**应独立做。**

### 更准确的说法

- `Core Starter` 定义 CLI 应理解什么
- `rendo cli` 作为独立工具去实现这些协议

不能反过来：

- 把 CLI 埋进 `Core Starter` 里

## 5.2 为什么不能埋在 `Core Starter` 里

如果 CLI 被当成 `Core Starter` 的内部脚本，会带来几个问题：

### A. 它会失去平台级入口属性

CLI 其实服务的不只是一个 starter，而是：

- 所有 starter
- 所有 pack
- 所有 provider 模式
- 后续的平台能力

所以它不应只是模板里的一个工具脚本。

### B. 它会失去独立演化能力

CLI 未来很可能会持续演化：

- registry 交互
- auth / api key
- doctor
- upgrade
- enterprise features

这说明它应是一个独立产品面，而不是模板附属。

### C. 它会让 `Core Starter` 变重

`Core Starter` 的角色是：

- 唯一最轻的基础底座

如果把 CLI 实现绑进去，`Core Starter` 的边界就会变糊。

## 5.3 为什么又必须和 `Core Starter` 强关联

虽然 CLI 应独立，但它必须与 `Core Starter` 强绑定在协议层。

即：

- `Core Starter` 定义：
  - manifest
  - runtime modes
  - pack 约定
  - 目录规范

- `rendo cli` 负责：
  - 读取
  - 创建
  - 安装
  - 升级
  - 诊断

这是一种：

- **协议绑定**

而不是：

- **实现耦合**

---

## 6. 推荐的工程组织方式

最自然的做法是：

```txt
rendo/
├── packages/
│   ├── core-starter-contract/
│   ├── template-contract/
│   ├── pack-contract/
│   └── cli/
```

或者：

```txt
rendo/
├── core-starter/
├── domain-starters/
├── packs/
└── cli/
```

关键点在于：

- CLI 独立包
- 但它直接依赖 starter / template / pack 的协议层

---

## 7. `rendo cli` 的第一阶段职责

在第一阶段，不应把 CLI 想得太重。  
它最少应做好：

### 1. 创建 starter

- `rendo create`

### 2. 搜索和查看能力

- `rendo search`
- `rendo inspect`

### 3. 安装和升级 pack

- `rendo add`
- `rendo upgrade`

### 4. 环境诊断

- `rendo doctor`

这四组动作已经足以让它成为：

- 第一个默认最优解入口

---

## 8. 为什么现在就要把 CLI 提升到高优先级

如果不这么做，后面几乎一定会出现：

1. starter 初始化方式越来越散
2. pack 安装方式越来越散
3. Agent 接入方式越来越散
4. provider 配置越来越散

最终会导致：

- 文档越来越多
- 实际入口越来越乱
- 用户和 Agent 的体验越来越不统一

所以：

**越早把 CLI 做成一级概念，越能给整个体系收口。**

---

## 9. 最终结论

回到最初的问题：

### 1. `rendo cli` 是不是第一个默认最优解？

**是。**

### 2. 用户不用它还能继续开发吗？

**可以，但会失去 Rendo 提供的很多关键便利性。**

### 3. 它应该做在 `Core Starter` 内部还是单独拆出来？

**应该独立拆出来做，但必须严格遵循 `Core Starter` 定义的契约。**

一句话结论：

**`rendo cli` 应被当成独立产品入口来设计，而不是 starter 的附属脚本；它是 Rendo 最早、最重要的默认最优解之一。**
