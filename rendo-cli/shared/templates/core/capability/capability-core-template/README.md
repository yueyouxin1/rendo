# __RENDO_PROJECT_NAME__

This workspace is the Rendo `capability-core-template`.

## What It Freezes

- the control plane for `capability templates`
- the minimum implementation-root rule
- the minimum interface surfaces
- the minimum verification skeleton
- the inheritance contract for official `base` templates

## What It Does Not Decide

- product shape
- vendor choice
- irreversible host integration
- scenario-specific runtime opinions

## Read First

- `AGENTS.md`
- `.agents/glossary.md`
- `.agents/review-checklist.md`
- `docs/structure.md`
- `docs/extension-points.md`
- `docs/inheritance-boundaries.md`
- `docs/secondary-development.md`

## Commands

```bash
npm install
npm run health
npm run check
```

## Metadata Note

- In a live Rendo workspace, CLI-managed metadata belongs under `.rendo/`.
- Formal template artifacts may still carry root-level manifest files for registry and bundle compatibility.
- Validation scripts must therefore prefer `.rendo/` and fall back to root-level manifests only for formal artifact inspection.
