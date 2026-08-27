import { HealthRecordRepository, HealthRecordFilterCriteria } from '../../domain/healthRecords/HealthRecordRepository';
import { TimelineGrouper, TimelineGroup } from '../../domain/healthRecords/TimelineGrouper';

export class GetHealthTimelineUseCase {
  constructor(private readonly repository: HealthRecordRepository) {}

  async execute(filters?: HealthRecordFilterCriteria): Promise<TimelineGroup[]> {
    const result = await this.repository.getRecords({
      page: 1,
      limit: 1000,
      filters,
    });

    return TimelineGrouper.group(result.items);
  }
}
