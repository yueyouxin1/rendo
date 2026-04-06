# Rendo CLI 最小协议定义

## 1. CLI 的角色

`rendo cli` 是模板资产系统的统一入口，不是某个 starter 内部脚本。

它要让人类和强 Agent 都能通过同一组命令理解：

- 这是什么模板
- 它属于哪一类
- 它处于 `core / base / derived` 的哪一层
- 它该如何初始化、创建、安装、拉取、升级和诊断

## 2. 核心命令

### `rendo init <kind>`

用途：

- 初始化某一模板类型的 `core` 模板

当前支持：

- `starter`
- `feature`
- `capability`
- `provider`
- `surface`

示例：

```bash
rendo init starter --output my-starter-core
rendo init capability --output my-capability-core
```

### `rendo create`

用途：

- 从 `starter-template` 的 `base` 或 `derived` 模板创建可运行项目

约束：

- 不接受 `core` 模板
- 不接受非 starter 模板

### `rendo search`

用途：

- 搜索模板与 pack
- 支持 `local` 与 `remote registry provider`

### `rendo inspect`

用途：

- 查看 manifest、结构化元信息、文档入口、兼容矩阵与 install plan 元数据

### `rendo add`

用途：

- 向当前项目添加非 starter 模板或 pack
- 对 template asset 使用 manifest 驱动的 install plan

### `rendo pull`

用途：

- 把模板或 pack 拉到本地目录进行查看、对比或二次加工
- 远程拉取时对 bundle 做 digest 校验

### `rendo upgrade`

用途：

- 升级已安装 template asset 或 pack

### `rendo doctor`

用途：

- 诊断当前环境与项目状态

## 3. 语义边界

- `init` 负责 `core`
- `create` 负责 starter 的项目实例化
- `add / pull` 负责非 starter 模板与 pack 的消费
- `--registry <provider>` 负责切换 `local` 与 `remote`
- `--registry-token` 负责 bearer token 鉴权

## 4. Agent 友好要求

CLI 输出应尽量让强 Agent 在不翻大量代码的情况下就能知道：

- 该模板属于哪一类、哪一层
- 推荐先看哪些文档文件
- 它能被谁创建、谁安装、谁宿主
