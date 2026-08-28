# Project Technical Approaches & Architecture Decisions

This directory contains the official technical blueprints, architectural decisions, and design patterns established for the **Amrutam Ayurvedic Super App (`ayurvedic_super`)**.

---

## 📚 Approach Index

| # | Approach Guide | Focus Area | Key Technologies / Patterns |
| :--- | :--- | :--- | :--- |
| **01** | [Clean Architecture & DDD](./01-clean-architecture-and-ddd.md) | Architectural Boundaries & Inward Dependencies | Pure Entities, Value Objects, Use Cases, Repository Contracts |
| **02** | [Offline-First & Local Persistence](./02-offline-first-and-persistence.md) | Offline Actions & Synchronization | MMKV (`mmap`), `SyncQueue`, Stale-While-Revalidate, Optimistic Updates |
| **03** | [Large-Scale Virtualization (5k / 20k / 10k)](./03-large-scale-virtualization.md) | 60 FPS Performance at Scale | `@shopify/flash-list`, Windowed Pagination, `React.memo`, Stable Callbacks |
| **04** | [Network Layer & Fault Injection](./04-network-resilience-and-fault-injection.md) | Chaos Reliability & Error Taxonomy | Custom Fetch, Exponential Backoff, Chaos Simulation Server, 4 UI States |
| **05** | [State Management & Data Flow](./05-state-management-and-data-flow.md) | Reactive Client State & Store Slices | Zustand (+ Immer), Normalized Caches, Presentation Hooks |
| **06** | [Design System & Theming Engine](./06-design-system-and-theming.md) | UI Primitives & Ayurvedic Aesthetic | Theme Tokens (Forest Green / Earth), Light/Dark Modes, Shared Primitives |
| **07** | [Testing Strategy & Invariant Verification](./07-testing-strategy.md) | Deterministic Testing | Pure Domain Unit Tests, Custom Hook Tests, E2E User Flows |

---

## 📖 Guidelines for Developers

Whenever implementing a new feature or modifying existing systems:
1. **Consult the Relevant Approach File**: Verify that your design complies with the established pattern.
2. **Document Deviations / Enhancements**: If a new approach or library is introduced, update or add the corresponding document in this directory.
3. **Preserve Purity**: Never leak UI or database dependencies into `src/core/domain` or `src/core/application`.
