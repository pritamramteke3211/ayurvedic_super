/**
 * @file src/core/domain/consultation/ConsultationErrors.ts
 * @description Strongly-typed domain errors for the consultation domain.
 *
 * Invariants:
 * - All consultation domain errors inherit from ConsultationDomainError.
 * - Errors carry typed domain properties where applicable (e.g. fromStatus, toStatus, entity IDs)
 *   to allow callers to handle domain failure cases without fragile string parsing.
 */

import { BookingStatus } from "./BookingStatus";

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

export class InvalidBookingStateTransitionError extends ConsultationDomainError {
  readonly fromStatus: BookingStatus;
  readonly toStatus: BookingStatus;

  constructor(
    fromStatus: BookingStatus,
    toStatus: BookingStatus,
    customReason?: string
  ) {
    const message = customReason || `Cannot transition booking from ${fromStatus} to ${toStatus}`;
    super(message);
    this.name = 'InvalidBookingStateTransitionError';
    this.fromStatus = fromStatus;
    this.toStatus = toStatus;
  }
}

export class InvalidBookingDataError extends ConsultationDomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidBookingDataError';
  }
}

export class InvalidStringError extends ConsultationDomainError {
  readonly entityName: string;
  readonly entityId: string;
  readonly fieldName: string;

  constructor(entityName: string, entityId: string, fieldName: string) {
    super(`${entityName} with ID ${entityId} has an invalid ${fieldName}.`);
    this.name = 'InvalidStringError';
    this.entityName = entityName;
    this.entityId = entityId;
    this.fieldName = fieldName;
  }
}

export class ConsultationAlreadyPastError extends ConsultationDomainError {
  constructor(message = 'Cannot cancel a consultation that has already concluded.') {
    super(message);
    this.name = 'ConsultationAlreadyPastError';
  }
}

  