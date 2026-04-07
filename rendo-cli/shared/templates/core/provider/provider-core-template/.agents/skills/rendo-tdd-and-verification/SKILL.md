---
name: rendo-tdd-and-verification
description: Enforce test-first changes and fresh verification evidence for code, contract, and structure updates.
origin: Rendo
---

# Rendo TDD And Verification

## Purpose

Use this skill for any code or contract change.

## Rules

- Add or update tests before claiming behavior is complete.
- Prefer the smallest test set that proves the changed contract.
- Keep `scripts/health.mjs` and verification entrypoints truthful.
- Do not claim success without fresh verification evidence.

## Minimum Verification

1. Structure still matches the claimed contract.
2. Changed behavior has matching tests.
3. Health/check commands still pass or failures are explicitly explained.
4. Docs do not contradict the implemented behavior.
