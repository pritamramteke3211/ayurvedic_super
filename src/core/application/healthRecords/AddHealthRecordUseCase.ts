import { HealthRecordRepository } from '../../domain/healthRecords/HealthRecordRepository';
import { HealthRecord, HealthRecordProps } from '../../domain/healthRecords/HealthRecord';

export type AddHealthRecordDTO = Omit<HealthRecordProps, 'createdAt'>;

export class AddHealthRecordUseCase {
  constructor(private readonly repository: HealthRecordRepository) {}

  async execute(dto: AddHealthRecordDTO): Promise<HealthRecord> {
    const record = new HealthRecord({
      ...dto,
      createdAt: new Date().toISOString(),
    });

    await this.repository.saveRecord(record);
    return record;
  }
}
