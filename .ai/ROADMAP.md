# ROADMAP — 72-Hour Ayurvedic Super App (Subphases Breakdown)

**Project:** Amrutam Ayurvedic Super App (`ayurvedic_super`)

**Constraint:** 72-Hour Delivery Window (Target Effort: ~40–48 hours)

---

## 🏛️ Phase 1: Foundation & Core Infrastructure (Day 1, ≈14–16 hrs)

| Subphase | Name | Focus & Deliverables | Est. Time |
| :--- | :--- | :--- | :--- |
| **1.1** | **Project Setup & Domain Architecture** | Strict TypeScript, tsconfig path aliases (`@app/*`, `@core/*`, etc.), core Result/Pagination types, pure domain entity models. | 1.5 hrs |
| **1.2** | **API Client & Fault Injection Layer** | Custom typed fetch wrapper, timeout (`AbortController`), exponential backoff retry, typed errors (`NetworkError`, `ApiError`, `SessionExpiredError`), chaos fault injection server. | 3.0 hrs |
| **1.3** | **Design System & Theming Engine** | Ayurvedic color tokens (Forest Green / Earth), dark mode, typography & spacing tokens, shared UI primitives (`Button`, `Card`, `Skeleton`, `EmptyState`, `Toast`, `ErrorBoundary`). | 3.5 hrs |
| **1.4** | **Navigation & Routing Architecture** | React Navigation native stacks & bottom tabs, `RoutePaths` constants, strongly-typed route params. | 1.5 hrs |
| **1.5** | **Mock Data Generators (Scale: 5k/20k/10k)** | `@faker-js/faker` scripts generating 5,000 doctors, 20,000 products, and 10,000 health records into memory/fixtures. | 2.0 hrs |
| **1.6** | **Offline Layer & Sync Queue** | MMKV storage abstraction, persisted offline `syncQueue` (enqueue/flush on reconnect), structured logger. | 3.0 hrs |

---

## 🛍️ Phase 2: Feature Depth & Massive Scale Virtualization (Day 2, ≈16–18 hrs)

| Subphase | Name | Focus & Deliverables | Est. Time |
| :--- | :--- | :--- | :--- |
| **2.1** | **Shop: 20,000 Products Feed & Search** | `@shopify/flash-list` infinite scroll, server-style pagination (20–30 items/batch), debounced multi-filter & sorting, normalized Zustand store slice. | 4.0 hrs |
| **2.2** | **Shop: Product Details, Cart & Checkout** | Product details screen, local MMKV cart persistence, pure `CartCalculator` (subtotal, discounts, delivery fee), offline cart sync queue. | 4.0 hrs |
| **2.3** | **Consultations: 5,000 Doctors Directory & Slots** | Virtualized doctor listing, search & specialty filter, doctor profile screen, date & slot picker. | 4.0 hrs |
| **2.4** | **Consultations: Slot Conflict Engine & Booking** | Pure `SlotConflictValidator` (slot conflict, expired slot, double-booking validation), optimistic booking with offline queue & revalidation. | 2.5 hrs |
| **2.5** | **Health Records: 10,000 Patient Timeline** | Multi-type timeline (Lab, Prescription, Consultation, Vaccine, Allergy), pure `TimelineGrouper` (Month/Year grouping), search by tags, attachment preview. | 3.5 hrs |

---

## 🛡️ Phase 3: Hardening, Reliability, Testing & Docs (Day 3, ≈10–14 hrs)

| Subphase | Name | Focus & Deliverables | Est. Time |
| :--- | :--- | :--- | :--- |
| **3.1** | **Reliability Pass & 4 UI States** | Wire chaos fault simulator into screens; verify 4 explicit UI states on every screen (Loading Skeleton, Empty State, Error with Retry, Data). | 2.5 hrs |
| **3.2** | **Performance Pass & Profiling** | `React.memo` row optimizations, stable callbacks (`useCallback`), verify 60 FPS scrolling on 20k list, dark mode & accessibility labels. | 2.0 hrs |
| **3.3** | **Bonus 1: Secure Local Storage** | Encrypted MMKV instance for sensitive session and cart data. | 1.0 hr |
| **3.4** | **Bonus 2: Deep Linking** | React Navigation URL routing mapping directly to specific doctors, products, and health records. | 1.0 hr |
| **3.5** | **Bonus 3: Localization (EN / HI)** | English and Hindi translations for Ayurvedic terminology and core screens. | 1.0 hr |
| **3.6** | **Testing & Architectural README** | Pure domain unit tests (Slot Conflict, Cart Calculator, Timeline Grouper), E2E booking & checkout user flow, comprehensive README. | 3.0 hrs |

---

*Run `npm run track` to see real-time progress against all 16 subphases.*
