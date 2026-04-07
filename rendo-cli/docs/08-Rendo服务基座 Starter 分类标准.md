# Rendo 服务基座 Starter 分类标准

> 本文件语义已更新为“服务基座根模板”的 Starter 分类标准。
> 若本文出现旧的“唯一 Core Starter”心智，应以当前 `starter-core-template -> application-base-starter -> derived starter` 语义替代，并服从 `core -> base -> derived` 总主干。

## 结论

`Starter Template` 现在不是建立在“唯一 Core Starter”之上的唯一主类型，
而是五类一等模板中的一种，同时还是服务基座根模板。

它的当前分层是：

- `starter-core-template`
- `application-base-starter`
- 未来各种 derived starter

## Starter 的职责

Starter 负责：

- 形成完整项目起点
- 承担 `rendo create` 的实例化对象
- 承载后续 feature / capability / provider / surface 的组合宿主
- 承载 `AGENTS.md / CLAUDE.md / .agents / interfaces / docs / install / ops` 的宿主结构

## 当前分类

### Core

- `starter-core-template`

### Base

- `application-base-starter`

### Derived

- 暂未作为当前重点推进对象
