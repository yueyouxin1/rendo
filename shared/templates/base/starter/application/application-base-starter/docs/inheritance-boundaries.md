# Inheritance Boundaries

## Derived starters may change

- landing pages and product UX
- tech choices inside `apps/*`
- extra packages under `packages/*`
- default providers, env requirements, and business modules

## Derived starters should preserve

- the root control-plane files
- the meaning of `apps/*` versus `packages/*`
- the dedicated install roots for non-starter assets
- the rule that surface selection happens at `rendo create` time

## Do not blur these boundaries

- do not move shared domain logic into one surface without a good reason
- do not install provider/capability assets directly into `apps/web`
- do not turn optional surfaces into hidden hard requirements
- do not erase the documented control plane with ad-hoc scripts
