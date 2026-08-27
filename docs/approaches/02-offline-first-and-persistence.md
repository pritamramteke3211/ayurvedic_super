# Approach 02: Offline-First & Local Persistence

## 1. Storage Choice: MMKV
- **Mechanism:** Memory-mapped files (`mmap`, C++) operating synchronously.
- **Performance:** 30x–50x faster than AsyncStorage / SQLite for key-value reads/writes.
- **Built-in Security:** Native AES-128 encryption instance for user sessions & cart.

## 2. Stale-While-Revalidate Strategy (Reads)
When a screen requests data (e.g. Doctor list or Shop feed):
1. **Immediate Cache Read:** Check MMKV storage; if present, emit cached data to UI instantly (<10ms).
2. **Background Revalidation:** If online, dispatch network fetch to refresh data.
3. **Cache Update:** Write latest server response to MMKV for subsequent launches.

## 3. Offline Write Mutations (`SyncQueue`)
When user performs an action offline (e.g. booking an appointment or modifying cart):
1. **Optimistic Local Update:** Entity is updated in local Zustand store with `PENDING_SYNC` status.
2. **Enqueue Action:** Action is serialized into the persisted `SyncQueue`.
3. **Auto-Flush on Reconnect:** `useNetworkStatus` detects connectivity and flushes the queue sequentially.
4. **Conflict Resolution:** For bookings, re-validate slot availability before final confirmation; alert user if slot was claimed during offline period.
