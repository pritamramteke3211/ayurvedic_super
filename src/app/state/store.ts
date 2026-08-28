/**
 * @file src/app/state/store.ts
 * @description Central Redux Toolkit store for Amrutam Ayurvedic Super App.
 *
 * Invariants:
 * - Configures root reducer combining all presentation slices (consultation, shop, health records).
 * - Exports strictly typed RootState and AppDispatch types.
 */

import { configureStore } from '@reduxjs/toolkit';
import { consultationReducer } from './consultationSlice';
import { shopReducer } from './shopSlice';
import { healthRecordsReducer } from './healthRecordsSlice';

export const store = configureStore({
  reducer: {
    consultation: consultationReducer,
    shop: shopReducer,
    healthRecords: healthRecordsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // For complex entities and domain models if needed
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
