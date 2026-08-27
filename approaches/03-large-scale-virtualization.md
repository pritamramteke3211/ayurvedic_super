# Approach 03: Large-Scale Virtualization (5,000 Doctors / 20,000 Products / 10,000 Records)

## 1. Virtualization Engine: `@shopify/flash-list`
- Standard `FlatList` creates excessive JS thread overhead and memory pressure on 20k rows.
- `FlashList` recycles native platform views, maintaining steady 60 FPS scrolling and negligible memory footprint.

## 2. Key Optimization Rules for High-Volume Lists:
1. **`estimatedItemSize`:** Provide accurate height estimates (e.g. `120` for DoctorCard, `240` for ProductCard).
2. **`getItemType`:** Used in Health Records for heterogeneous row recycling (Lab report vs Prescription vs Vaccination).
3. **`React.memo` with Primitive Props:** Card components must only receive primitive props (IDs, strings, numbers) or frozen objects to avoid unnecessary re-renders.
4. **Stable Callbacks:** Event handlers (`onPress`, `onAddToCart`) must use `useCallback` or direct store actions.
5. **Windowed Pagination:** Even against 20,000 mock items, slice data in batches of 20–30 items on scroll threshold (`onEndReached`).
6. **Debounced Search Inputs:** Search inputs debounced (250ms) to prevent re-filtering 20,000 records on every keystroke.
