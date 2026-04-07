# Rendo CLI MVP Packaging Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the CLI development system under `rendo-cli/`, ship a local MVP `rendo` executable, and use that executable to create the initial `application/saas-starter` template workspace.

**Architecture:** Python becomes the canonical release runtime, with packaged runtime assets that remove the current dependency on repo-root `shared/*`. Node stays inside `rendo-cli/` as a development and verification implementation. The executable distribution is then used to create the template workspace from `application-base-starter`.

**Tech Stack:** Python packaging, PyInstaller-style Windows executable packaging, TypeScript development tooling, local runtime assets

---

### Task 1: Add failing tests for release-CLI asset resolution and template-workspace creation mode

**Files:**
- Modify: `tests/cli.test.ts`

- [ ] **Step 1: Write a failing test for packaged asset-root resolution**
- [ ] **Step 2: Write a failing test for `create --as-template` producing a derived template workspace with a derived template id**
- [ ] **Step 3: Run `npm test` and verify failure for the new cases**

### Task 2: Add canonical Python release runtime and packaged asset resolution

**Files:**
- Modify: `cli/python/pyproject.toml`
- Create: `cli/python/rendo_cli/assets.py`
- Modify: `cli/python/rendo_cli/registry.py`
- Modify: `cli/python/rendo_cli/contracts.py`
- Modify: `cli/python/rendo_cli/__main__.py`
- Create: `scripts/build-python-cli.ps1`

- [ ] **Step 1: Introduce runtime asset-root resolution that works for source-dev and packaged binaries**
- [ ] **Step 2: Rename the release script entrypoint from `rendo-python` to `rendo`**
- [ ] **Step 3: Add a build script that emits a local executable distribution with bundled runtime assets**
- [ ] **Step 4: Run targeted tests and verify they pass**

### Task 3: Add template-workspace creation mode

**Files:**
- Modify: `cli/node/src/scaffold.ts`
- Modify: `cli/node/src/bin.ts`
- Modify: `cli/python/rendo_cli/scaffold.py`
- Modify: `cli/python/rendo_cli/__main__.py`
- Modify: `cli/node/src/contracts.ts`
- Modify: `cli/python/rendo_cli/contracts.py`

- [ ] **Step 1: Add `--as-template` support to `create`**
- [ ] **Step 2: Derive local template identity from output path when `--as-template` is set**
- [ ] **Step 3: Run tests and verify the new local template metadata is correct**

### Task 4: Move the CLI development workspace into `rendo-cli/`

**Files:**
- Move: `cli/ -> rendo-cli/cli/`
- Move: `docs/ -> rendo-cli/docs/`
- Move: `scripts/ -> rendo-cli/scripts/`
- Move: `shared/ -> rendo-cli/shared/`
- Move: `tests/ -> rendo-cli/tests/`
- Move: `package.json -> rendo-cli/package.json`
- Move: `package-lock.json -> rendo-cli/package-lock.json`
- Move: `tsconfig.json -> rendo-cli/tsconfig.json`
- Move: `README.md -> rendo-cli/README.md`
- Move: `AGENTS.md -> rendo-cli/AGENTS.md`
- Create: `README.md`
- Create: `AGENTS.md`

- [ ] **Step 1: Move the CLI development tree under `rendo-cli/`**
- [ ] **Step 2: Add a new root-level README/AGENTS that explain the new workspace split**
- [ ] **Step 3: Update path assumptions and verification commands to run from `rendo-cli/`**

### Task 5: Build and verify the MVP executable, then create `application/saas-starter`

**Files:**
- Create: `application/saas-starter/` via CLI

- [ ] **Step 1: Build the local release executable**
- [ ] **Step 2: Verify the executable runs `search`, `inspect`, `create`, and `doctor` without repo-root asset coupling**
- [ ] **Step 3: Use the executable to create `application/saas-starter` as a template workspace**
- [ ] **Step 4: Run final verification and document the exact create flow**
