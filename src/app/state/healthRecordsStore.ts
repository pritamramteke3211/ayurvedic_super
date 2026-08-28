/**
 * @file src/app/state/healthRecordsStore.ts
 * @description Redux-backed facade providing typed hooks and unified action dispatchers for the Health Records module.
 *
 * Invariants:
 * - Backed 100% by Redux Toolkit store.
 * - Components can consume health records state with useHealthRecordsStore() or useAppSelector((state) => state.healthRecords).
 * - healthRecordsActions provides direct action dispatchers for timeline, filters, details, and record creation.
 */

import { store } from './store';
import { useAppSelector } from './hooks';
import {
  healthRecordsSliceActions,
  fetchHealthRecordsThunk,
  fetchTimelineGroupsThunk,
  fetchRecordDetailsThunk,
  addHealthRecordThunk,
  deleteHealthRecordThunk,
  fetchRecordTagsThunk,
  type HealthRecordsState,
} from './healthRecordsSlice';
import { RecordType } from '../../core/domain/healthRecords/RecordType';
import { AddHealthRecordDTO } from '../../core/application/healthRecords/AddHealthRecordUseCase';

export type { HealthRecordsState };

/**
 * Hook to consume Health Records state from Redux.
 */
export function useHealthRecordsStore(): HealthRecordsState {
  return useAppSelector((state) => state.healthRecords);
}

/**
 * Direct action dispatchers backed by Redux Toolkit.
 */
export const healthRecordsActions = {
  fetchRecords: async (reset: boolean = false) => {
    return store.dispatch(fetchHealthRecordsThunk(reset)).unwrap();
  },

  fetchMoreRecords: async () => {
    const state = store.getState().healthRecords;
    if (state.hasMore && !state.isLoadingMore && !state.isLoadingRecords) {
      return store.dispatch(fetchHealthRecordsThunk(false)).unwrap();
    }
  },

  fetchTimelineGroups: async () => {
    return store.dispatch(fetchTimelineGroupsThunk()).unwrap();
  },

  fetchRecordDetails: async (recordId: string) => {
    return store.dispatch(fetchRecordDetailsThunk(recordId)).unwrap();
  },

  addRecord: async (dto: AddHealthRecordDTO) => {
    return store.dispatch(addHealthRecordThunk(dto)).unwrap();
  },

  deleteRecord: async (recordId: string) => {
    return store.dispatch(deleteHealthRecordThunk(recordId)).unwrap();
  },

  fetchTags: async () => {
    return store.dispatch(fetchRecordTagsThunk()).unwrap();
  },

  setSearchQuery: (query: string) => {
    store.dispatch(healthRecordsSliceActions.setSearchQuery(query));
    store.dispatch(fetchHealthRecordsThunk(true));
  },

  setSelectedType: (type: RecordType | 'ALL') => {
    store.dispatch(healthRecordsSliceActions.setSelectedType(type));
    store.dispatch(fetchHealthRecordsThunk(true));
  },

  setSelectedTag: (tag: string) => {
    store.dispatch(healthRecordsSliceActions.setSelectedTag(tag));
    store.dispatch(fetchHealthRecordsThunk(true));
  },

  clearFilters: () => {
    store.dispatch(healthRecordsSliceActions.clearFilters());
    store.dispatch(fetchHealthRecordsThunk(true));
  },
};
