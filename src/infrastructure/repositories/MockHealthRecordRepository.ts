/**
 * @file src/infrastructure/repositories/MockHealthRecordRepository.ts
 * @description In-memory and MMKV-persisted mock implementation of HealthRecordRepository.
 * Manages 10,000 virtualized Ayurvedic health records, search, filter criteria, and offline persistence.
 *
 * Invariants:
 * - Lazily initializes the 10,000 health record dataset on first access for optimal memory footprint.
 * - Merges user-created records from MMKV storage and excludes user-deleted record IDs.
 * - Employs ChaosFaultSimulator to simulate realistic network latency and chaos fault injection.
 * - Automatically enqueues offline additions and deletions into SyncQueue when offline.
 */

import {
  HealthRecordRepository,
  HealthRecordFilterCriteria,
} from '../../core/domain/healthRecords/HealthRecordRepository';
import { HealthRecord, HealthRecordProps } from '../../core/domain/healthRecords/HealthRecord';
import { RecordType } from '../../core/domain/healthRecords/RecordType';
import { PaginatedResult, PaginationParams } from '../../core/types/common';
import {
  generate10kHealthRecordsProps,
  AVAILABLE_RECORD_TAGS,
} from '../mock/healthRecordsMockData';
import { storage } from '../storage/mmkv';
import { syncQueue } from '../storage/syncQueue';
import { networkManager } from '../network/networkManager';
import { chaosSimulator } from '../api/mockServer';
import { logger } from '../logging/logger';

const USER_CREATED_RECORDS_KEY = 'amrutam_health_records_user_created';
const USER_DELETED_RECORDS_KEY = 'amrutam_health_records_user_deleted';

export class MockHealthRecordRepository implements HealthRecordRepository {
  private recordsCache: HealthRecord[] | null = null;

  /**
   * Lazily loads the 10,000 record dataset, merging user-created records and removing deleted ones.
   */
  private getRecordsDataset(): HealthRecord[] {
    if (!this.recordsCache) {
      const startTime = Date.now();
      const rawProps = generate10kHealthRecordsProps();
      const baseRecords = rawProps.map((p) => new HealthRecord(p));

      // Read user-created additions and deletions from MMKV
      const userCreatedProps = storage.getObject<HealthRecordProps[]>(USER_CREATED_RECORDS_KEY) || [];
      const userDeletedIds = storage.getObject<string[]>(USER_DELETED_RECORDS_KEY) || [];
      const deletedSet = new Set(userDeletedIds);

      const userCreatedRecords = userCreatedProps.map((p) => new HealthRecord(p));

      // Combine user created records first, followed by base records excluding deleted
      const combined = [
        ...userCreatedRecords.filter((r) => !deletedSet.has(r.id)),
        ...baseRecords.filter((r) => !deletedSet.has(r.id)),
      ];

      this.recordsCache = combined;
      logger.info(
        'MockHealthRecordRepository',
        `Loaded ${combined.length} health records (10,000 base + ${userCreatedProps.length} user-created - ${userDeletedIds.length} deleted) in ${Date.now() - startTime}ms`,
      );
    }
    return this.recordsCache;
  }

  /**
   * Fetches paginated, multi-filtered health records.
   */
  async getRecords(
    params: PaginationParams & { filters?: HealthRecordFilterCriteria } = {
      page: 1,
      limit: 20,
    },
  ): Promise<PaginatedResult<HealthRecord>> {
    await chaosSimulator.simulateNetworkHop();

    const allRecords = this.getRecordsDataset();
    const { page = 1, limit = 20, filters } = params;

    let filtered = allRecords;

    if (filters) {
      const { query, type, tag, startDate, endDate } = filters;

      if (query && query.trim().length > 0) {
        const q = query.toLowerCase().trim();
        filtered = filtered.filter(
          (rec) =>
            rec.title.toLowerCase().includes(q) ||
            (rec.doctorName && rec.doctorName.toLowerCase().includes(q)) ||
            (rec.facility && rec.facility.toLowerCase().includes(q)) ||
            (rec.notes && rec.notes.toLowerCase().includes(q)) ||
            rec.tags.some((t) => t.toLowerCase().includes(q)),
        );
      }

      if (type) {
        filtered = filtered.filter((rec) => rec.type === type);
      }

      if (tag && tag !== 'All Tags' && tag !== 'All') {
        filtered = filtered.filter((rec) => rec.tags.includes(tag));
      }

      if (startDate) {
        const startTimestamp = new Date(startDate).getTime();
        filtered = filtered.filter((rec) => new Date(rec.date).getTime() >= startTimestamp);
      }

      if (endDate) {
        const endTimestamp = new Date(endDate).getTime();
        filtered = filtered.filter((rec) => new Date(rec.date).getTime() <= endTimestamp);
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  /**
   * Retrieves a single health record by ID.
   */
  async getRecordById(id: string): Promise<HealthRecord | null> {
    await chaosSimulator.simulateNetworkHop();
    const allRecords = this.getRecordsDataset();
    const found = allRecords.find((r) => r.id === id);
    return found || null;
  }

  /**
   * Persists a new health record into MMKV storage and updates local cache.
   * If offline, enqueues into SyncQueue.
   */
  async saveRecord(record: HealthRecord): Promise<void> {
    await chaosSimulator.simulateNetworkHop();

    const userCreated = storage.getObject<HealthRecordProps[]>(USER_CREATED_RECORDS_KEY) || [];
    const recordJson = record.toJSON();

    const existingIndex = userCreated.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      userCreated[existingIndex] = recordJson;
    } else {
      userCreated.unshift(recordJson);
    }

    storage.setObject(USER_CREATED_RECORDS_KEY, userCreated);

    // Update in-memory cache if active
    if (this.recordsCache) {
      const idx = this.recordsCache.findIndex((r) => r.id === record.id);
      if (idx >= 0) {
        this.recordsCache[idx] = record;
      } else {
        this.recordsCache.unshift(record);
      }
    }

    logger.info('MockHealthRecordRepository', `Saved health record ${record.id}: ${record.title}`);

    if (!networkManager.isOnline) {
      syncQueue.enqueue('CREATE_HEALTH_RECORD', recordJson);
      logger.info('MockHealthRecordRepository', `Enqueued offline record ${record.id} into SyncQueue`);
    }
  }

  /**
   * Deletes a health record by ID, marking it deleted in MMKV and removing from cache.
   */
  async deleteRecord(id: string): Promise<void> {
    await chaosSimulator.simulateNetworkHop();

    const userDeleted = storage.getObject<string[]>(USER_DELETED_RECORDS_KEY) || [];
    if (!userDeleted.includes(id)) {
      userDeleted.push(id);
      storage.setObject(USER_DELETED_RECORDS_KEY, userDeleted);
    }

    // Also remove from user-created if present
    const userCreated = storage.getObject<HealthRecordProps[]>(USER_CREATED_RECORDS_KEY) || [];
    const updatedCreated = userCreated.filter((r) => r.id !== id);
    storage.setObject(USER_CREATED_RECORDS_KEY, updatedCreated);

    // Remove from in-memory cache
    if (this.recordsCache) {
      this.recordsCache = this.recordsCache.filter((r) => r.id !== id);
    }

    logger.info('MockHealthRecordRepository', `Deleted health record ${id}`);

    if (!networkManager.isOnline) {
      syncQueue.enqueue('DELETE_HEALTH_RECORD', { recordId: id });
      logger.info('MockHealthRecordRepository', `Enqueued offline deletion of ${id} into SyncQueue`);
    }
  }

  /**
   * Returns all available tags.
   */
  async getAllTags(): Promise<string[]> {
    return [...AVAILABLE_RECORD_TAGS];
  }
}

export const mockHealthRecordRepository = new MockHealthRecordRepository();
