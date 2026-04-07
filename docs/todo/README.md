# TODO 索引

## 使用方式

`docs/todo` 现在按三条主线组织：

- `saas-starter/`
  - `application/saas-starter` 的最佳实践交付路线
  - 当前仓库第一顺位
  - 只关注通用 SaaS 基座，不推进 `rendo-saas-starter`

- `cli/`
  - 模板契约、首日架构标准、authoring/产物分层、core/base/derived、CLI、模板资产生命周期
- `rendo-saas-starter/`
  - headless Rendo runtime、持久化存储、远程发布与狗粮验证

当前必须先完成的不是平台线，而是两件事中的前者：

- **先把 `application/saas-starter` 做成真正稳定、专业、可生产演进的 SaaS 基座**
- **再把 runtime / `rendo-saas-starter` 建在这个稳定基座之上**

这些文件不再代表旧的“唯一 Core Starter 路线”。
即使文件名保留了旧阶段编号，也应按当前正式架构理解：

- `core -> base -> derived`
- `starter / feature / capability / provider / surface`
- `application/saas-starter -> 首日架构标准 -> core/base/derived -> CLI -> template asset lifecycle` 是当前主线
- `rendo-saas-starter/` 目录代表后续阶段，不应挤占当前第一顺位

## 阅读顺序

1. [saas-starter/README.md](/D:/code/rendo/docs/todo/saas-starter/README.md)
2. [saas-starter/00-Application-SaaS-Starter总目标与边界TODO.md](/D:/code/rendo/docs/todo/saas-starter/00-Application-SaaS-Starter%E6%80%BB%E7%9B%AE%E6%A0%87%E4%B8%8E%E8%BE%B9%E7%95%8CTODO.md)
3. [saas-starter/01-技术选型与架构冻结TODO.md](/D:/code/rendo/docs/todo/saas-starter/01-%E6%8A%80%E6%9C%AF%E9%80%89%E5%9E%8B%E4%B8%8E%E6%9E%B6%E6%9E%84%E5%86%BB%E7%BB%93TODO.md)
4. [saas-starter/02-产品门面与商业化体验TODO.md](/D:/code/rendo/docs/todo/saas-starter/02-%E4%BA%A7%E5%93%81%E9%97%A8%E9%9D%A2%E4%B8%8E%E5%95%86%E4%B8%9A%E5%8C%96%E4%BD%93%E9%AA%8CTODO.md)
5. [saas-starter/03-管理端与控制面TODO.md](/D:/code/rendo/docs/todo/saas-starter/03-%E7%AE%A1%E7%90%86%E7%AB%AF%E4%B8%8E%E6%8E%A7%E5%88%B6%E9%9D%A2TODO.md)
6. [saas-starter/04-服务数据与智能能力TODO.md](/D:/code/rendo/docs/todo/saas-starter/04-%E6%9C%8D%E5%8A%A1%E6%95%B0%E6%8D%AE%E4%B8%8E%E6%99%BA%E8%83%BD%E8%83%BD%E5%8A%9BTODO.md)
7. [saas-starter/05-多端预留与客户端策略TODO.md](/D:/code/rendo/docs/todo/saas-starter/05-%E5%A4%9A%E7%AB%AF%E9%A2%84%E7%95%99%E4%B8%8E%E5%AE%A2%E6%88%B7%E7%AB%AF%E7%AD%96%E7%95%A5TODO.md)
8. [saas-starter/06-工程基础设施与Docker交付TODO.md](/D:/code/rendo/docs/todo/saas-starter/06-%E5%B7%A5%E7%A8%8B%E5%9F%BA%E7%A1%80%E8%AE%BE%E6%96%BD%E4%B8%8EDocker%E4%BA%A4%E4%BB%98TODO.md)
9. [saas-starter/07-测试验收与勾选标准TODO.md](/D:/code/rendo/docs/todo/saas-starter/07-%E6%B5%8B%E8%AF%95%E9%AA%8C%E6%94%B6%E4%B8%8E%E5%8B%BE%E9%80%89%E6%A0%87%E5%87%86TODO.md)
10. [29-Rendo服务基座首日架构与目录标准.md](/D:/code/rendo/docs/29-Rendo服务基座首日架构与目录标准.md)
11. [V1-发布门槛清单与交付成功定义.md](/D:/code/rendo/docs/todo/V1-发布门槛清单与交付成功定义.md)
12. [cli/06-紧急-工作区命名空间与发布语义TODO.md](/D:/code/rendo/docs/todo/cli/06-%E7%B4%A7%E6%80%A5-%E5%B7%A5%E4%BD%9C%E5%8C%BA%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4%E4%B8%8E%E5%8F%91%E5%B8%83%E8%AF%AD%E4%B9%89TODO.md)
13. [cli/00-Phase0-契约与规范TODO.md](/D:/code/rendo/docs/todo/cli/00-Phase0-%E5%A5%91%E7%BA%A6%E4%B8%8E%E8%A7%84%E8%8C%83TODO.md)
14. [cli/01-Phase1-Core 模板层实现TODO.md](/D:/code/rendo/docs/todo/cli/01-Phase1-Core%20%E6%A8%A1%E6%9D%BF%E5%B1%82%E5%AE%9E%E7%8E%B0TODO.md)
15. [cli/02-Phase2-RendoCLI实现TODO.md](/D:/code/rendo/docs/todo/cli/02-Phase2-RendoCLI%E5%AE%9E%E7%8E%B0TODO.md)
16. [cli/05-Phase2.5-Runtime前确定性契约与制品边界TODO.md](/D:/code/rendo/docs/todo/cli/05-Phase2.5-Runtime%E5%89%8D%E7%A1%AE%E5%AE%9A%E6%80%A7%E5%A5%91%E7%BA%A6%E4%B8%8E%E5%88%B6%E5%93%81%E8%BE%B9%E7%95%8CTODO.md)
17. [cli/03-Phase3-第一个SaasStarter实现TODO.md](/D:/code/rendo/docs/todo/cli/03-Phase3-%E7%AC%AC%E4%B8%80%E4%B8%AASaasStarter%E5%AE%9E%E7%8E%B0TODO.md)
18. [cli/04-Phase4-Pack机制实现TODO.md](/D:/code/rendo/docs/todo/cli/04-Phase4-Pack%E6%9C%BA%E5%88%B6%E5%AE%9E%E7%8E%B0TODO.md)
19. [rendo-saas-starter/10-Phase5-最小真实Rendo能力接入TODO.md](/D:/code/rendo/docs/todo/rendo-saas-starter/10-Phase5-%E6%9C%80%E5%B0%8F%E7%9C%9F%E5%AE%9ERendo%E8%83%BD%E5%8A%9B%E6%8E%A5%E5%85%A5TODO.md)
20. [rendo-saas-starter/11-Phase6-双模式与多端准备TODO.md](/D:/code/rendo/docs/todo/rendo-saas-starter/11-Phase6-%E5%8F%8C%E6%A8%A1%E5%BC%8F%E4%B8%8E%E5%A4%9A%E7%AB%AF%E5%87%86%E5%A4%87TODO.md)
21. [rendo-saas-starter/12-Phase7-Rendo平台闭环TODO.md](/D:/code/rendo/docs/todo/rendo-saas-starter/12-Phase7-Rendo%E5%B9%B3%E5%8F%B0%E9%97%AD%E7%8E%AFTODO.md)

## 当前重点

### 第一顺位

- [x] 将 `application/saas-starter` 提升为当前仓库最高优先级的产品交付目标
- [x] 明确本轮不推进任何 `rendo-saas-starter`、runtime 平台或狗粮逻辑，先完成通用 SaaS 基座稳定落地
- [x] 新增独立 `docs/todo/saas-starter/` 主线并按模块拆分任务与验收标准
- [x] 在 `saas-starter` 交付清单中强制实现前阅读与本目标相关的 Vercel skills（至少 `nextjs`、`shadcn`、`turborepo`，按需补充 `geist`、`observability`）
- [x] 将“docker 开箱即用”提升为 `application/saas-starter` 的硬性交付标准
- [x] 立刻收敛 `.rendo/` 工作区命名空间、来源 lineage、发布角色自动归一化和 `core/base/derived` 价值定义
- [x] 以“首日架构落地 + CLI 兼容性达标”作为第一发布门槛（未满足前不推进平台线）
- [x] 冻结并落实首日服务基座架构与目录标准
- [x] 让五类 `core` 模板共享同一套语言无关目录语义
- [x] 让所有模板统一具备 `AGENTS.md / CLAUDE.md / .agents / interfaces / src / tests / scripts / integration`
- [x] 让 `starter-core-template` 从第一天就冻结 `src/apps / src/packages / src/features / src/capabilities / src/providers / src/surfaces`（含保留槽位 `src/surfaces/desktop`）与 `ops/`
- [x] 让非 starter 模板从第一天就按宿主扩展模型设计
- [x] 让 `application-base-starter` 成为第一套生产可演进的标准服务基座 base
- [x] 让 CLI `inspect` 明确暴露 `lineage.parentTemplate`、`assetIntegration.modes[].targetRoot` 与 `integration/` 指南入口
- [x] 让 CLI `doctor` 进一步暴露已安装资产的 `targetRoot / integration` 一致性与宿主影响面
- [x] 在进入 runtime 之前冻结“代码可确定契约”和“可由 AI enrich 的发布前补全信息”的边界
- [x] 将模板资产机器可读契约统一更名为 `assetIntegration`
- [x] 明确当前阶段不做官方远程 `publish` API，只保留已落地的本地制品导出与 runtime-pre snapshot 导出
- [x] 落地 `rendo bundle` 作为本地正式制品导出入口
- [x] 落地 `rendo publish --local` 作为本地 workspace 到 publish bundle 的最小闭环
- [x] 落地 runtime-pre deterministic catalog snapshot（`templates.snapshot.json`、`index.json`、handshake `snapshot` 指针）

### 已有基础

- [x] 模板主干切换为 `core -> base -> derived`
- [x] 五类 `core` 模板已建立
- [x] 最小官方 `base` 模板集合已建立并收敛为 `application-base-starter + llm-provider-base-template`
- [x] `rendo init <kind>` 已支持五类 core 初始化
- [x] Node / Python CLI 本地 registry 行为已对齐
- [x] 远程 fixture registry 已证明 `search / inspect / create / add / pull` 协议闭环
- [x] `shared/authoring/templates` 与 `shared/templates` 的角色边界已澄清

### 第二顺位

- [ ] 在 `application/saas-starter` 稳定落地后，再恢复 `rendo-saas-starter` 与 runtime 平台线
- [x] 让 CLI 对首日架构标准具备更强的 inspect / doctor / compatibility 暴露能力（优先覆盖 `src/*` 槽位、`targetRoot` 与 `integration/`）
- [x] 让 manifest 与 registry 通过 runtime-pre snapshot 明确区分“runtime/CLI 强依赖字段”和“可由 AI 发布前 enrich 的说明性字段”
- [ ] 让 runtime 阶段的 capability lifecycle 显式更新 Agent 入口与接口描述面
- [ ] 让 runtime 阶段正式消费 `templates.snapshot.json` 和 bundle 制品，而不是只停留在导出侧
- [ ] 在 runtime 形态稳定后，再明确 CLI 从仓库/目录布局交付走向更独立分发策略的方案
- [ ] 再进入更后续的远程 runtime 与平台线
