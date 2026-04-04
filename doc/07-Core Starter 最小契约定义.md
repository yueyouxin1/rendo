# Core Starter 最小契约定义

## 文档目标

定义 `Core Starter` 必须包含什么、不包含什么，以及它作为所有 Rendo 模板唯一基础底座的最小契约。

---

## 1. `Core Starter` 的角色

`Core Starter` 不是业务模板，不是 Web 应用，不是 SaaS 模板，也不是 headless 服务模板。  
它是：

- 所有 `Starter Template` 的统一底座
- 所有模板作者、强 Agent、扩展能力都必须遵守的最小工程规范

一句话：

**`Core Starter` 定义“怎么长”，不定义“长成什么业务形态”。**

---

## 2. `Core Starter` 必须包含什么

## 2.1 工程结构契约

必须定义：

- 项目目录规范
- Monorepo 组织方式
- 包边界
- 环境变量命名约定
- 启动和开发命令约定

## 2.2 模板元数据契约

必须包含：

- `rendo.template.json`
- 模板 id / name / version
- starter type
- runtime modes
- capability template 依赖声明

## 2.3 Agent 指令契约

必须包含：

- `AGENTS.md`
- `CLAUDE.md`
- `.github/copilot-instructions.md`

这些文件至少要统一说明：

- 目录结构
- 扩展点
- pack 安装方式
- 配置入口

## 2.4 CLI / 初始化契约

必须定义：

- `rendo create`
- `rendo inspect`
- `rendo add`
- `rendo upgrade`

这些命令至少在接口语义上统一。

## 2.5 容器化契约

必须定义：

- Docker / compose 最小入口
- devcontainer 或等价远程工作区入口
- 健康检查和默认端口约定

## 2.6 配置与 provider 契约

必须定义：

- 默认 provider 配置位置
- source / managed / hybrid 的语义
- 官方 pack 与外部 pack 的依赖声明方式

---

## 3. `Core Starter` 明确不包含什么

不默认包含：

- Web UI
- Next.js
- Taro
- Expo
- Tauri
- 数据库实现
- Redis
- 向量数据库
- Auth / Billing / KB / Agent / Workflow 具体实现
- 具体业务页面
- 后台管理面板

这些都属于：

- `Starter Template`
- 或 `Capability Template`

---

## 4. `Core Starter` 的最小目录建议

```txt
core-starter/
├── packages/
│   ├── contracts/
│   ├── domain/
│   ├── sdk/
│   ├── config/
│   └── utils/
├── agents/
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   └── copilot-instructions.md
├── docs/
│   ├── structure.md
│   ├── extension-points.md
│   └── runtime-modes.md
├── rendo.template.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 5. 最终结论

`Core Starter` 应该足够轻，以至于：

- 所有领域模板都愿意建立在它之上
- 强 Agent 能快速理解它
- 后续任何 starter 都能共享同一套工程语言

一句话结论：

**`Core Starter` 是统一工程语言，不是产品模板。**
