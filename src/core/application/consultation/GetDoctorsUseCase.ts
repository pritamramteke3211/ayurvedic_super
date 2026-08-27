import { ConsultationRepository, DoctorFilterCriteria } from '../../domain/consultation/ConsultationRepository';
import { Doctor } from '../../domain/consultation/Doctor';
import { PaginatedResult, PaginationParams } from '../../types/common';

export class GetDoctorsUseCase {
  constructor(private readonly repository: ConsultationRepository) {}

  async execute(params: PaginationParams & { filters?: DoctorFilterCriteria }): Promise<PaginatedResult<Doctor>> {
    return this.repository.getDoctors(params);
  }
}
