# Extension Points

- `feature/README.md`
- `feature/widgets.json`
- host routes or surface shells that render the feature
- future dashboard-specific UI modules that stay inside the feature boundary

## Host rule

This template should be mounted by a starter host through `features/<template-id>` rather than copied into a surface-specific app root.
