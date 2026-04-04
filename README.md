# Rendo

Rendo is currently implemented as a starter-system workspace for strong agents.

The active architecture follows the template asset layering described in [doc/23-Rendo模板资产分层与分类体系说明.md](/D:/code/rendo/doc/23-Rendo模板资产分层与分类体系说明.md):

1. `Core Starter`
2. `Base Template`
3. `Derived Template`

At this stage, the implemented template kind is `Starter Template`.

## Current structure

- [shared/templates](/D:/code/rendo/shared/templates)
  - `core-starter`
  - `base/starter/*`
  - `derived/starter/*`
- [shared/authoring](/D:/code/rendo/shared/authoring)
  - `starter-templates/base/<category>/<profile>/...`
- [shared/registry](/D:/code/rendo/shared/registry)
  - language-neutral starter registry
- [shared/contracts](/D:/code/rendo/shared/contracts)
  - language-neutral JSON schemas
- [cli/node](/D:/code/rendo/cli/node)
  - Node implementation of the Rendo CLI
- [cli/python](/D:/code/rendo/cli/python)
  - Python implementation of the Rendo CLI

## Starter asset semantics

Each starter manifest now carries both:

- `templateKind`
  - currently `starter-template`
- `templateRole`
  - `core`
  - `base`
  - `derived`

This is layered on top of the existing `type` field:

- `core-starter`
- `domain-starter`

So the current assets are interpreted as:

- `core-starter`: `starter-template` + `core`
- `application-base-starter`: `starter-template` + `base`
- `ai-web-next-fastapi-starter`: `starter-template` + `derived`

Each starter also carries:

- `domainTags`: multi-select domain classification
- `scenarioTags`: optional multi-select scenario classification
- `surfaceCapabilities`: explicit surface capability attributes

## CLI usage

Node CLI:

```bash
node --import tsx cli/node/src/bin.ts search --type starter --json
node --import tsx cli/node/src/bin.ts init --output my-core
node --import tsx cli/node/src/bin.ts create application --surfaces web,miniapp --output my-app
```

Python CLI:

```bash
python cli/python/rendo.py search --type starter --json
python cli/python/rendo.py inspect application-base-starter --json
python cli/python/rendo.py create application --surfaces web --output my-app
```

## Authoring usage

Generate a base starter template from `Core Starter` through the generic pipeline:

```bash
npm run generate:domain-starter -- base/application/application-base
npm run generate:domain-starter -- derived/ai-webapp/next-fastapi-landing
```

The generated starter outputs are written into [shared/templates](/D:/code/rendo/shared/templates).

## Validation status

Implemented and tested:

- Node CLI and Python CLI produce identical `search` results
- Node CLI and Python CLI produce identical `inspect` payloads
- `rendo init` creates a runnable `Core Starter`
- `rendo create application --surfaces ...` creates runnable application base projects
- Node and Python CLIs generate byte-identical source trees for `ai-web-next-fastapi-starter`
- The generated `ai-web-next-fastapi-starter` runs successfully with:
  - Next.js web app
  - FastAPI mock LLM service

## Commands

```bash
npm install
npm run check
npm run build
npm test
python -m compileall cli/python
```
