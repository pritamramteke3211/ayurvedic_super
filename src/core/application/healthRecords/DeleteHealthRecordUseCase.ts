import { HealthRecordRepository } from '../../domain/healthRecords/HealthRecordRepository';

export class DeleteHealthRecordUseCase {
  constructor(private readonly repository: HealthRecordRepository) {}

  async execute(recordId: string): Promise<void> {
    await this.repository.deleteRecord(recordId);
  }
}
