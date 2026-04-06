# Rendo 模板目录、命名与继承约定

## 目标

把模板系统收敛成一套可被人类和强 Agent 共同稳定理解的规则。

---

## 1. 身份四元组

每个模板都应能被以下四个维度明确识别：

1. `templateKind`
2. `templateRole`
3. `category`
4. `id`

目录、命名、manifest 都应服务于这四个维度。

---

## 2. 目录约定

### Authoring

```txt
shared/authoring/templates/<role>/<kind>/<category>/<template-id>/
```

### Generated

```txt
shared/templates/core/<kind>/<template-id>/
shared/templates/base/<kind>/<category>/<template-id>/
shared/templates/derived/<kind>/<category>/<template-id>/
```

---

## 3. 命名约定

### Core

- `<kind>-core-template`

### Base

- starter：`<category>-base-starter`
- 其他：`<category>-<kind>-base-template`

### Derived

- 直接表达产品或场景身份
- 但必须通过 `lineage` 明确来自哪个 `core` 与 `base`

---

## 4. 继承约定

### Core 到 Base

- Base 可以增加目录和观点
- 但不能抹掉 core 的控制面

### Base 到 Derived

- Derived 可以增加业务形态和厂商绑定
- 但不应破坏 base 已经定义的稳定扩展边界

---

## 5. Agent 读取顺序

遇到任意模板时，推荐先读：

1. `rendo.template.json`
2. `README.md`
3. `docs/structure.md`
4. `docs/extension-points.md`
5. `docs/inheritance-boundaries.md`
6. `docs/secondary-development.md`

如果一个模板不能支持这套读取顺序，说明它对 Agent 还不够友好。
