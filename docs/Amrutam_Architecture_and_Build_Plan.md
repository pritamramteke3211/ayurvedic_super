# Amrutam Ayurvedic Super App — Architecture & Development Plan

**Constraint:** Deliver within 72 hours. Target effort: ~40–48 hours of focused work, leaving buffer for debugging, polish, and documentation.

---

## 1. Guiding Principles

1. **One shared foundation, uneven module depth.** All three modules (Consultation, Shop, Health Records) sit on the same architecture, but Shop gets the deepest implementation since it carries the hardest performance requirement (20,000 products). This is a deliberate, documented trade-off — not a shortcut.
2. **Independence over reuse-at-all-costs.** Each module owns its types, hooks, and screens. Only cross-cutting concerns (API layer, storage, theming, components, sync) live in `/shared`.
3. **Correctness of business logic > UI polish.** Slot conflict detection, cart totals, and sync queue behavior should be pure, tested functions — not logic buried in components.
4. **Everything assumes the network will fail.** Every data-fetching hook is written offline-first from day one, not retrofitted later.

---

## 2. Tech Stack

| Concern | Choice | Reasoning |
|---|---|---|
| Language | TypeScript (strict mode) | Required by brief |
| Navigation | React Navigation (native-stack + bottom-tabs) | Required by brief |
| State management | Zustand (+ Immer middleware) | Lightweight, minimal boilerplate for a 72-hour window, easy to test in isolation. (RTK is a valid alternative if more comfortable with it — document the choice either way.) |
| Lists at scale | `@shopify/flash-list` | Required in practice for 5k/20k/10k item virtualization |
| Local persistence | MMKV (key-value: cart, wishlist, session) + a simple JSON-based offline queue | Fast, synchronous, battle-tested for RN offline needs |
| Networking | Fetch wrapped in a custom typed client | Full control over timeout/retry/error-shape without extra dependency weight |
| Forms/validation | Native state + small validation utils | Booking/checkout forms are simple enough not to need a form library |
| Testing | Jest + React Native Testing Library | Standard, required by brief |
| Mock data | `@faker-js/faker` | Fast generation of 5k/20k/10k realistic records |
| Icons/UI primitives | `react-native-svg` + custom design system | Keeps bundle lean, full theming control |

---

## 3. High-Level Architecture

```
src/
├── app/
│   ├── App.tsx                  # Root: ErrorBoundary + ThemeProvider + Navigation
│   ├── navigation/               # RootNavigator, TabNavigator, per-module stacks
│   └── config/                   # env config, feature flags, constants
│
├── shared/
│   ├── api/
│   │   ├── client.ts             # fetch wrapper: timeout, retry, backoff, abort
│   │   ├── errors.ts             # typed error classes (NetworkError, TimeoutError, ApiError, ParseError)
│   │   └── mockServer.ts         # simulated latency/failure/empty/partial responses
│   ├── storage/
│   │   ├── mmkv.ts               # typed get/set wrappers
│   │   └── syncQueue.ts          # offline action queue + flush-on-reconnect
│   ├── hooks/
│   │   ├── useNetworkStatus.ts
│   │   ├── useAsync.ts           # loading/error/data pattern used across modules
│   │   └── useDebouncedValue.ts  # for search inputs
│   ├── components/               # Button, Card, ListItem, Skeleton, EmptyState,
│   │                              # Toast, ErrorBoundary, SearchBar, FilterSheet
│   ├── theme/                    # tokens, light/dark themes, ThemeProvider
│   ├── logger/                   # logging utility (levels, structured output)
│   └── types/                    # shared cross-module types (Money, Pagination, etc.)
│
├── features/
│   ├── consultation/
│   │   ├── api/                  # doctor + slot mock endpoints
│   │   ├── store/                # zustand slice: doctors, filters, bookings
│   │   ├── hooks/                # useDoctorSearch, useSlotBooking, useBookingConflicts
│   │   ├── components/           # DoctorCard, SlotPicker, BookingSummary
│   │   ├── screens/               # DoctorList, DoctorDetails, Booking, Upcoming
│   │   └── utils/                 # slot conflict / expiry validation (pure fns, tested)
│   │
│   ├── shop/
│   │   ├── api/
│   │   ├── store/                # products, cart, wishlist, filters/sort
│   │   ├── hooks/                # useInfiniteProducts, useCart, useWishlist
│   │   ├── components/           # ProductCard, CartItem, FilterBar, SortSheet
│   │   ├── screens/               # ProductList, ProductDetails, Cart, Checkout
│   │   └── utils/                 # cart total / discount calculation (pure fns, tested)
│   │
│   └── healthRecords/
│       ├── api/
│       ├── store/                # records, filters, tags
│       ├── hooks/                # useTimelineGroups, useRecordSearch
│       ├── components/           # RecordCard, MonthHeader, AttachmentThumbnail
│       ├── screens/               # Timeline, RecordDetails
│       └── utils/                 # month/year grouping (pure fn, tested)
│
├── __tests__/                     # or co-located *.test.ts next to source
└── mockData/                      # generated JSON fixtures (5k/20k/10k)
```

**Rule enforced throughout:** `features/*` never import from another `features/*` — only from `shared/*`. This is what makes "three independent modules" true rather than aspirational.

---

## 4. Core Architectural Decisions

### 4.1 API Abstraction Layer
- Single `apiClient.request<T>()` function wrapping `fetch` with: configurable timeout (AbortController), exponential backoff retry (max 3 attempts) for idempotent GETs, typed error mapping (network vs timeout vs 4xx/5xx vs JSON parse failure), and structured logging on every failure.
- Mock server layer sits behind the same interface and can be configured to inject latency, random failures, empty responses, partial/malformed JSON — so reliability requirements are testable on demand, not just theoretical.

### 4.2 State Management & Data Flow
- Each feature owns one Zustand store slice. Server data is normalized by ID (`Record<string, Entity>`) with separate ordered ID arrays for list rendering — avoids re-sorting/re-filtering large arrays on every render.
- Derived data (filtered/sorted lists, cart totals) computed via memoized selectors, not stored redundantly.
- `useAsync`-style hook standardizes loading/error/data/retry shape across all three modules so screens are predictable.

### 4.3 Offline-First Strategy
- **Reads:** every list/detail fetch checks MMKV cache first, renders immediately if present, and revalidates in the background if online (stale-while-revalidate).
- **Writes:** cart mutations and booking attempts always apply optimistically to local state; if offline, the action is also pushed onto a persisted `syncQueue`. A `useNetworkStatus` listener (NetInfo) flushes the queue in order on reconnect, with conflict resolution for bookings (re-check slot availability before confirming).
- This logic lives once in `shared/storage/syncQueue.ts` and is consumed by both Shop (cart/checkout) and Consultation (bookings) — not duplicated per module.

### 4.4 Performance Strategy (5k/20k/10k scale)
- `FlashList` everywhere with `estimatedItemSize`, `getItemType` for heterogeneous rows (Health Records mixes card types), and stable `keyExtractor`.
- Search/filter inputs debounced (250ms) before touching the store.
- Expensive row components wrapped in `React.memo` with primitive-only props; avoid passing new object/function references from parent on each render (stable callbacks via `useCallback`/store actions).
- Pagination for Shop (server-style, 20–30 items/page even against mock data) rather than rendering all 20,000 at once, on top of virtualization.
- Images/thumbnails lazy-loaded and sized to render target to avoid decode cost on large lists.

### 4.5 Reliability & Error Handling
- Global `ErrorBoundary` at the navigation root catches render-time crashes and shows a recoverable fallback screen.
- Every screen-level fetch renders one of four explicit states: loading (skeleton), empty, error (with retry action), or data — no silent failures.
- Session expiration is modeled as a specific `ApiError` subtype that triggers a global "session expired" toast + redirect to a re-auth stub screen.

### 4.6 Developer Experience
- Shared design system (`shared/components`) is the only place raw styling constants are used — feature code consumes theme tokens only.
- Barrel exports (`index.ts`) per feature so imports read as `import { useCart } from '@/features/shop'`.
- Path aliases (`@/shared`, `@/features/...`) configured via `babel-plugin-module-resolver` + `tsconfig` paths.

---

## 5. Development Plan (Phased, ≤72 Hours)

### Day 1 — Foundation (≈14–16 hrs)

| Phase | Tasks | Est. Hours |
|---|---|---|
| 1. Project setup | Init RN + TS project, ESLint/Prettier, path aliases, env config, folder skeleton | 1.5 |
| 2. Core infra | API client (timeout/retry/error types), logger, mock server with fault injection | 3 |
| 3. Design system | Theme tokens + light/dark, Button, Card, ListItem, Skeleton, EmptyState, Toast, ErrorBoundary | 3.5 |
| 4. Navigation | Root navigator, tab structure, per-module stack scaffolds | 1.5 |
| 5. Mock data | Faker scripts generating 5k doctors, 20k products, 10k records to JSON fixtures | 2 |
| 6. Offline layer | MMKV wrappers, `syncQueue`, `useNetworkStatus` | 3 |

**End of Day 1 checkpoint:** app boots, navigates between three empty module shells, offline queue and API client are unit-testable in isolation.

### Day 2 — Feature Depth (≈16–18 hrs)

| Phase | Tasks | Est. Hours |
|---|---|---|
| 7. Shop — listing & search | FlashList product list, infinite scroll/pagination, debounced search, multi-filter, sort | 4 |
| 8. Shop — details, cart, checkout | Product details, cart with MMKV persistence + offline queueing, wishlist, checkout summary | 4 |
| 9. Consultation — listing & booking | Doctor list (virtualized), search/filters, doctor details, slot picker, conflict/expiry/double-booking validation (pure fns) | 4 |
| 10. Consultation — booking flow | Booking confirmation, upcoming list, cancel flow, offline booking queue integration | 2.5 |
| 11. Health Records — timeline | FlashList section-list grouped by month/year, filters, tag search, attachment thumbnail component | 3.5 |

**End of Day 2 checkpoint:** all three modules functionally complete against mocked data; offline cart and offline bookings both queue and flush correctly.

### Day 3 — Hardening, Testing, Docs (≈10–14 hrs)

| Phase | Tasks | Est. Hours |
|---|---|---|
| 12. Reliability pass | Wire fault-injection scenarios (slow network, timeout, random failure, empty/partial/invalid responses, session expiry) into each module's screens; verify all four UI states render correctly | 2.5 |
| 13. Performance pass | Profile 20k product list with Flipper/dev tools, confirm `React.memo`/stable callbacks, remove unnecessary re-renders, verify dark mode + accessibility labels | 2 |
| 14. Bonus features (pick 3) | e.g. Deep Linking, Secure local storage (MMKV encryption), Localization (2 languages) | 3 |
| 15. Testing | Unit tests: slot conflict logic, cart total calc, month/year grouping, sync queue behavior; one hook test; one E2E flow (browse → add to cart → checkout) | 3 |
| 16. Documentation | README: folder structure, architectural decisions, state management rationale, performance optimizations, offline strategy, trade-offs, future improvements | 1.5 |

**End of Day 3:** submission-ready build, tests passing, README complete.

---

## 6. Explicit Trade-offs to State in the README

- Shop received the deepest implementation (pagination + full offline cart) because it has the hardest performance constraint; Consultation and Health Records share the same architecture but with lighter feature surfaces given the time box.
- Zustand chosen over Redux Toolkit for lower boilerplate within 72 hours — RTK would be the pick for a larger team/long-lived codebase (as used on production apps like Homzhub/CORA).
- Conflict resolution on offline bookings is optimistic-with-recheck (re-validate slot on sync) rather than a full CRDT/operational-transform approach, which would be overkill at this scope.
- Only 3 bonus features implemented by design, chosen for relevance (offline/security/reach) over breadth.

---

## 7. Bonus Feature Recommendation (Pick 3)

Given the app's nature, the highest-signal three are:

1. **Secure local storage** — MMKV encryption for cart/session data (directly reinforces the offline-first architecture already built).
2. **Deep Linking** — link into a specific doctor, product, or health record (cheap to add given React Navigation is already in place).
3. **Localization (2 languages)** — English + Hindi, relevant for an Ayurvedic health app's actual user base, and demonstrates i18n architecture without much extra time cost.
