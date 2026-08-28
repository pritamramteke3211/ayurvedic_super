/**
 * @file src/modules/healthRecords/index.ts
 * @description Public barrel export for Health Records module (domain, application, presentation).
 */

export * from '../../core/domain/healthRecords/HealthRecord';
export * from '../../core/domain/healthRecords/RecordType';
export * from '../../core/domain/healthRecords/HealthRecordErrors';
export * from '../../core/domain/healthRecords/TimelineGrouper';
export * from '../../core/domain/healthRecords/HealthRecordRepository';

export * from '../../core/application/healthRecords/GetHealthTimelineUseCase';
export * from '../../core/application/healthRecords/GetRecordDetailsUseCase';
export * from '../../core/application/healthRecords/AddHealthRecordUseCase';
export * from '../../core/application/healthRecords/DeleteHealthRecordUseCase';
export * from '../../core/application/healthRecords/GetRecordTagsUseCase';

export * from '../../infrastructure/mock/healthRecordsMockData';
export * from '../../infrastructure/repositories/MockHealthRecordRepository';

export * from './presentation/components/RecordCard';
export * from './presentation/components/TimelineMonthHeader';
export * from './presentation/components/HealthMetricsSummary';
export * from './presentation/components/RecordFilterModal';
export * from './presentation/components/AttachmentItem';

export * from './presentation/screens/HealthTimelineScreen';
export * from './presentation/screens/RecordDetailScreen';
export * from './presentation/screens/AddRecordScreen';
