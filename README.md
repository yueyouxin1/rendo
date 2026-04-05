# Rendo

Rendo is currently implemented as a template-system workspace for strong agents.

The active architecture is:

1. `core`
2. `base`
3. `derived`

The first-class template kinds are:

- `starter-template`
- `feature-template`
- `capability-template`
- `provider-template`
- `surface-template`

## Current structure

- [shared/templates](/D:/code/rendo/shared/templates)
  - `core/*-core-template`
  - `base/<kind>/*`
- [shared/authoring/templates](/D:/code/rendo/shared/authoring/templates)
  - generic template authoring profiles and overlays
- [shared/registry](/D:/code/rendo/shared/registry)
  - language-neutral template registry
- [shared/contracts](/D:/code/rendo/shared/contracts)
  - language-neutral JSON schemas
- [cli/node](/D:/code/rendo/cli/node)
  - Node implementation of the Rendo CLI
- [cli/python](/D:/code/rendo/cli/python)
  - Python implementation of the Rendo CLI

## Implemented official templates

Core templates:

- `starter-core-template`
- `feature-core-template`
- `capability-core-template`
- `provider-core-template`
- `surface-core-template`

Base templates:

- `application-base-starter`
- `dashboard-feature-base-template`
- `storage-capability-base-template`
- `llm-provider-base-template`
- `admin-surface-base-template`

## Template semantics

Every template manifest carries:

- `type`
  - always `template`
- `templateKind`
  - one of the five first-class template kinds
- `templateRole`
  - `core`
  - `base`
  - `derived`

Projects created from a template record their origin in `rendo.project.json` under `template`.

## CLI usage

Node CLI:

```bash
node --import tsx cli/node/src/bin.ts search --type all --json
node --import tsx cli/node/src/bin.ts init starter --output my-starter-core
node --import tsx cli/node/src/bin.ts init capability --output my-capability-core
node --import tsx cli/node/src/bin.ts create application --surfaces web,miniapp --output my-app
```

Python CLI:

```bash
python cli/python/rendo.py search --type all --json
python cli/python/rendo.py inspect llm-provider-base-template --json
python cli/python/rendo.py init provider --output my-provider-core
python cli/python/rendo.py create application --surfaces web --output my-app
```

## Authoring usage

Generate official base templates from their core layer through the generic profile pipeline:

```bash
npm run generate:template -- base/starter/application/application-base-starter
npm run generate:template -- base/feature/dashboard/dashboard-feature-base-template
npm run generate:template -- base/capability/storage/storage-capability-base-template
npm run generate:template -- base/provider/llm/llm-provider-base-template
npm run generate:template -- base/surface/admin/admin-surface-base-template
```

The generated outputs are written into [shared/templates](/D:/code/rendo/shared/templates).

## Validation status

Implemented and tested:

- Node CLI and Python CLI produce identical `search` results
- Node CLI and Python CLI produce identical `inspect` payloads
- `rendo init <kind>` creates runnable core templates
- `rendo create application --surfaces ...` creates runnable application base projects
- Node and Python CLIs add and pull provider base templates identically

## Commands

```bash
npm install
npm run check
npm run build
npm test
python -m compileall cli/python
```

