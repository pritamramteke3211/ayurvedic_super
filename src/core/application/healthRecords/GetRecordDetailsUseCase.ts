import { HealthRecordRepository } from '../../domain/healthRecords/HealthRecordRepository';
import { HealthRecord } from '../../domain/healthRecords/HealthRecord';
import { RecordNotFoundError } from '../../domain/healthRecords/HealthRecordErrors';

export class GetRecordDetailsUseCase {
  constructor(private readonly repository: HealthRecordRepository) {}

  async execute(recordId: string): Promise<HealthRecord> {
    const record = await this.repository.getRecordById(recordId);
    if (!record) {
      throw new RecordNotFoundError(recordId);
    }
    return record;
  }
}
