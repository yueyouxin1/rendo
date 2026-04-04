# Core Starter 接入 Rendo 能力的阶段策略

- 文档版本：v1.0
- 日期：2026-04-04
- 文档性质：实施策略文档
- 目标：说明 `Core Starter` 在什么阶段需要依赖 Rendo 能力、什么阶段只依赖本地契约和 mock、更真实的平台能力应如何逐步引入
- 核心结论：**`Core Starter` 应从第一天就按 Rendo 能力接入方式设计，但不应从第一天就真实依赖 Rendo 平台；正确路径是先做到 `Rendo-ready`，再逐步过渡到 `Rendo-backed`。**

---

## 1. 问题定义

在新定位下，`Core Starter` 既是：

- Rendo 全部模板体系的基础底座

也是：

- 后续所有 pack、registry、默认 provider、官方能力接入的工程起点

这会引出一个关键问题：

**`Core Starter` 什么时候应该开始依赖真实的 Rendo 平台能力？**

如果太早接：

- 会重新滑回先做平台

如果太晚接：

- 后面会发现 starter 和平台协议不匹配

所以需要一个清晰的阶段策略。

---

## 2. 结论先行

### 2.1 核心结论

`Core Starter` 从第一天就应该：

- **按 Rendo 能力接入方式设计**

但不应该从第一天就：

- **真实依赖 Rendo 平台能力**

### 2.2 更准确的表述

应采用两步策略：

1. **先做 `Rendo-ready`**
   - 契约先行
   - mock / local adapter 先行

2. **再做 `Rendo-backed`**
   - 把最关键的真实平台能力逐步替换进来

一句话：

**先依赖规范，不先依赖服务。**

---

## 3. 为什么不能一开始就接真实平台

## 3.1 因为当前最需要验证的是契约，不是服务端实现

在 `Core Starter` 早期阶段，真正最重要的是验证：

- starter 结构是否合理
- template manifest 是否合理
- pack manifest 是否合理
- install plan 是否合理
- CLI 是否自然
- runtime mode 语义是否清晰

这些问题本质上都属于：

- **契约问题**

而不是：

- 平台服务端问题

如果太早接真实平台，团队很容易把注意力转移到：

- API 联调
- 鉴权
- 部署
- 注册中心
- 运维

从而忽视真正该先解决的契约问题。

## 3.2 因为太早接真实后端会重新滑回“先做平台”

一旦后端能力先接进来，工程上就会自然出现大量平台型工作：

- registry
- API key
- 控制面
- 管理接口
- 后台

这会让团队很容易再次掉回：

- 先做平台，再做 starter

的路径。

## 3.3 因为强 Agent 的自然工作流应先在本地验证

starter 的首要目标之一是：

- 让强 Agent 在真实源码与容器环境中自然工作

这件事应该先在：

- 本地文件
- 本地 CLI
- 本地 install plan
- 本地 manifest

上验证顺不顺。  
否则即使真实平台接上，整体体验也可能是错的。

---

## 4. 为什么又不能一直停留在 mock

虽然不能太早接真实平台，但也不能永远停留在 mock。

原因是：

有些关键能力只有真实平台才能验证：

- `Rendo API Key`
- 官方 managed pack
- 默认 provider 托底
- 官方 registry
- 订阅与 entitlements
- 真实云端 Agent / Workflow / KB / Search 能力

这些都直接关系到：

- 默认最优解是否成立
- 商业模式是否成立
- 小白用户是否真能少配置

所以：

- mock 只能是阶段性手段
- 不能成为长期策略

---

## 5. 推荐的三阶段策略

## 阶段 A：本地契约阶段（`Rendo-ready`）

### 目标

先让 `Core Starter` 的工程结构和扩展机制站住。

### 应依赖什么

- 本地 `rendo.template.json`
- 本地 pack manifest
- 本地 CLI
- 本地 mock registry
- 本地 provider adapter
- 本地 install plan 执行器

### 不依赖什么

- 真实 Rendo API key
- 真实官方 registry
- 真实托管 pack
- 真实云端 Agent / Workflow

### 本阶段验收标准

1. starter 可初始化
2. manifest 可读
3. pack 可安装
4. Agent 能自然读懂和操作 starter

---

## 阶段 B：最小真实能力接入阶段（`partially Rendo-backed`）

### 目标

引入少量最关键的真实 Rendo 能力，验证平台托底是否可用。

### 应优先接入的真实能力

建议只接这些最关键能力：

1. `Rendo API Key`
2. 最小官方 registry
3. 最小官方 managed pack
4. 最小默认 provider

### 为什么只接这些

因为它们直接关系到：

- 默认最优解
- 小白用户体验
- 官方能力包托底

而不会立刻把团队拖进完整平台建设。

### 本阶段验收标准

1. `Core Starter` 能通过真实 key 使用最小官方能力
2. CLI 能同时处理本地 pack 和官方 pack
3. Managed / Source / Hybrid 语义开始接受真实验证

---

## 阶段 C：平台闭环接入阶段（`Rendo-backed`）

### 目标

在 starter、manifest、pack、CLI 已稳定后，再逐步接完整平台闭环。

### 可逐步接入的能力

- 模板 registry UI
- pack registry UI
- 授权
- 企业模板库
- 作者后台
- 订阅和治理系统

### 为什么放在最后

因为这些都属于：

- 平台功能面

它们必须建立在 starter 和最小真实能力已经成立的基础上。

---

## 6. `Core Starter` 当前必须先定义但不必真实实现的东西

即使早期不接真实平台，`Core Starter` 也必须先定义这些接口：

1. `provider` 抽象
2. `runtime mode` 抽象
3. `registry` 抽象
4. `pack source` 抽象
5. `API key` 配置入口
6. `managed capability` 接入点

原因：

- 否则后面很难平滑从 mock 切到真实后端

---

## 7. 推荐的工程实现方式

## 7.1 用 adapter / driver 统一入口

例如：

- `registryDriver`
- `providerDriver`
- `packInstaller`
- `managedCapabilityClient`

这样早期可指向：

- local mock

后期再指向：

- real rendo backend

## 7.2 用 local manifest 和 local cache 托底

即使未来有云端 registry，也应保留：

- 本地 manifest
- 本地 pack cache
- 本地 install plan

这样 Agent 才始终能以文件系统为主要工作对象。

---

## 8. 最终结论

`Core Starter` 与 Rendo 平台的关系，正确理解不是：

- 完全独立

也不是：

- 从第一天强绑定

而是：

- **先在契约层面对齐**
- **再在关键能力上最小接入**
- **最后再进入完整平台闭环**

一句话结论：

**先让 `Core Starter` 成为 `Rendo-ready`，再让它逐步成为 `Rendo-backed`。**
