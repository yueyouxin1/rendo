# Rendo CLI 最小协议定义

## 文档目标

定义 `Rendo CLI` 的最小命令集合、输入输出语义和行为边界，使 starter、template、能力模板、Agent 与平台之间存在统一入口。

---

## 1. CLI 的角色

Rendo CLI 不只是一个初始化脚本。  
它应成为：

- starter 初始化入口
- template 拉取入口
- pack 操作入口
- Agent 可调用入口
- 本地工作区与远程能力之间的桥梁

一句话：

**CLI 是 Rendo 生态最小的控制面。**

---

## 2. 最小命令集合

第一版建议至少定义以下命令：

## 2.1 `rendo init`

用途：

- 初始化 `Core Starter`
- 用于从统一底座开始搭建 starter 或工程

典型用法：

```bash
rendo init
rendo init my-starter
```

## 2.2 `rendo create`

用途：

- 从 `Starter Template` 创建一个真正可用的项目

典型用法：

```bash
rendo create
rendo create ai-webapp-starter
rendo create application --surfaces web
rendo create application --surfaces web,miniapp
rendo create --from https://rendo.com/template/ai-webapp-starter
```

## 2.3 `rendo search`

用途：

- 搜索 starter 或能力模板

典型用法：

```bash
rendo search --type starter --keyword "saas"
rendo search --type capability-template --keyword "企业信息查询"
```

## 2.4 `rendo inspect`

用途：

- 查看 starter 或能力模板的元数据、依赖、运行模式、安装影响面

典型用法：

```bash
rendo inspect ai-webapp-starter
rendo inspect company-query-capability-template
```

## 2.5 `rendo add`

用途：

- 向当前工程安装能力模板

典型用法：

```bash
rendo add company-query-capability-template
```

## 2.6 `rendo pull`

用途：

- 拉取 starter / 能力模板的源码或本地 cache

典型用法：

```bash
rendo pull ai-webapp-starter
rendo pull company-query-capability-template
```

## 2.7 `rendo upgrade`

用途：

- 升级 starter 或能力模板

典型用法：

```bash
rendo upgrade
rendo upgrade company-query-capability-template
```

## 2.8 `rendo doctor`

用途：

- 检查当前 starter 的环境、配置、依赖和安装状态

典型用法：

```bash
rendo doctor
```

---

## 3. 命令行为原则

## 3.1 默认交互式

对人类用户：

- 默认应有交互式流程
- 帮助用户选择 starter / 能力模板 / provider

## 3.2 支持非交互式

对强 Agent：

- 必须支持参数式调用
- 输出尽量结构化

例如：

```bash
rendo create my-app --starter saas --provider rendo-default --json
```

## 3.3 幂等与可重试

CLI 命令应尽量：

- 可重复执行
- 可诊断失败
- 尽量不给工作区留下半成品状态

---

## 4. `init` 命令最小流程

`rendo init` 至少要完成：

1. 初始化 `Core Starter`
2. 建立最小目录结构
3. 写入基础 manifest
4. 写入 agent instruction surfaces
5. 写入 Docker / compose 基础入口
6. 输出下一步说明

---

## 5. `create` 命令最小流程

`rendo create` 至少要完成：

1. 选择或解析 `Starter Template`
2. 如果该 starter 支持多端 surface，选择本次项目要生成的 `surfaces`
3. 选择默认 provider 组合
4. 生成本地目录
5. 写入 `.env.example` / `.env.local`
6. 初始化 `docker-compose`
7. 初始化 starter manifest
8. 输出下一步启动说明

可选进一步完成：

9. 自动执行 starter install
10. 自动执行 db migrate / seed
11. 自动启动开发环境

### 关于 `surfaces`

对于支持多端形态的 starter，CLI 应支持：

```bash
rendo create application --surfaces web
rendo create application --surfaces web,miniapp
rendo create application --surfaces web,mobile
```

默认最优解：

- 若用户或 Agent 未显式指定，则默认 `web`

---

## 6. `add` 命令最小流程

`rendo add` 至少要完成：

1. 读取能力模板 manifest
2. 校验依赖
3. 预览 install 计划
4. 修改文件 / 配置 / env / route / migration
5. 输出变更结果

强 Agent 使用时，应支持：

- 非交互确认
- JSON 输出

---

## 7. `inspect` 的输出要求

`inspect` 输出必须足够让：

- 人类判断是否值得装
- Agent 判断是否适合自动装

至少包含：

- 名称
- 版本
- 类型
- runtime mode
- provider
- 依赖
- 所需 env
- 安装影响面
- 是否修改数据库
- 是否官方维护

---

## 8. `doctor` 的作用

这是后续很重要的命令，因为它能帮助：

- 小白用户排查问题
- Agent 自动诊断配置缺失

至少应检查：

- Docker
- Node / pnpm / bun
- env 配置
- DB 连通性
- Redis 连通性
- Rendo API key 状态
- 已安装 pack 的健康状态

---

## 9. 最终结论

Rendo CLI 不只是安装器，而是：

- `Core Starter` 的入口
- `Starter Template` 的入口
- 能力模板的入口
- Agent 的入口
- 本地工作区的控制面

一句话结论：

**如果没有统一 CLI，Rendo 的 starter、能力模板和 Agent 生态就很难形成真正自然的一体化体验。**
