# Python CLI

This directory contains the Python implementation of the Rendo CLI.

It reads the same language-neutral assets as the Node implementation:

- `shared/contracts`
- `shared/registry`
- `shared/templates`

Key commands:

```bash
python cli/python/rendo.py init capability --output my-capability-core
python cli/python/rendo.py create application --surfaces web --output my-app
python cli/python/rendo.py inspect llm-provider-base-template --json
python cli/python/rendo.py bundle application-base-starter --output .\\artifacts\\application-base-starter.rendo-bundle.json
```
