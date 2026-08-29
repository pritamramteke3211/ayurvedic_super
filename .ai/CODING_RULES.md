# CODING RULES — Pitern

## TypeScript

- Strict mode; no unnecessary `any`
- Prefer explicit domain error types over opaque throws where the domain already defines them
- Path aliases / project import conventions as configured

## React Native / UI

- Presentation in `src/modules/*/presentation` (or `src/app` shell)
- No business rules or SQL in screens/hooks beyond orchestration
- Zustand is UI state only — not a persistence layer
- Avoid premature optimization libraries not on the allowed list for the current phase

## Tests

- Domain logic: unit tests preferred
- Cover happy path + meaningful failure cases when adding behavior
- Do not claim “tested” without running or writing tests

## AI code generation limits

After design approval, AI may generate:

- Boilerplate, types, repetitive wiring
- Test scaffolding
- Cosmetic formatting / naming

AI must **not** silently write:

- Domain model invariants
- Use case business rules
- Architecture / dependency direction
- Security-sensitive logic

unless the user has already attempted and explicitly asks for help refining their attempt.

## Tooling

Respect existing ESLint, Prettier, Husky, Jest. Do not add new tooling for novelty.
