# Rendo Capability Template Manifest 最小规范

## 文档目标

定义 `Capability Template` 的最小 manifest 结构与语义，使 starter 服务基座、CLI、平台和强 Agent 都能以统一方式理解和操作该类模板资产。

---

## 1. 设计原则

Capability template manifest 必须满足：

1. 人和 Agent 都能理解
2. 能清晰描述安装影响面
3. 能描述运行模式
4. 能表达依赖和权限
5. 能支持升级与移除

---

## 2. 最小字段

建议最小字段如下：

```json
{
  "name": "company-query-pack",
  "version": "1.0.0",
  "title": "企业信息查询工具",
  "type": "tool-pack",
  "runtimeMode": "hybrid",
  "provider": "rendo",
  "description": "企业信息查询相关能力包",
  "dependencies": [],
  "requiredEnv": ["RENDO_API_KEY"],
  "permissions": [],
  "billing": {
    "mode": "subscription"
  },
  "install": {
    "modifiesFiles": [],
    "addsRoutes": [],
    "addsPages": [],
    "addsMigrations": false
  }
}
```

---

## 3. 核心字段语义

## 3.1 `type`

推荐类型：

- `tool-pack`
- `workflow-pack`
- `workflow-node-pack`
- `channel-pack`
- `admin-pack`
- `data-pack`
- `agent-pack`

## 3.2 `runtimeMode`

允许值：

- `source`
- `managed`
- `hybrid`

## 3.3 `provider`

用于区分：

- `rendo`
- `community`
- `third-party`

## 3.4 `requiredEnv`

显式列出安装或运行所需环境变量。

## 3.5 `install`

必须说明：

- 改哪些文件
- 增哪些页面
- 增哪些路由
- 是否涉及 migration

---

## 4. Agent 使用时必须可见的信息

强 Agent 在 `search / inspect / add / upgrade` 时，至少必须能看到：

- 模板的名字与描述
- 模板的类型
- 运行模式
- 依赖
- 需要的环境变量
- 安装会影响哪些文件
- 是否会修改数据库
- 是否是官方 provider
- 是否会影响宿主中的 `.agent` / `api` / `mcp` / `skills`

---

## 5. 与 CLI 的关系

Capability template manifest 必须直接驱动：

- `rendo inspect`
- `rendo add`
- `rendo upgrade`
- `rendo remove`

也就是说，manifest 不是展示信息，而是：

- install plan 的单一事实来源

---

## 6. 最终结论

Capability template manifest 必须足够小、足够明确、足够结构化。

一句话结论：

**Capability template 如果没有统一 manifest，就不可能形成自然可扩展的能力包生态。**
