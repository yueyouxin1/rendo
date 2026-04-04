# Rendo CLI 与 Starter、Capability Template、Registry 的关系说明

## 文档目标

说明 CLI 在整个 Rendo 体系中的位置，以及它与 starter、能力模板、registry 的关系。

---

## 1. CLI 的位置

CLI 是：

- starter 的入口
- 能力模板的入口
- Agent 的入口
- registry 的入口

它不是 starter 的附属脚本，而是：

- **独立控制面**

---

## 2. 与 `Core Starter` 的关系

`Core Starter` 定义：

- 目录结构
- manifest
- runtime mode
- 扩展点

CLI 负责：

- 初始化
- 读取
- 安装
- 升级
- 诊断

这是一种：

- 协议绑定

而不是：

- 实现耦合

---

## 3. 与 `Starter Template` 的关系

CLI 负责：

- 搜索
- 创建
- 初始化配置
- 启动工作区

所以 `Starter Template` 的主入口应是 CLI。

---

## 4. 与 `Capability Template` 的关系

CLI 负责：

- `search`
- `inspect`
- `add`
- `pull`
- `upgrade`
- `doctor`

没有 CLI，能力模板生态就很难自然成立。

---

## 5. 与 Registry 的关系

Registry 是：

- starter 和能力模板的来源

CLI 是：

- 与 registry 交互的最小控制面

即使未来有网页平台，CLI 仍然应是：

- 强 Agent 的第一入口

---

## 6. 一句话结论

**CLI 是 Rendo 体系中最先成立、最自然、最重要的控制面，不应被降级成 starter 的附属工具。**
