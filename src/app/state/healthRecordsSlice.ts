/**
 * @file src/app/state/healthRecordsSlice.ts
 * @description Redux Toolkit slice for Health Records module.
 * Coordinates 10,000 records timeline, filtering, EHR detail view, and record creation/deletion.
 *
 * Invariants:
 * - Employs pure domain use cases for side-effect execution.
 * - Handles 4 UI states (Loading, Empty, Error, Data).
 * - Synchronizes added and deleted records with MMKV and offline sync queue.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HealthRecord, HealthRecordProps } from '../../core/domain/healthRecords/HealthRecord';
import { RecordType } from '../../core/domain/healthRecords/RecordType';
import { TimelineGroup } from '../../core/domain/healthRecords/TimelineGrouper';
import { mockHealthRecordRepository } from '../../infrastructure/repositories/MockHealthRecordRepository';
import { GetHealthTimelineUseCase } from '../../core/application/healthRecords/GetHealthTimelineUseCase';
import { GetRecordDetailsUseCase } from '../../core/application/healthRecords/GetRecordDetailsUseCase';
import { AddHealthRecordUseCase, AddHealthRecordDTO } from '../../core/application/healthRecords/AddHealthRecordUseCase';
import { DeleteHealthRecordUseCase } from '../../core/application/healthRecords/DeleteHealthRecordUseCase';
import { GetRecordTagsUseCase } from '../../core/application/healthRecords/GetRecordTagsUseCase';
import { logger } from '../../infrastructure/logging/logger';

// Instantiate use cases
const getHealthTimelineUseCase = new GetHealthTimelineUseCase(mockHealthRecordRepository);
const getRecordDetailsUseCase = new GetRecordDetailsUseCase(mockHealthRecordRepository);
const addHealthRecordUseCase = new AddHealthRecordUseCase(mockHealthRecordRepository);
const deleteHealthRecordUseCase = new DeleteHealthRecordUseCase(mockHealthRecordRepository);
const getRecordTagsUseCase = new GetRecordTagsUseCase(mockHealthRecordRepository);

export interface PrakritiStats {
  vata: number;
  pitta: number;
  kapha: number;
  dominantDosha: string;
}

export interface VitalSigns {
  pulse: string;
  bp: string;
  bmi: string;
  ojasScore: number;
}

export interface HealthRecordsState {
  // Timeline records list
  records: HealthRecordProps[];
  timelineGroups: TimelineGroup[];
  page: number;
  hasMore: boolean;
  total: number;
  isLoadingRecords: boolean;
  isLoadingMore: boolean;
  isLoadingTimeline: boolean;
  recordError: string | null;

  // Filter criteria
  searchQuery: string;
  selectedType: RecordType | 'ALL';
  selectedTag: string;
  startDate?: string;
  endDate?: string;

  // Record Details
  selectedRecord: HealthRecordProps | null;
  isLoadingRecordDetails: boolean;
  recordDetailsError: string | null;

  // Creation & Deletion
  isAddingRecord: boolean;
  addRecordError: string | null;
  isDeletingRecord: boolean;
  deleteRecordError: string | null;

  // Tags & Analytics
  tags: string[];
  isLoadingTags: boolean;
  prakritiStats: PrakritiStats;
  vitalSigns: VitalSigns;
}

const initialState: HealthRecordsState = {
  records: [],
  timelineGroups: [],
  page: 1,
  hasMore: true,
  total: 0,
  isLoadingRecords: false,
  isLoadingMore: false,
  isLoadingTimeline: false,
  recordError: null,

  searchQuery: '',
  selectedType: 'ALL',
  selectedTag: 'All Tags',
  startDate: undefined,
  endDate: undefined,

  selectedRecord: null,
  isLoadingRecordDetails: false,
  recordDetailsError: null,

  isAddingRecord: false,
  addRecordError: null,
  isDeletingRecord: false,
  deleteRecordError: null,

  tags: [],
  isLoadingTags: false,
  prakritiStats: {
    vata: 42,
    pitta: 36,
    kapha: 22,
    dominantDosha: 'Vata-Pitta',
  },
  vitalSigns: {
    pulse: '72 bpm (Sarpa Gati)',
    bp: '118/78 mmHg',
    bmi: '22.4 (Normal Agni)',
    ojasScore: 88,
  },
};

// Async Thunks

export const fetchHealthRecordsThunk = createAsyncThunk(
  'healthRecords/fetchRecords',
  async (reset: boolean = false, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as { healthRecords: HealthRecordsState }).healthRecords;
      const targetPage = reset ? 1 : state.page;
      const typeFilter = state.selectedType === 'ALL' ? undefined : state.selectedType;
      const tagFilter = state.selectedTag === 'All Tags' || state.selectedTag === 'All' ? undefined : state.selectedTag;

      const result = await mockHealthRecordRepository.getRecords({
        page: targetPage,
        limit: 25,
        filters: {
          query: state.searchQuery.trim() || undefined,
          type: typeFilter,
          tag: tagFilter,
          startDate: state.startDate,
          endDate: state.endDate,
        },
      });

      return {
        items: result.items.map((r) => r.toJSON()),
        page: result.page,
        hasMore: result.hasMore,
        total: result.total,
        reset,
      };
    } catch (err: any) {
      logger.error('HealthRecordsSlice', 'Failed to fetch health records', err);
      return rejectWithValue(err.message || 'Failed to load health records');
    }
  },
);

export const fetchTimelineGroupsThunk = createAsyncThunk(
  'healthRecords/fetchTimelineGroups',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as { healthRecords: HealthRecordsState }).healthRecords;
      const typeFilter = state.selectedType === 'ALL' ? undefined : state.selectedType;
      const tagFilter = state.selectedTag === 'All Tags' || state.selectedTag === 'All' ? undefined : state.selectedTag;

      const groups = await getHealthTimelineUseCase.execute({
        query: state.searchQuery.trim() || undefined,
        type: typeFilter,
        tag: tagFilter,
        startDate: state.startDate,
        endDate: state.endDate,
      });

      return groups;
    } catch (err: any) {
      logger.error('HealthRecordsSlice', 'Failed to fetch timeline groups', err);
      return rejectWithValue(err.message || 'Failed to load timeline');
    }
  },
);

export const fetchRecordDetailsThunk = createAsyncThunk(
  'healthRecords/fetchRecordDetails',
  async (recordId: string, { rejectWithValue }) => {
    try {
      const record = await getRecordDetailsUseCase.execute(recordId);
      return record.toJSON();
    } catch (err: any) {
      logger.error('HealthRecordsSlice', 'Failed to fetch record details', err);
      return rejectWithValue(err.message || 'Failed to load record details');
    }
  },
);

export const addHealthRecordThunk = createAsyncThunk(
  'healthRecords/addRecord',
  async (dto: AddHealthRecordDTO, { rejectWithValue }) => {
    try {
      const created = await addHealthRecordUseCase.execute(dto);
      return created.toJSON();
    } catch (err: any) {
      logger.error('HealthRecordsSlice', 'Failed to add health record', err);
      return rejectWithValue(err.message || 'Failed to add health record');
    }
  },
);

export const deleteHealthRecordThunk = createAsyncThunk(
  'healthRecords/deleteRecord',
  async (recordId: string, { rejectWithValue }) => {
    try {
      await deleteHealthRecordUseCase.execute(recordId);
      return recordId;
    } catch (err: any) {
      logger.error('HealthRecordsSlice', 'Failed to delete health record', err);
      return rejectWithValue(err.message || 'Failed to delete record');
    }
  },
);

export const fetchRecordTagsThunk = createAsyncThunk(
  'healthRecords/fetchTags',
  async (_, { rejectWithValue }) => {
    try {
      const tags = await getRecordTagsUseCase.execute();
      return tags;
    } catch (err: any) {
      logger.error('HealthRecordsSlice', 'Failed to fetch record tags', err);
      return rejectWithValue(err.message || 'Failed to load tags');
    }
  },
);

export const healthRecordsSlice = createSlice({
  name: 'healthRecords',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedType(state, action: PayloadAction<RecordType | 'ALL'>) {
      state.selectedType = action.payload;
    },
    setSelectedTag(state, action: PayloadAction<string>) {
      state.selectedTag = action.payload;
    },
    setDateRange(state, action: PayloadAction<{ startDate?: string; endDate?: string }>) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
    clearFilters(state) {
      state.searchQuery = '';
      state.selectedType = 'ALL';
      state.selectedTag = 'All Tags';
      state.startDate = undefined;
      state.endDate = undefined;
    },
    setSelectedRecord(state, action: PayloadAction<HealthRecordProps | null>) {
      state.selectedRecord = action.payload;
    },
    clearErrors(state) {
      state.recordError = null;
      state.recordDetailsError = null;
      state.addRecordError = null;
      state.deleteRecordError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Records
    builder
      .addCase(fetchHealthRecordsThunk.pending, (state, action) => {
        if (action.meta.arg) {
          state.isLoadingRecords = true;
        } else {
          state.isLoadingMore = true;
        }
        state.recordError = null;
      })
      .addCase(fetchHealthRecordsThunk.fulfilled, (state, action) => {
        const { items, page, hasMore, total, reset } = action.payload;
        state.isLoadingRecords = false;
        state.isLoadingMore = false;
        state.records = reset ? items : [...state.records, ...items];
        state.page = page + 1;
        state.hasMore = hasMore;
        state.total = total;
        state.recordError = null;
      })
      .addCase(fetchHealthRecordsThunk.rejected, (state, action) => {
        state.isLoadingRecords = false;
        state.isLoadingMore = false;
        state.recordError = (action.payload as string) || 'Failed to load records';
      });

    // Fetch Timeline Groups
    builder
      .addCase(fetchTimelineGroupsThunk.pending, (state) => {
        state.isLoadingTimeline = true;
      })
      .addCase(fetchTimelineGroupsThunk.fulfilled, (state, action) => {
        state.isLoadingTimeline = false;
        state.timelineGroups = action.payload;
      })
      .addCase(fetchTimelineGroupsThunk.rejected, (state) => {
        state.isLoadingTimeline = false;
      });

    // Fetch Record Details
    builder
      .addCase(fetchRecordDetailsThunk.pending, (state) => {
        state.isLoadingRecordDetails = true;
        state.recordDetailsError = null;
      })
      .addCase(fetchRecordDetailsThunk.fulfilled, (state, action) => {
        state.isLoadingRecordDetails = false;
        state.selectedRecord = action.payload;
        state.recordDetailsError = null;
      })
      .addCase(fetchRecordDetailsThunk.rejected, (state, action) => {
        state.isLoadingRecordDetails = false;
        state.recordDetailsError = (action.payload as string) || 'Record not found';
      });

    // Add Record
    builder
      .addCase(addHealthRecordThunk.pending, (state) => {
        state.isAddingRecord = true;
        state.addRecordError = null;
      })
      .addCase(addHealthRecordThunk.fulfilled, (state, action) => {
        state.isAddingRecord = false;
        state.records = [action.payload, ...state.records];
        state.total += 1;
        state.addRecordError = null;
      })
      .addCase(addHealthRecordThunk.rejected, (state, action) => {
        state.isAddingRecord = false;
        state.addRecordError = (action.payload as string) || 'Failed to add record';
      });

    // Delete Record
    builder
      .addCase(deleteHealthRecordThunk.pending, (state) => {
        state.isDeletingRecord = true;
        state.deleteRecordError = null;
      })
      .addCase(deleteHealthRecordThunk.fulfilled, (state, action) => {
        state.isDeletingRecord = false;
        state.records = state.records.filter((r) => r.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        if (state.selectedRecord && state.selectedRecord.id === action.payload) {
          state.selectedRecord = null;
        }
      })
      .addCase(deleteHealthRecordThunk.rejected, (state, action) => {
        state.isDeletingRecord = false;
        state.deleteRecordError = (action.payload as string) || 'Failed to delete record';
      });

    // Fetch Tags
    builder
      .addCase(fetchRecordTagsThunk.pending, (state) => {
        state.isLoadingTags = true;
      })
      .addCase(fetchRecordTagsThunk.fulfilled, (state, action) => {
        state.isLoadingTags = false;
        state.tags = action.payload;
      })
      .addCase(fetchRecordTagsThunk.rejected, (state) => {
        state.isLoadingTags = false;
      });
  },
});

export const healthRecordsReducer = healthRecordsSlice.reducer;
export const healthRecordsSliceActions = healthRecordsSlice.actions;
