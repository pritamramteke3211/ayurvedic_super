import { ConsultationRepository } from '../../domain/consultation/ConsultationRepository';
import { Booking } from '../../domain/consultation/Booking';

export class GetUserBookingsUseCase {
  constructor(private readonly repository: ConsultationRepository) {}

  async execute(): Promise<Booking[]> {
    return this.repository.getUserBookings();
  }
}
