# Inheritance Boundaries

## Derived starters may change

- landing pages and product UX
- tech choices inside `src/apps/*`
- extra shared modules under `src/packages/*`
- default providers, env requirements, and business modules

## Derived starters should preserve

- the root control-plane files
- the rule that `src/` is the sole implementation root
- the meaning of `src/apps/*` versus `src/packages/*`
- the dedicated integration roots for non-starter assets
- the rule that surface selection happens at `rendo create` time

## Do not blur these boundaries

- do not move shared domain logic into one surface without a good reason
- do not integrate provider/capability assets directly into `src/apps/web`
- do not turn optional surfaces into hidden hard requirements
- do not erase the documented control plane with ad-hoc scripts
