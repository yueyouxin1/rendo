# Authoring

This directory holds author-side template generation assets.

## Goal

Keep template generation sustainable by separating:

- shared generation pipeline
- template kind classification
- template-specific overlays

## Current shape

- `templates/`: authoring assets for all template kinds, organized by role, kind, and category

The generated template output lives under `shared/templates/`, because that is what both CLI implementations consume.
