# Architecture & Coding Rules for Ayurvedic Super App

## 1. Clean Architecture & DDD Constraints
- **Domain Layer (`src/core/domain`)**:
  - Contains rich domain entities, value objects, domain errors, and repository interfaces.
  - ZERO external framework dependencies (no React, React Native, UI libraries, or persistence libraries).
  - Business logic and invariant validation must live inside domain entities and value objects.
- **Application Layer (`src/core/application`)**:
  - Single-responsibility Use Cases (e.g. `BookDoctorSlotUseCase`, `AddToCartUseCase`, `GetHealthTimelineUseCase`).
  - Accepts repository interfaces via constructor injection.
- **Infrastructure Layer (`src/infrastructure`)**:
  - Houses technical adapters: typed API client, mock fault injection server, MMKV persistent caching, SQLite (if needed), offline `syncQueue`, and concrete repositories.
- **App Shell (`src/app`)**:
  - Coordinates `AppProviders` (Dependency Injection), Navigation (`MainNavigator`, `TabNavigator`), reactive Zustand stores, theme tokens, and HOC wrappers (`AppWrapper`).
- **Presentation Modules (`src/modules/*`)**:
  - Feature slices (`consultation`, `shop`, `healthRecords`).
  - Each module owns its `presentation/screens`, `presentation/components`, `presentation/hooks`, and `index.ts`.
  - Modules **NEVER** import directly from sibling modules.

## 2. Coding Standards
- **TypeScript**: Strict mode enabled. No `any` types. Strongly type all inputs, outputs, navigation params, and store states.
- **Lists at Scale**: Use `@shopify/flash-list` with `estimatedItemSize`, `getItemType`, and stable `keyExtractor` to handle 5k doctors, 20k products, 10k health records without UI lag.
- **Offline First**: All data reads follow stale-while-revalidate (MMKV cache -> fetch in background). Mutations apply optimistically and push to `syncQueue` when offline.
- **Pure Functions & Testability**: Keep slot conflict logic, cart calculations, and timeline grouping as pure, fully tested functions.
