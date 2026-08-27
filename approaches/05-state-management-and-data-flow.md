# Approach 05: State Management & Data Flow

## 1. Choice: Zustand (+ Immer)
- **Why Zustand?** Zero boilerplate, operates outside React lifecycle, supports granular selector subscriptions to prevent re-rendering 5k/20k item lists.

## 2. Store Architecture Guidelines
- **Normalized Data Slices:** Entity collections stored as normalized dictionaries `Record<string, Entity>` paired with ordered ID arrays `string[]`.
- **Derived Computations via Selectors:** Cart totals, active filters, and sorted views computed via memoized selectors, not stored redundantly.
- **Pure Stores:** Stores only hold client state and synchronous setters; they do not make raw HTTP network calls directly.

## 3. Presentation Hooks Bridge
- Feature screens consume custom presentation hooks (`useDoctorList`, `useCartActions`, `useHealthTimeline`).
- Hooks invoke Use Cases for business execution and update Zustand stores with results.
