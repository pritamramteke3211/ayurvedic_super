# Approach 07: Testing Strategy & Invariant Verification

## 1. Testing Pyramid
1. **Pure Domain Unit Tests (Fastest, Highest ROI):**
   - Test business rules without React Native or DOM overhead.
   - `SlotConflictValidator.test.ts`: Expired slot rejection, slot conflict detection, double-booking interval overlap.
   - `CartCalculator.test.ts`: Subtotal, discounts, free delivery threshold (₹500), quantity changes.
   - `TimelineGrouper.test.ts`: Chronological month/year grouping and sorting.
   - `SyncQueue.test.ts`: Enqueueing, sequential replay, removal.

2. **Custom Hook Tests:**
   - Test async data flows with `@testing-library/react-native` and React Native renderHook.

3. **End-to-End (E2E) Flow Test:**
   - Complete critical user path: Browse 20k catalog ➡️ Filter by category ➡️ Add to Cart ➡️ Modify Quantity ➡️ Checkout Summary ➡️ Complete Order.

## 2. Deterministic Testing Rule
- Never use real network or live system clocks in unit tests.
- Pass explicit reference timestamps (`referenceDate`) to date/slot functions.
