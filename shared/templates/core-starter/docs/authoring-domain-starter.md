# Authoring A Domain Starter

Use this Core Starter as the only authoring substrate.

## Author workflow

1. Run `rendo init my-domain-starter`
2. Adjust `rendo.template.json` from `core-starter` to `domain-starter`
3. Add the smallest domain-specific behavior you need
4. Keep the runtime and extension points explicit
5. Publish that resulting template so users can consume it with `rendo create`

## Validation target

The repository's `application-base-starter` is the current canonical base for interface applications, and `ai-web-next-fastapi-starter` is a derived example built on top of it.
