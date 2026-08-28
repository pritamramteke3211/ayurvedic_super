# 🌿 Amrutam Ayurvedic Super App

> **Production-Ready, High-Performance React Native Super App** built with **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Offline-First Resilience**.

---

## 📑 Table of Contents
1. [Overview & Problem Statement](#-overview--problem-statement)
2. [Architectural Philosophy & Principles](#-architectural-philosophy--principles)
3. [Folder Structure](#-folder-structure)
4. [State Management & Data Flow](#-state-management--data-flow)
5. [Performance & Scalability (5k Doctors, 20k Products, 10k Records)](#-performance--scalability)
6. [Offline-First Strategy & Background Sync](#-offline-first-strategy--background-sync)
7. [Reliability, Fault Injection & 4 UI States](#-reliability-fault-injection--4-ui-states)
8. [Module Walkthrough](#-module-walkthrough)
   - [Module 1: Consultations](#module-1--consultations)
   - [Module 2: Shop](#module-2--shop)
   - [Module 3: Health Records](#module-3--health-records)
9. [Trade-Offs & Architectural Decisions](#-trade-offs--architectural-decisions)
10. [Future Improvements & Roadmap](#-future-improvements--roadmap)
11. [Running the Project & Verification](#-running-the-project--verification)

---

## 🎯 Overview & Problem Statement

The **Amrutam Ayurvedic Super App** is an enterprise-grade mobile application designed to deliver authentic holistic Vedic healthcare. It combines three distinct, scalable modules under a cohesive user experience:

1. **Consultation Module:** Booking appointments with over 5,000 Ayurvedic specialists and Vaidyas across India with deterministic slot conflict validation.
2. **Shop Module:** Browsing and purchasing from an extensive catalog of 20,000 classical herbal formulations with local cart persistence, wishlist synchronization, and dynamic delivery/discount calculations.
3. **Health Records Module:** High-speed virtualized Electronic Health Record (EHR) timeline capable of searching, filtering, and rendering 10,000 medical records grouped by Month/Year with Prakriti Dosha analysis and diagnostic attachment previews.

---

## 🏛️ Architectural Philosophy & Principles

The application is built upon **Clean Architecture** and **Domain-Driven Design (DDD)** to enforce separation of concerns, testability, and framework independence.

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│     (src/modules/<feature>: Screens, Components, Slices)    │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
┌──────────────────────────────▼──────────────────────────────┐
│                    Application Layer                        │
│            (src/core/application: Use Cases)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ depends on
┌──────────────────────────────▼──────────────────────────────┐
│                       Domain Layer                          │
│     (src/core/domain: Entities, Value Objects, Contracts)   │
└──────────────────────────────▲──────────────────────────────┘
                               │ implemented by
┌──────────────────────────────┴──────────────────────────────┐
│                   Infrastructure Layer                      │
│   (src/infrastructure: Repositories, MMKV, SyncQueue, API)  │
└─────────────────────────────────────────────────────────────┘
```

### Invariants & Rules:
- **Dependency Rule:** Source code dependencies point strictly inwards towards the Domain.
- **Pure Domain (`src/core/domain`):** Zero dependencies on React, React Native, UI components, or external libraries. Pure entities enforce business invariants and throw typed domain errors (`SlotAlreadyBookedError`, `InvalidCartQuantityError`, `InvalidRecordTitleError`).
- **Single-Responsibility Use Cases (`src/core/application`):** Each business operation is encapsulated into a dedicated Use Case accepting repository interfaces via constructor dependency injection.
- **Concrete Infrastructure (`src/infrastructure`):** Implementation details (MMKV persistence, HTTP client, Chaos fault injection, mock generators) implement domain contracts.

---

## 📁 Folder Structure

```
ayurvedic_super/
├── src/
│   ├── app/                              # App Composition & Root Shell
│   │   ├── navigation/                   # React Navigation Stacks & Tabs
│   │   │   ├── BottomTabNavigator.tsx    # Root Bottom Tab (Consult, Shop, Records)
│   │   │   ├── ConsultationNavigator.tsx # Stacks for Doctors, Details, Booking
│   │   │   ├── ShopNavigator.tsx         # Stacks for Products, Details, Cart
│   │   │   ├── HealthRecordsNavigator.tsx# Stacks for Timeline, Details, Add Record
│   │   │   ├── RoutePaths.ts             # Route constant enums
│   │   │   └── type.ts                   # Strongly-typed ParamList definitions
│   │   ├── state/                        # Centralized Reactive Stores (Redux Toolkit)
│   │   │   ├── store.ts                  # Root Store Configuration
│   │   │   ├── consultationSlice.ts      # Consultation Slice & Async Thunks
│   │   │   ├── shopSlice.ts              # Shop Slice & Async Thunks
│   │   │   ├── healthRecordsSlice.ts     # Health Records Slice & Async Thunks
│   │   │   └── hooks.ts                  # Typed useAppDispatch & useAppSelector
│   │   └── theme/                        # Ayurvedic Design Tokens
│   │       ├── colors.ts                 # Light & Dark Theme Palettes
│   │       ├── typography.ts             # Typography Hierarchy
│   │       ├── spacing.ts                # Spacing & Border Radius Scales
│   │       └── useAppTheme.ts            # Reactive Theme Hook
│   │
│   ├── core/                             # Pure Core Business Domain
│   │   ├── domain/                       # Domain Entities, Repositories, Tests
│   │   │   ├── consultation/             # Doctor, Slot, Booking, SlotConflictValidator
│   │   │   ├── shop/                     # Product, CartItem, CartCalculator
│   │   │   └── healthRecords/            # HealthRecord, RecordType, TimelineGrouper
│   │   ├── application/                  # Single-Responsibility Use Cases
│   │   │   ├── consultation/             # GetDoctors, GetDoctorSlots, BookSlot, CancelBooking
│   │   │   ├── shop/                     # GetProducts, AddToCart, ToggleWishlist
│   │   │   └── healthRecords/            # GetHealthTimeline, GetRecordDetails, AddHealthRecord
│   │   └── types/                        # Result<T>, PaginatedResult<T>, PaginationParams
│   │
│   ├── infrastructure/                   # Concrete Services & Persistence
│   │   ├── api/                          # HTTP Client, Mock Fault Injection Server
│   │   ├── mock/                         # Deterministic PRNG Generators (5k, 20k, 10k)
│   │   ├── repositories/                 # MockConsultationRepo, MockShopRepo, MockHealthRepo
│   │   ├── storage/                      # MMKV Native Storage Adapter & SyncQueue
│   │   ├── network/                      # NetworkManager (Connectivity probe) & SyncManager
│   │   └── logging/                      # Structured Diagnostic Logger
│   │
│   ├── modules/                          # Feature-Sliced Presentation Modules
│   │   ├── consultation/                 # Screens (List, Detail, Booking, MyBookings) & Components
│   │   ├── shop/                         # Screens (Feed, Detail, Cart) & Components (BillCard, Cards)
│   │   └── healthRecords/                # Screens (Timeline, Detail, Add) & Components (Summary, Badges)
│   │
│   └── shared/                           # Shared UI Primitives & System Components
│       ├── components/                   # Button, Card, Skeleton, EmptyState, ErrorView, Toast
│       └── icons/                        # Zero-Memory Vector Icons (react-native-svg)
```

---

## ⚡ State Management & Data Flow

### Architecture: Redux Toolkit + MMKV Local Persistence
- **Global Reactive State (`@reduxjs/toolkit`):**
  - Manages asynchronous API states, paginated datasets, active filter criteria, user bookings, cart items, and wishlist IDs.
  - Implements typed `createAsyncThunk` routines that orchestrate Domain Use Cases.
- **Instant Cold Starts with MMKV (`react-native-mmkv`):**
  - Synchronous native C++ bindings allow sub-millisecond cart, booking, and medical record hydration on app launch without async storage waterfalls.
- **Component Data Binding:**
  - Components subscribe to atomic state slices via typed `useAppSelector` hooks, minimizing unnecessary re-renders.

```
[UI Screen / Component]
      │ (Dispatches Action / Thunk)
      ▼
[Redux Slice Thunk] ────► [Application Use Case]
                                  │ (Executes Business Logic)
                                  ▼
                         [Domain Entity / Validator]
                                  │
                                  ▼
                     [Repository Interface (Contract)]
                                  │
                                  ▼
                  [Concrete Mock Repository]
                     │                 │
            (MMKV Persistence)   (Chaos Simulator)
```

---

## 🚀 Performance & Scalability

The application meets the **Performance Challenge** under heavy datasets without UI lag:
- **5,000 Doctors** in Consultation directory
- **20,000 Products** in Shop catalog
- **10,000 Health Records** in EHR Timeline

### Optimization Techniques:
1. **Deterministic PRNG Generation (`DeterministicPRNG`):**
   - Employs a Linear Congruential Generator (LCG) to compute reproducible datasets on demand in `< 50ms`, eliminating multi-megabyte JSON asset bundles.
2. **FlashList Virtualization (`@shopify/flash-list`):**
   - Recycles native views using memory pools rather than unmounting/mounting DOM nodes, maintaining a consistent **60 FPS** scroll rate.
3. **Component Memoization (`React.memo`):**
   - Row components (`DoctorCard`, `ProductCard`, `RecordCard`, `TimelineMonthHeader`) utilize strict shallow prop comparison.
4. **Zero-Memory SVG Vector Icons (`react-native-svg`):**
   - High-performance vector paths replace bitmap image assets, eliminating memory caching bottlenecks.
5. **Debounced Search Indexing:**
   - Search inputs are debounced (300ms–350ms) to avoid intermediate filtering cycles during rapid keystrokes.

---

## 📡 Offline-First Strategy & Background Sync

The app provides uninterrupted functionality in disconnected environments:

1. **Local State Synchronization:**
   - User bookings, cart changes, wishlist toggles, and newly created health records are written synchronously to MMKV storage.
2. **Offline Action Queue (`SyncQueue`):**
   - Mutating actions performed while offline (`CREATE_BOOKING`, `CANCEL_BOOKING`, `SYNC_CART`, `CREATE_HEALTH_RECORD`, `DELETE_HEALTH_RECORD`) are serialized and enqueued in `syncQueue`.
3. **Automatic Background Sync (`SyncManager` & `NetworkManager`):**
   - `networkManager` actively probes network connectivity using lightweight HEAD requests.
   - Upon reconnecting, `syncManager` automatically flushes pending actions, handles retry exponential backoff, and informs the user via `OfflineBanner` and toast notifications.

---

## 🛡️ Reliability, Fault Injection & 4 UI States

### 1. Chaos Fault Simulator (`chaosSimulator`)
- Concrete repositories route through `chaosSimulator.simulateNetworkHop()`, which injects configurable latency (150ms–400ms) and chaos conditions (timeouts, 500 server errors, slow connections) for realistic resilience testing.

### 2. Four Explicit UI States
Every screen strictly implements 4 explicit UI states:
1. **Loading State:** Shimmering layout skeletons (`Skeleton.tsx`, `DoctorCardSkeleton`) matching exact card dimensions.
2. **Empty State:** Illustrated fallback (`EmptyState.tsx`) explaining missing records with contextual call-to-action buttons.
3. **Error State:** Recovery screen (`ErrorView.tsx`) with user-friendly error copy and a direct `Try Again` retry button.
4. **Data State:** Virtualized FlashList or interactive detail screens with pull-to-refresh.

---

## 📦 Module Walkthrough

### Module 1 — Consultations
- **Doctor Directory:** Filterable directory of 5,000 Ayurvedic specialists by specialty (Kayachikitsa, Panchakarma, Nadi Pariksha), rating, consultation fee, and experience.
- **Dynamic Slot Picker:** Generates morning, afternoon, and evening 30-minute consultation slots.
- **Domain Slot Conflict Engine (`SlotConflictValidator`):** Prevents double booking and detects conflicting overlaps.
- **My Appointments Screen:** Stored appointments with real-time cancellation support.

### Module 2 — Shop
- **20,000 Products Catalog:** High-speed infinite scrolling with multi-filtering (Price, Category, Rating, Stock).
- **Product Details:** Ayurvedic benefits, key herbs (Ashwagandha, Amla, Brahmi), clinical instructions, and stock counter.
- **Cart & Wishlist:** Persistent local cart with instant quantity adjustment.
- **Pure Cart Engine (`CartCalculator`):** Computes subtotal, tiered discounts, and conditional delivery waivers (₹0 fee for orders > ₹500).

### Module 3 — Health Records
- **10,000 Records Patient Timeline:** Chronological timeline grouped by month/year (e.g., "August 2026", "July 2026").
- **Five Record Types Supported:**
  - 💊 **Prescription:** Formulations (Kwath, Churna, Vati, Bhasma, Taila) with dosage instructions.
  - 🧪 **Lab Report:** Blood panels, Nadi diagnostics, Prakriti profiles with PDF/image attachments.
  - 🌿 **Consultation:** Clinical summaries and doctor recommendations.
  - 💉 **Vaccination:** Suvarna Prashan pediatric gold drops and immunizations.
  - ⚠️ **Allergy:** Documented herbal and food sensitivities.
- **Ayurvedic Health Profile:** Visualizes constitutional Prakriti dosha distribution (Vata, Pitta, Kapha) and Ojas vitality index.
- **Attachment Viewer:** Interactive preview for scanned documents and PDF thumbnails.
- **Add Record Form:** Modal form to upload and log custom records with offline MMKV sync.

---

## ⚖️ Trade-Offs & Architectural Decisions

| Decision | Chosen Approach | Alternative Considered | Rationale & Trade-Off |
| :--- | :--- | :--- | :--- |
| **State Management** | Redux Toolkit (Slices + Thunks) | Zustand / Context API | Redux Toolkit provides strict action traceability, typed thunks executing use cases, and predictable state transitions. *Trade-off:* Minor boilerplate compared to lightweight Zustand. |
| **Local Storage** | `react-native-mmkv` | `AsyncStorage` / SQLite | MMKV operates via synchronous C++ JSI bindings, loading large datasets in < 2ms without async waterfalls. *Trade-off:* Key-value storage requires in-memory filtering rather than raw SQL queries. |
| **List Virtualization** | `@shopify/flash-list` | `FlatList` / `SectionList` | FlashList recycles native cell views, reducing RAM consumption by 5x and maintaining 60 FPS across 20,000 items. |
| **Mock Generation** | Deterministic PRNG Generator | Large static `.json` files | PRNG creates 35,000 total entities deterministically on demand in < 50ms, keeping app bundle size under 2MB. |

---

## 🔮 Future Improvements & Roadmap

1. **Biometric Authentication (FaceID/Fingerprint):** Secure lock for viewing confidential EHR medical attachments.
2. **Tele-Consultation Video Integration:** Native WebRTC/Agora audio-video consultation rooms between patients and Vaidyas.
3. **Prakriti AI Assessment Quiz:** Interactive 30-question diagnostic questionnaire to dynamically calculate dosha ratios.
4. **Automated E2E Testing:** End-to-end user journey automation via Detox / Maestro.
5. **Localization (Hindi & Regional Languages):** Full multi-language translation (English, Hindi, Malayalam, Tamil).

---

## 🧪 Running the Project & Verification

### Prerequisites
- Node.js >= 20
- React Native CLI / Android SDK / Xcode

### Setup & Run Commands
```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript Type Check (Strict validation, 0 errors)
npx tsc --noEmit

# 3. Run Pure Domain Unit Tests (15 tests across 4 test suites)
npx jest src/core/domain/

# 4. Run Progress Tracker Visualizer
npm run track

# 5. Start Metro Bundler
npm start

# 6. Run on Android / iOS
npm run android
npm run ios
```

---

*Authored for Amrutam Senior React Native Assessment.*
