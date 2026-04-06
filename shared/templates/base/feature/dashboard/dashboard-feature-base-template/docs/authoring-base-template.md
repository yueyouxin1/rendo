# Authoring A Base Template

Use this core template when you need the official or internal `base` template for `feature templates`.

## Responsibilities of the base layer

- preserve the control plane defined by the core layer
- add the canonical best-practice directory layout for this template kind
- narrow runtime and host assumptions only when they are intentional and documented
- make second-stage agent customization easier, not harder

## Minimum checklist

- keep `lineage.coreTemplate` pointing to `feature-core-template`
- add or override docs that explain the new structure and inheritance boundaries
- keep install, pull, and upgrade semantics explicit when the template kind supports them
- avoid embedding irreversible product or vendor assumptions unless that is the purpose of the base
