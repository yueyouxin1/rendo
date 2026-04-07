# Authoring

This directory holds author-side template generation assets.

## Goal

Keep template generation sustainable by separating:

- shared generation pipeline
- template kind classification
- template-specific overlays

## Current shape

- `templates/`: authoring assets for all template kinds, organized by role, kind, and category

The generated template output lives under `shared/templates/`, because that internal distribution-asset layer is what both CLI implementations consume.

## Design split

- `shared/authoring/*`: source of change for template authors
- `shared/templates/*`: internal distribution assets consumed by registry and CLI
- `shared/contracts/*`: language-neutral contract definitions used by both layers
