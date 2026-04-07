# 能力包生态与 Pack 最小原则

## 为什么需要 Pack

starter 不能太重，但又不能太空。  
这就要求：

- starter 给起点
- pack 负责长能力

## Pack 的核心角色

Pack 不是普通插件，而是：

- Tool
- Plugin
- Workflow
- Workflow Node
- Channel integration
- Admin module

等能力的标准化扩展载体。

## Pack 的三种运行模式

### 1. Source Pack

源码拉到本地，适合高度可定制能力。

### 2. Managed Pack

能力运行在云端，本地只接 SDK 和 manifest。

### 3. Hybrid Pack

本地源码 + 云端能力混合。

## Pack 必须最少包含

- manifest
- install plan
- runtime mode
- env requirements
- docs
- agent instructions

## Agent 与 Pack 的自然交互

应支持：

- `search`
- `inspect`
- `add`
- `pull`
- `upgrade`

## Pack 的最小原则

1. 可搜索
2. 可解释
3. 可安装
4. 可回滚
5. 可升级
6. 对 starter 尽量低侵入

## 最终原则

**starter 是起点，pack 是扩展；starter 不应承担所有能力。**

