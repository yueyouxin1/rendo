# Publish Local And Artifact Boundaries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove low-value `capabilities.yaml`, clarify `shared/templates` as a distribution-artifact layer, and add a minimal local `rendo publish --local` workflow for workspace-to-artifact export.

**Architecture:** Keep `shared/templates` as the canonical internal distribution artifact layer consumed by registry, bundle, and runtime-pre export. Treat local workspaces as the user-facing development surface, add a dedicated workspace publish path that reads `.rendo/`, and make publish filtering reuse `.gitignore` while force-including `.rendo/**`.

**Tech Stack:** Node CLI, Python CLI, TypeScript, Python stdlib, Node test runner, JSON bundle artifacts

---

### Task 1: Update failing CLI tests for removed capability index and new local publish flow

**Files:**
- Modify: `tests/cli.test.ts`

- [ ] **Step 1: Write failing expectations that remove `.agents/capabilities.yaml` from core/base/workspace assertions**

```ts
assert.deepEqual(payload.architecture.rootPaths.agentEntrypoints, [
  "AGENTS.md",
  "CLAUDE.md",
  ".agents/review-checklist.md",
  ".agents/glossary.md",
]);
```

- [ ] **Step 2: Add a failing local publish parity test**

```ts
test("node and python CLIs publish identical local workspace bundles while honoring .gitignore", async () => {
  // create workspace
  // add ignored.txt and .gitignore
  // run `publish --local --output ... --json`
  // assert bundle excludes ignored.txt and includes `.rendo/*`
});
```

- [ ] **Step 3: Run the targeted test file and verify failure**

Run: `node --import tsx --test tests/cli.test.ts`
Expected: FAIL because current templates still include `capabilities.yaml` and `publish` command does not exist.

### Task 2: Implement local publish bundling and `.gitignore` filtering in the Node CLI

**Files:**
- Modify: `cli/node/src/fs.ts`
- Modify: `cli/node/src/project.ts`
- Modify: `cli/node/src/bundle.ts`
- Modify: `cli/node/src/contracts.ts`
- Modify: `cli/node/src/bin.ts`

- [ ] **Step 1: Add minimal ignore-aware file walking that supports `.gitignore`-based exclusion with forced includes**

```ts
export async function walkFiles(rootPath: string, options?: {
  ignoredRelativePaths?: Set<string>;
  ignoredDirectoryNames?: Set<string>;
}): Promise<string[]> { /* ... */ }
```

- [ ] **Step 2: Add workspace publish metadata loading helpers**

```ts
export async function loadWorkspacePublishState(projectRoot: string): Promise<{
  project: ProjectManifest;
  template: TemplateManifest;
}> {
  return loadProjectState(projectRoot);
}
```

- [ ] **Step 3: Add workspace bundle creation that reads `.rendo/rendo.template.json` and respects ignore filtering**

```ts
export async function createWorkspacePublishBundle(projectRoot: string): Promise<TemplateBundle> { /* ... */ }
```

- [ ] **Step 4: Add `publish` command with `--local` output**

```ts
.command("publish")
.description("Export the current workspace as a local publishable bundle artifact")
.option("--local", "export a local publish artifact", true)
.option("--output <file>", "output bundle file")
```

- [ ] **Step 5: Run targeted tests and make them pass**

Run: `node --import tsx --test tests/cli.test.ts`
Expected: PASS for the new publish test and updated capability-index assertions.

### Task 3: Mirror local publish support in the Python CLI

**Files:**
- Modify: `cli/python/rendo_cli/fs.py`
- Modify: `cli/python/rendo_cli/project.py`
- Modify: `cli/python/rendo_cli/bundle.py`
- Modify: `cli/python/rendo_cli/contracts.py`
- Modify: `cli/python/rendo_cli/__main__.py`

- [ ] **Step 1: Port ignore-aware file walking and workspace bundle creation**

```py
def create_workspace_publish_bundle(project_root: Path) -> dict:
    ...
```

- [ ] **Step 2: Add `publish` command parity**

```py
publish_parser = subparsers.add_parser("publish", help="Export the current workspace as a local publishable bundle artifact")
publish_parser.add_argument("--local", action="store_true")
publish_parser.add_argument("--output")
publish_parser.add_argument("--json", action="store_true")
```

- [ ] **Step 3: Run targeted tests and make Node/Python outputs identical**

Run: `node --import tsx --test tests/cli.test.ts`
Expected: PASS for the local publish parity test.

### Task 4: Remove `capabilities.yaml` from skeletons, generated templates, and documentation

**Files:**
- Modify: `shared/authoring/templates/core/common/skeleton/AGENTS.md`
- Modify: `shared/authoring/templates/core/common/skeleton/.agents/review-checklist.md`
- Modify: `shared/authoring/templates/core/common/skeleton/.agents/skills/rendo-service-surfaces/SKILL.md`
- Delete: `shared/authoring/templates/core/common/skeleton/.agents/capabilities.yaml`
- Modify: `scripts/sync-core-templates.ts`
- Modify: `shared/authoring/templates/base/starter/application/application-base-starter/overlay/rendo.template.json`
- Modify: `shared/authoring/templates/base/provider/llm/llm-provider-base-template/overlay/rendo.template.json`
- Modify: `README.md`
- Modify: `AGENTS.md`
- Modify: `docs/00-Rendo服务基座新定位总纲.md`
- Modify: `docs/07-Rendo服务基座 Core Template 最小契约定义.md`
- Modify: `docs/12-Rendo Capability Template 安装计划与文件变更规则.md`
- Modify: `docs/23-Rendo服务基座模板分层与分类体系说明.md`
- Modify: `docs/26-Rendo服务基座术语表.md`
- Modify: `docs/27-Rendo服务基座模板目录、命名与继承约定.md`
- Modify: `docs/29-Rendo服务基座首日架构与目录标准.md`
- Modify: `docs/todo/V1-发布门槛清单与交付成功定义.md`
- Modify: `docs/todo/cli/06-紧急-工作区命名空间与发布语义TODO.md`

- [ ] **Step 1: Remove skeleton references and file creation for `capabilities.yaml`**

```md
- `.agents/review-checklist.md`
- `.agents/glossary.md`
- `.agents/skills/`
```

- [ ] **Step 2: Regenerate core/base formal artifacts**

Run: `node --import tsx scripts/sync-core-templates.ts`
Expected: generated templates no longer contain `.agents/capabilities.yaml`

- [ ] **Step 3: Update docs to rename `shared/templates` as the internal distribution artifact layer**

```md
- `shared/templates` is the internal distribution-artifact layer consumed by registry, bundle, and runtime-pre export.
- local workspaces are the only user-facing development surface.
```

### Task 5: Full verification and readiness assessment

**Files:**
- Modify: `docs/todo/README.md`
- Modify: `docs/todo/cli/05-Phase2.5-Runtime前确定性契约与制品边界TODO.md`

- [ ] **Step 1: Run the full verification suite**

Run: `npm test`
Expected: PASS

Run: `npm run check`
Expected: PASS

Run: `npm run build`
Expected: PASS

Run: `python -m compileall cli/python/rendo_cli`
Expected: PASS

- [ ] **Step 2: Update todo state for completed pre-runtime work**

```md
- [x] `capabilities.yaml` removed from the mandatory core contract
- [x] local publish artifact flow exists for workspace-to-bundle export
```

- [ ] **Step 3: Record the `application/saas-starter` entry criteria**

```md
1. `rendo create application-base-starter --output <workspace>`
2. develop in the local workspace
3. `rendo doctor`
4. `rendo publish --local --output <artifact>`
```
