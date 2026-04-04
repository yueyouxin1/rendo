# Rendo Template Manifest 规范

## 文档目标

定义 `rendo.template.json` 的最小字段与语义，使平台、CLI、强 Agent 和人类用户都能统一理解一个 starter 模板。

---

## 1. 为什么需要 Template Manifest

starter 不是普通代码仓。  
如果没有结构化 metadata，平台和 Agent 将无法清楚知道：

- 这是什么 starter
- 适合什么场景
- 默认依赖什么
- 需要什么 pack
- 是否有 UI
- 是否支持多端

所以每个 starter 必须有统一 manifest。

---

## 2. 最小结构建议

```json
{
  "id": "ai-webapp-starter",
  "name": "AI Web App Starter",
  "version": "1.0.0",
  "type": "domain-starter",
  "category": "ai-webapp",
  "title": "AI Web App Starter",
  "description": "用于构建 AI-native Web 应用的 starter",
  "uiMode": "web",
  "runtimeModes": ["source", "managed", "hybrid"],
  "defaultProviders": {
    "agent": "rendo-default",
    "workflow": "rendo-default",
    "auth": "better-auth",
    "db": "postgres",
    "cache": "redis"
  },
  "recommendedPacks": [],
  "requiredEnv": [],
  "supports": {
    "web": true,
    "miniapp": false,
    "mobile": false,
    "desktop": false
  }
}
```

---

## 3. 核心字段说明

## 3.1 标识字段

- `id`
- `name`
- `version`
- `title`

用于：

- 平台展示
- CLI 拉取
- 版本升级

## 3.2 类型字段

- `type`
  - `core-starter`
  - `domain-starter`

- `category`
  - `web-app`
  - `saas`
  - `ai-webapp`
  - `headless-agent`
  - `workflow-service`
  - `internal-tool`

## 3.3 说明字段

- `description`

用于：

- 人类理解 starter 作用
- Agent 进行 starter 选择

## 3.4 形态字段

- `uiMode`
  - `none`
  - `web`
  - `miniapp`
  - `mobile`
  - `multi`

用于说明：

- 这个 starter 是否默认带图形界面

## 3.5 运行模式字段

- `runtimeModes`
  - `source`
  - `managed`
  - `hybrid`

说明 starter 当前默认支持哪些运行模式。

## 3.6 默认 provider 字段

- `defaultProviders`

用于说明：

- agent 默认 provider
- workflow 默认 provider
- auth 默认 provider
- db 默认 provider
- cache 默认 provider

这对：

- CLI 初始化
- 平台展示
- Agent 自动配置

都很关键。

## 3.7 推荐 pack 字段

- `recommendedPacks`

用于说明：

- 这个 starter 常见搭配哪些能力包

## 3.8 环境变量字段

- `requiredEnv`

用于说明：

- 启动该 starter 必须提供哪些 env

## 3.9 多端支持字段

- `supports`

用于说明：

- 是否支持 web
- 是否支持 miniapp
- 是否支持 mobile
- 是否支持 desktop

---

## 4. Manifest 的作用边界

Template Manifest 不应承担：

- 所有业务逻辑定义
- 所有 pack 安装规则
- 所有部署配置细节

它只负责：

- **描述 starter 是什么**
- **告诉 Agent 和平台如何理解它**

更细的安装规则应在：

- pack manifest
- CLI install 计划
- docs

中定义。

---

## 5. Agent 使用时的最低要求

强 Agent 在读取 template manifest 时，至少应能据此判断：

1. 是否适合当前任务
2. 是否需要 UI
3. 默认依赖什么
4. 还需要装哪些 pack
5. 需要什么 env
6. 是否支持目标端

---

## 6. 最终结论

如果 starter 没有统一 template manifest，它就无法被：

- 平台自然管理
- CLI 自然初始化
- 强 Agent 自然理解

一句话结论：

**`rendo.template.json` 是 starter 的最小身份卡，而不是可有可无的附属文件。**
