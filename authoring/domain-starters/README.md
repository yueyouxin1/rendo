# Domain Starter Authoring

Each Domain Starter should be organized by:

1. domain category
2. concrete starter profile
3. internal layers inside that profile

## Directory convention

```txt
authoring/domain-starters/
  <category>/
    <starter-name>/
      profile.json
      overlay/
```

## Layer meaning

- `profile.json`: structured metadata for generation
- `overlay/`: the file tree that differs from `Core Starter`

## Design rule

The generation pipeline should stay generic.
Starter-specific behavior should live in profile data and overlay files, not in ad-hoc script branches.
