# Authoring

This directory holds author-side starter generation assets.

## Goal

Keep Domain Starter generation sustainable by separating:

- shared generation pipeline
- domain classification
- starter-specific overlays

## Current shape

- `starter-templates/`: authoring assets for starter templates, organized by role and category

The generated template output lives under `shared/templates/`, because that is what both CLI implementations consume.
