# Approach 01: Clean Architecture & Domain-Driven Design (DDD)

## 1. Architectural Core
The codebase enforces **inward-only dependencies**:
- `src/core/domain/`: Pure business entities, value objects, domain errors, and repository interfaces. Contains **0 React / React Native / DB dependencies**.
- `src/core/application/`: Single-responsibility use cases orchestrating domain rules.
- `src/infrastructure/`: Concrete adapters (MMKV, API Client, SyncQueue, Repositories).
- `src/app/`: Composition root (Navigation, Zustand stores, Theme tokens, Providers).
- `src/modules/*`: Presentation slices (`consultation`, `shop`, `healthRecords`) that never import from sibling modules.

## 2. Rich Domain Entities
Entities encapsulate private fields and expose business invariant methods:
- Immutable getters with defensive copying (e.g. `Doctor.languages` returns `[...this._languages]`).
- Explicit lifecycle transitions (`booking.cancel()`, `booking.confirm()`, `booking.complete()`).
- `toJSON(): Readonly<Props>` with `Object.freeze` for safe UI consumption.

## 3. Dependency Inversion Principle (DIP)
- Use cases depend on abstract repository interfaces (`ConsultationRepository`), never concrete implementations.
- Concrete repositories live in `infrastructure/repositories/` and implement the domain contracts.
