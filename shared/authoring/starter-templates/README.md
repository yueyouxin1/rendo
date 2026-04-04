# Starter Template Authoring

Each Starter Template should be organized by:

1. template role
2. starter category
3. concrete starter profile
4. internal layers inside that profile

## Directory convention

```txt
shared/authoring/starter-templates/
  <role>/
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

Current official assets:

- `base/application/application-base`
- `derived/ai-webapp/next-fastapi-landing`
