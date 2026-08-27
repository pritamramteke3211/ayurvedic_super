import { ConsultationRepository } from '../../domain/consultation/ConsultationRepository';
import { Booking, BookingStatus } from '../../domain/consultation/Booking';
import { SlotConflictValidator } from '../../domain/consultation/SlotConflictValidator';
import { DoctorNotFoundError } from '../../domain/consultation/ConsultationErrors';

export interface BookSlotDTO {
  bookingId: string;
  doctorId: string;
  slotId: string;
  patientName: string;
}

export class BookSlotUseCase {
  constructor(private readonly repository: ConsultationRepository) {}

  async execute(dto: BookSlotDTO): Promise<Booking> {
    const doctor = await this.repository.getDoctorById(dto.doctorId);
    if (!doctor) {
      throw new DoctorNotFoundError(dto.doctorId);
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const slots = await this.repository.getDoctorSlots(dto.doctorId, todayDate);
    const slot = slots.find(s => s.id === dto.slotId);

    if (!slot) {
      throw new Error(`Slot ${dto.slotId} not found.`);
    }

    const existingUserBookings = await this.repository.getUserBookings();

    // 1. Pure domain validation for slot conflict, expiration, double booking
    SlotConflictValidator.validate({
      slot,
      existingBookings: existingUserBookings,
    });

    // 2. Create Booking entity
    const booking = new Booking({
      id: dto.bookingId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      slotId: slot.id,
      startTime: slot.startTime,
      endTime: slot.endTime,
      patientName: dto.patientName,
      status: BookingStatus.CONFIRMED,
      createdAt: new Date().toISOString(),
    });

    // 3. Save via repository
    await this.repository.saveBooking(booking);

    return booking;
  }
}
