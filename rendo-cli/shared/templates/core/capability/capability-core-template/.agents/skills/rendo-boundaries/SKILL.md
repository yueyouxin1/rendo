---
name: rendo-boundaries
description: Decide whether a change belongs in core, base, or derived without weakening frozen Rendo boundaries.
origin: Rendo
---

# Rendo Boundaries

## Purpose

Use this skill before adding new files, directories, or stronger opinions.

## Rules

- `core` freezes engineering language, not product shape.
- `base` is the official reference implementation of that language.
- `derived` is where product, scenario, and community opinion belongs.
- Do not move product or vendor decisions down into `core`.
- Do not weaken frozen roots from `core` when working in `base` or `derived`.

## Decision Test

Ask:

1. Is this defining the language of the workspace?
2. Is this an official best-practice implementation detail?
3. Is this a product or scenario opinion?

If the answer is:

- `1`, it belongs in `core`
- `2`, it belongs in `base`
- `3`, it belongs in `derived`
