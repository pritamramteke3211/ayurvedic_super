import { ConsultationRepository } from '../../domain/consultation/ConsultationRepository';
import { ConsultationDomainError } from '../../domain/consultation/ConsultationErrors';

export class CancelBookingUseCase {
  constructor(private readonly repository: ConsultationRepository) {}

  async execute(bookingId: string): Promise<void> {
    if (!bookingId || bookingId.trim().length === 0) {
      throw new ConsultationDomainError('Booking ID is required to cancel an appointment.');
    }

    await this.repository.cancelBooking(bookingId);
  }
}
