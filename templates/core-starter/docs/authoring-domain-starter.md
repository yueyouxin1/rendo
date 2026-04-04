# Authoring A Domain Starter

Use this Core Starter as the only authoring substrate.

## Author workflow

1. Run `rendo init my-domain-starter`
2. Adjust `rendo.template.json` from `core-starter` to `domain-starter`
3. Add the smallest domain-specific behavior you need
4. Keep the runtime and extension points explicit
5. Publish that resulting template so users can consume it with `rendo create`

## Validation target

The repository's `hello-world-starter` is intentionally tiny and exists to prove this flow.
