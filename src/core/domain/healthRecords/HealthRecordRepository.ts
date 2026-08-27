import { HealthRecord } from './HealthRecord';
import { RecordType } from './RecordType';
import { PaginatedResult, PaginationParams } from '../../types/common';

export interface HealthRecordFilterCriteria {
  query?: string;
  type?: RecordType;
  tag?: string;
  startDate?: string;
  endDate?: string;
}

export interface HealthRecordRepository {
  getRecords(params: PaginationParams & { filters?: HealthRecordFilterCriteria }): Promise<PaginatedResult<HealthRecord>>;
  getRecordById(id: string): Promise<HealthRecord | null>;
  saveRecord(record: HealthRecord): Promise<void>;
  deleteRecord(id: string): Promise<void>;
  getAllTags(): Promise<string[]>;
}
