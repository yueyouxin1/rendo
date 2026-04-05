# Template Authoring

Each template authoring profile is organized by:

1. template role
2. template kind
3. category
4. concrete template id

## Directory convention

```txt
shared/authoring/templates/
  <role>/
    <kind>/
      <category>/
        <template-id>/
          profile.json
          overlay/
```

## Layer meaning

- `profile.json`: structured metadata for generation
- `overlay/`: the file tree that differs from the lower template layer

## Design rule

The generation pipeline should stay generic.
Template-specific behavior should live in profile data and overlay files, not in ad-hoc script branches.

