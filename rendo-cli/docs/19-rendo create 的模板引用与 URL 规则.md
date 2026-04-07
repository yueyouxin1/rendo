# `rendo create` 的模板引用与 URL 规则

## 文档目标

定义 `rendo create` 接受什么样的输入，为什么不能只做成 URL 风格，以及 URL 在整体 CLI 体系中的角色。

---

## 1. 核心结论

`rendo create` 不应只做成：

```bash
rendo create https://rendo.com/template/xxx
```

更合理的设计是：

- **模板引用是主形态**
- **URL 是兼容输入**

---

## 2. 为什么 URL 不能成为唯一主形态

如果只接受 URL，CLI 会更像：

- `git clone`

但 `rendo create` 实际上还要做：

- 解析模板 metadata
- 选择版本
- 选择 runtime mode
- 选择 provider
- 初始化 env
- 安装 starter

所以它不只是“拉源码”，而是：

- **从模板创建项目**

---

## 3. 推荐输入形态

### 3.1 交互式

```bash
rendo create
```

### 3.2 模板引用

```bash
rendo create ai-webapp-starter
rendo create rendo:ai-webapp-starter
```

### 3.3 URL 兼容输入

```bash
rendo create --from https://rendo.com/template/ai-webapp-starter
```

---

## 4. 一句话结论

**`rendo create` 的主语义是“从模板创建项目”，不是“克隆仓库”；因此模板引用应为主，URL 只作为兼容入口。**
