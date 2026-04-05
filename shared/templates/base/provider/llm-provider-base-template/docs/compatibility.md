# Compatibility

## Current version

- Template version: `0.2.0`
- CLI minimum: `0.2.0`
- Registry protocol minimum: `1.0.0`

## Upgrade rule

- Core templates may tighten docs and diagnostics in patch releases.
- Core templates must not silently become product templates, vendor templates, or runtime-coupled starters.
- Any breaking structural change should land in a new major line rather than drifting the current control-plane contract.
