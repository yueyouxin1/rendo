# Node CLI

This directory contains the Node implementation of the Rendo CLI.

Run it from the repo root with:

```bash
node --import tsx cli/node/src/bin.ts <command>
```

Key commands:

```bash
node --import tsx cli/node/src/bin.ts init starter --output my-starter-core
node --import tsx cli/node/src/bin.ts create application --surfaces web --output my-app
node --import tsx cli/node/src/bin.ts add llm-provider-base-template --json
```
