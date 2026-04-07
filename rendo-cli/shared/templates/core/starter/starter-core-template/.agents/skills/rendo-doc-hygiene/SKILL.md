---
name: rendo-doc-hygiene
description: Keep Rendo docs, checklists, and execution playbooks short, canonical, and synchronized with behavior.
origin: Rendo
---

# Rendo Documentation Hygiene

Use this playbook whenever a change affects structure, workflow, runtime assumptions, or published behavior.

## Rules

- Keep docs short, explicit, and non-redundant.
- Use `must`, `must not`, and `may` for rules; avoid fluffy rationale unless it removes ambiguity.
- Put canonical truth in `docs/*`.
- Put execution playbooks in `.agents/skills/*`.
- Update `AGENTS.md` only when the top-level operating rules changed.

## Update checklist

1. If structure changed, update `docs/structure.md`.
2. If extension rules changed, update `docs/extension-points.md`.
3. If inheritance rules changed, update `docs/inheritance-boundaries.md`.
4. If execution workflow changed, update the matching `.agents/skills/*`.
5. If review expectations changed, update `.agents/review-checklist.md`.

## Anti-pattern

Do not leave the true rule in your head while the docs still describe the old rule.
