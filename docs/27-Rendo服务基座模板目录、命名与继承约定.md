# Rendo 服务基座模板目录、命名与继承约定

## 目标

把服务基座模板系统收敛成一套可被人类和强 Agent 共同稳定理解的规则。

---

## 1. 身份四元组

每个模板都应能被以下四个维度明确识别：

1. `templateKind`
2. `templateRole`
3. `category`
4. `id`

目录、命名、manifest 都应服务于这四个维度。

补充要求：

- starter 还应让 Agent 明确知道它是服务基座根模板
- 非 starter 还应让 Agent 明确知道它装配到宿主的哪个层面

---

## 2. 目录约定

### Authoring

```txt
shared/authoring/templates/<role>/<kind>/<category>/<template-id>/
```

### Formal Artifacts

```txt
shared/templates/core/<kind>/<template-id>/
shared/templates/base/<kind>/<category>/<template-id>/
shared/templates/derived/<kind>/<category>/<template-id>/
```

注意：

- `shared/authoring/templates` 是 authoring 源
- `shared/templates` 是 formal generated artifacts
- CLI 与 registry 当前消费的是 formal artifacts，不是 authoring overlays

---

## 3. 模板根结构约定

所有模板的通用骨架应为：

```txt
<template-root>/
├── rendo.template.json
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── .agents/
├── docs/
├── interfaces/
├── src/
├── tests/
├── scripts/
└── install/
```

只有 starter 宿主额外拥有：

- `features/`
- `capabilities/`
- `providers/`
- `surfaces/`
- `ops/`

---

## 4. 命名约定

### Core

- `<kind>-core-template`

### Base

- starter：`<category>-base-starter`
- 其他：`<category>-<kind>-base-template`

### Derived

- 直接表达产品或场景身份
- 但必须通过 `lineage` 明确来自哪个 `core` 与 `base`

---

## 5. 继承约定

### Core 到 Base

- Base 可以增加目录和观点
- 但不能抹掉 core 的控制面
- Starter base 应开始把 `AGENTS.md / CLAUDE.md / .agents / interfaces / install / ops` 的宿主结构具体化

### Base 到 Derived

- Derived 可以增加业务形态和厂商绑定
- 但不应破坏 base 已经定义的稳定扩展边界

---

## 6. Agent 读取顺序

遇到任意模板时，推荐先读：

1. `rendo.template.json`
2. `AGENTS.md`
3. `CLAUDE.md`
4. `.agents/capabilities.yaml`
5. `.agents/review-checklist.md`
6. `README.md`
7. `docs/structure.md`
8. `docs/extension-points.md`
9. `docs/inheritance-boundaries.md`
10. `docs/secondary-development.md`
11. `interfaces/openapi/`
12. `interfaces/mcp/`
13. `interfaces/skills/`
14. `install/`

如果某个模板不是 starter，以上顺序中的后几项可以替换为：

- 它对宿主中对应入口的扩展说明

如果一个模板不能支持这套读取顺序，说明它对 Agent 还不够友好。
