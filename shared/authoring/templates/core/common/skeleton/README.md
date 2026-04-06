# __RENDO_PROJECT_NAME__

This project was initialized from the Rendo `__RENDO_CORE_TEMPLATE_ID__`.

## What it is

- The minimal control-plane contract for `__RENDO_CORE_LABEL_LOWER__`
- A stable, agent-readable workspace that defines how this template kind grows
- The inheritance source for official and internal `base` templates of the same kind

## What it is not

- Not a concrete product starter
- Not a vendor binding
- Not a hidden runtime
- Not the place to introduce irreversible install logic

## Read first

- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`
- `docs/authoring-base-template.md`

## Commands

```bash
npm install
npm run health
npm run check
```

## Next step

Use this template to author a `base` template for `__RENDO_CORE_LABEL_LOWER__`, then let concrete `derived` assets inherit from that base instead of bypassing the core contract.
