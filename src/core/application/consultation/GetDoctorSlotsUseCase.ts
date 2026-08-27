import { ConsultationRepository } from '../../domain/consultation/ConsultationRepository';
import { Slot } from '../../domain/consultation/Slot';

export class GetDoctorSlotsUseCase {
  constructor(private readonly repository: ConsultationRepository) {}

  async execute(doctorId: string, date: string): Promise<Slot[]> {
    return this.repository.getDoctorSlots(doctorId, date);
  }
}
