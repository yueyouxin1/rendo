# Shared Contracts

These files define language-neutral Rendo contracts.

Both the Node CLI and the Python CLI should interpret these concepts identically, even if validation is implemented in different languages.

Current template-facing contracts:

- `template-manifest.schema.json`
- `project-manifest.schema.json`
- `template-profile.schema.json`
- `registry-handshake.schema.json`
- `remote-registry-api.schema.json`
- `template-bundle.schema.json`

## Contract rule

Template manifests should be enough for a strong agent to answer three questions without opening extra code first:

1. What kind of template is this, and which layer does it belong to?
2. Which docs explain its structure, extension points, and secondary-development workflow?
3. How can it be created, installed, or hosted safely?
