# __RENDO_PROJECT_NAME__

This project was initialized from the Rendo `provider-core-template`.

## What it is

- The minimal control-plane contract for `provider templates`
- A stable, agent-readable workspace with explicit Agent entrypoints and interface roots
- The inheritance source for official `base` templates that must derive from this core instead of bypassing it

## What it is not

- Not a concrete product starter
- Not a vendor binding
- Not a hidden runtime
- Not the place to introduce irreversible host integration logic

## Read first

- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`
- `AGENTS.md`
- `.agents/capabilities.yaml`

## Commands

```bash
npm install
npm run health
npm run check
```

## Next step

Use this template to author a `base` template for `provider templates`, then regenerate the formal artifact layer from authoring sources instead of hand-editing `shared/templates/*`.
