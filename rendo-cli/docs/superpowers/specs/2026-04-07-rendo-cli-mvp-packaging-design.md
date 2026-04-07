# Rendo CLI MVP Packaging Design

## Goal

Restructure the current repository so the CLI development system lives under `rendo-cli/`, publish a local MVP executable `rendo` that no longer depends on the current repo-root layout, and use that published CLI to create the initial `application/saas-starter` template workspace.

## Scope

This round does not build runtime persistence, official remote publish, or SaaS business features.

It only establishes:

- a clean `rendo-cli/` development boundary
- a single canonical release CLI runtime
- a local binary/distribution build that carries the minimum runtime assets it needs
- a verified `create` flow that can materialize `application/saas-starter` as a template workspace

## Design

### 1. Repository reshape

The current CLI development workspace will move under `rendo-cli/`.

That includes:

- `cli/`
- `docs/`
- `scripts/`
- `shared/`
- `tests/`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- current CLI-facing `README.md`
- current CLI-facing `AGENTS.md`

The repo root becomes an orchestration root, not the CLI root.

### 2. Canonical release runtime

Python becomes the only release runtime for `rendo`.

Node remains inside `rendo-cli/` for:

- contract development
- template generation
- parity tests
- internal tooling

But the published command users run is:

- `rendo`

not:

- `rendo-python`
- `node --import tsx ...`

### 3. Asset packaging

The release CLI must no longer depend on `repoRoot/shared/*`.

The MVP release will package a minimum runtime asset set together with the Python CLI:

- contracts
- registry indexes
- official core templates
- official base templates

This will be emitted as a local distribution, with the executable resolving assets from the packaged asset root rather than the repository root.

### 4. Binary shape

The MVP delivery target is a local Windows executable distribution.

The simplest acceptable form is:

- `rendo.exe`
- packaged runtime assets embedded or co-shipped in the distribution

The CLI must run from that distribution without needing:

- the current repo root
- root-level `shared/`
- root-level `tests/`
- root-level `scripts/`
- root-level `node_modules`

### 5. Template creation flow

To create a new derived starter template workspace, `create` must support an explicit template-workspace mode.

This is needed because creating a business project and creating a publishable derived template are different outcomes.

The minimum design is:

- keep `rendo create <starter>` for normal workspace creation
- add `--as-template`
- when `--as-template` is present, derive local template identity from the output path unless explicitly overridden

For this round, the published binary must be able to create:

- `application/saas-starter`

into a local workspace path such as:

- `<repo-root>/application/saas-starter`

## Success criteria

- `rendo-cli/` is the new CLI development root
- the published `rendo` executable runs outside the current repo-root layout
- the published executable can run `search`, `inspect`, `create`, `doctor`, and `publish --local`
- the published executable can create the initial `application/saas-starter` template workspace
- the root repository is no longer pretending to be the CLI installation boundary
