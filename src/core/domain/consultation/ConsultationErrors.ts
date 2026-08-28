export class ConsultationDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConsultationDomainError';
  }
}

export class SlotConflictError extends ConsultationDomainError {
  constructor(message = 'Selected time slot is already booked by another appointment.') {
    super(message);
    this.name = 'SlotConflictError';
  }
}

export class SlotExpiredError extends ConsultationDomainError {
  constructor(message = 'Cannot book a slot in the past.') {
    super(message);
    this.name = 'SlotExpiredError';
  }
}

export class DoubleBookingError extends ConsultationDomainError {
  constructor(message = 'You already have an active consultation scheduled at this time.') {
    super(message);
    this.name = 'DoubleBookingError';
  }
}

export class DoctorNotFoundError extends ConsultationDomainError {
  constructor(id: string) {
    super(`Doctor with ID ${id} was not found.`);
    this.name = 'DoctorNotFoundError';
  }
}

export class BookingNotFoundError extends ConsultationDomainError {
  constructor(id: string) {
    super(`Booking with ID ${id} was not found.`);
    this.name = 'BookingNotFoundError';
  }
}

