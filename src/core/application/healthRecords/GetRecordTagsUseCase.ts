import { HealthRecordRepository } from '../../domain/healthRecords/HealthRecordRepository';

export class GetRecordTagsUseCase {
  constructor(private readonly repository: HealthRecordRepository) {}

  async execute(): Promise<string[]> {
    return this.repository.getAllTags();
  }
}
