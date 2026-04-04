# Authoring

This directory holds author-side starter generation assets.

## Goal

Keep Domain Starter generation sustainable by separating:

- shared generation pipeline
- domain classification
- starter-specific overlays

## Current shape

- `domain-starters/`: starter authoring assets grouped by domain category

The generated starter output still lives under `templates/`, because that is what the CLI consumes.
