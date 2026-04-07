# Rendo Capability Template 安装计划与文件变更规则

## 文档目标

定义 `Capability Template` 在安装、升级、移除时如何表达文件变更、配置变更和工程影响范围，确保人类、CLI 和强 Agent 都能明确理解该模板会做什么。

---

## 1. 为什么需要安装计划

如果 capability template 只是一个“黑盒安装动作”，会立刻产生问题：

- 用户不知道模板改了什么
- Agent 无法安全评估是否应自动安装
- Git diff 与 review 不自然
- 模板升级容易破坏工程结构

因此，Rendo capability template 必须有：

- **结构化 integration plan**

一句话：

**capability template 不是直接“执行”，而是先声明再执行。**

---

## 2. integration plan 的职责

integration plan 必须回答以下问题：

1. 会新增哪些文件
2. 会修改哪些文件
3. 会删除哪些文件
4. 是否会修改数据库
5. 是否会新增环境变量
6. 是否会新增路由 / 页面 / 组件
7. 是否会新增后台菜单
8. 是否会新增 worker / workflow / webhook

这些信息必须在执行前对：

- 用户
- Agent
- CLI

都是可见的。

并且要明确区分：

- manifest `assetIntegration.modes[].targetRoot`：机器可读、可执行的物理集成根目录
- 历史 template-local `install/` 接入说明语义统一更名为 `integration/`
- `integration/`：人类与 Agent 可读的接入步骤、宿主影响与变更解释

---

## 3. manifest `assetIntegration` 最小字段建议

建议每个 capability template manifest 中包含：

```json
{
  "assetIntegration": {
    "modes": [
      {
        "targetRoot": "src/capabilities/",
        "plan": {
          "addsFiles": [],
          "updatesFiles": [],
          "deletesFiles": [],
          "addsEnv": [],
          "addsRoutes": [],
          "addsPages": [],
          "addsComponents": [],
          "addsMigrations": false,
          "addsWorkerTasks": false,
          "addsAdminModules": false,
          "requiresManualSetup": false
        }
      }
    ]
  }
}
```

---

## 4. 文件变更规则

### 4.1 允许的变更类型

capability template 安装默认只允许做以下几类可预测变更：

1. 新增文件
2. 修改明确声明的文件
3. 修改 starter manifest / config
4. 新增 migration
5. 新增 UI / 页面 / 后台模块

### 4.2 不允许的默认行为

capability template 默认不应：

1. 大面积重写用户业务代码
2. 修改未声明的核心文件
3. 静默删除关键文件
4. 修改用户未授权的配置

### 4.3 必须保持的原则

capability template 应尽量做到：

- 低侵入
- 可回滚
- 可 diff
- 可 review

---

## 5. 数据库相关规则

如果 capability template 涉及数据库，必须明确：

1. 是否新增表
2. 是否修改 schema
3. 是否新增 seed
4. 是否需要手动数据迁移

### 原则

- 默认允许新增 migration
- 不默认允许高风险 destructive migration

若涉及高风险 migration，integration plan 必须明确标注：

- `requiresManualSetup: true`

---

## 6. 后台与 UI 注入规则

如果 capability template 提供：

- 管理面板
- 设置页
- 列表页
- 菜单项

则必须明确：

1. 新增了哪些页面
2. 新增了哪些导航入口
3. 新增了哪些权限需求

这有助于：

- 用户理解能力边界
- Agent 正确接线

---

## 7. 环境变量与 provider 变更规则

如果 capability template 需要新增：

- API key
- webhook secret
- OAuth config
- provider endpoint

则必须显式列入：

- `addsEnv`

并应同时提供：

- 默认说明
- 是否可由 Rendo API key 托底
- 是否必须用户自己完成授权

---

## 8. `requiresManualSetup` 的意义

这是一个关键布尔值，用来告诉：

- CLI
- Agent
- 人类用户

该模板是否存在不可自动化完成的步骤。

例如：

- 飞书开放平台配置
- 微信开放平台授权
- 支付主体审核
- 某些企业 API 授权

有了这个标志，Agent 才不会盲目自动安装后陷入死局。

### 8.1 服务基座入口面的影响

对于当前新定位，还必须显式说明该 capability template 是否会影响宿主中的：

- `AGENTS.md`
- `CLAUDE.md`
- `.agents/skills/*/SKILL.md`
- `interfaces/openapi/`
- `interfaces/mcp/`
- `interfaces/skills/`
- `integration/`
- `ops/`（仅当宿主或模板属于 `standalone-runnable`）

如果会影响，必须把影响方式写进 integration plan，而不能让 Agent 通过猜测完成接线。

---

## 9. 升级与移除规则

integration plan 不只在安装时重要，在升级和移除时也应沿用同一套结构化规则。

### 升级时

必须明确：

- 新增了什么
- 替换了什么
- 是否有 breaking changes

### 移除时

必须明确：

- 会删什么
- 是否影响数据库
- 是否保留数据和配置

---

## 10. 最终结论

Capability template 生态要成立，`integration plan` 就必须成为：

- 单一事实来源
- 安全边界描述
- Agent 自动化判断依据

一句话结论：

**没有结构化的安装计划，capability template 就无法做到真正自然、低侵入和可持续扩展。**
