# Secondary Development

Use this core template to build stronger layers without losing the Rendo language.

## Required Workflow

1. Read `AGENTS.md`.
2. Read `.agents/skills/rendo-workspace-mode/SKILL.md`.
3. Read `.agents/skills/rendo-boundaries/SKILL.md`.
4. Read `docs/structure.md` and `docs/extension-points.md`.
5. Add tests before claiming behavior is settled.
6. Update interface surfaces, capabilities, and docs in the same change when behavior or boundaries move.

## Put Opinions In The Right Layer

- Put engineering language in `core`.
- Put official reference implementation in `base`.
- Put product and scenario opinion in `derived`.
