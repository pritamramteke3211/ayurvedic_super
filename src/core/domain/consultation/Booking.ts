/**
 * @file src/core/domain/consultation/Booking.ts
 * @description Pure Domain Entity representing a Doctor Consultation appointment booking.
 *
 * Invariants:
 * - Essential identifiers (id, doctorId, slotId, patientName) must be non-empty strings.
 * - startTime and endTime must be valid ISO date strings, with startTime strictly prior to endTime.
 * - State transitions are guarded; terminal states (CANCELLED, COMPLETED) reject further transitions.
 * - toJSON() provides an immutable snapshot via Object.freeze.
 */

import { BookingStatus } from './BookingStatus';
import {
  ConsultationAlreadyPastError,
  InvalidBookingDataError,
  InvalidBookingStateTransitionError,
  InvalidStringError,
} from './ConsultationErrors';

export { BookingStatus };

export interface BookingProps {
  id: string;
  doctorId: string;
  doctorName: string;
  slotId: string;
  startTime: string;
  endTime: string;
  patientName: string;
  status: BookingStatus;
  createdAt: string;
}

export class Booking {
  private readonly _id: string;
  private readonly _doctorId: string;
  private readonly _doctorName: string;
  private readonly _slotId: string;
  private readonly _startTime: string;
  private readonly _endTime: string;
  private readonly _patientName: string;
  private _status: BookingStatus;
  private readonly _createdAt: string;

  constructor(props: BookingProps) {
    this.validateInvariants(props);

    this._id = props.id;
    this._doctorId = props.doctorId;
    this._doctorName = props.doctorName;
    this._slotId = props.slotId;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._patientName = props.patientName;
    this._status = props.status;
    this._createdAt = props.createdAt;
  }

  private validateInvariants(props: BookingProps): void {
    if (!props) {
      throw new InvalidBookingDataError('Booking properties must be provided.');
    }

    const bookingId = props.id?.trim() || 'UNKNOWN';

    if (!props.id || props.id.trim().length === 0) {
      throw new InvalidStringError('Booking', bookingId, 'id');
    }
    if (!props.doctorId || props.doctorId.trim().length === 0) {
      throw new InvalidStringError('Booking', bookingId, 'doctorId');
    }
    if (!props.doctorName || props.doctorName.trim().length === 0) {
      throw new InvalidStringError('Booking', bookingId, 'doctorName');
    }
    if (!props.slotId || props.slotId.trim().length === 0) {
      throw new InvalidStringError('Booking', bookingId, 'slotId');
    }
    if (!props.patientName || props.patientName.trim().length === 0) {
      throw new InvalidStringError('Booking', bookingId, 'patientName');
    }
    if (!props.createdAt || props.createdAt.trim().length === 0) {
      throw new InvalidStringError('Booking', bookingId, 'createdAt');
    }

    const createdTimestamp = new Date(props.createdAt).getTime();
    if (Number.isNaN(createdTimestamp)) {
      throw new InvalidBookingDataError('Booking createdAt must be a valid date string.');
    }

    const startTimestamp = new Date(props.startTime).getTime();
    const endTimestamp = new Date(props.endTime).getTime();

    if (Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) {
      throw new InvalidBookingDataError('Booking startTime and endTime must be valid date strings.');
    }

    if (startTimestamp >= endTimestamp) {
      throw new InvalidBookingDataError('Booking startTime must be strictly earlier than endTime.');
    }
  }

  get id(): string { return this._id; }
  get doctorId(): string { return this._doctorId; }
  get doctorName(): string { return this._doctorName; }
  get slotId(): string { return this._slotId; }
  get startTime(): string { return this._startTime; }
  get endTime(): string { return this._endTime; }
  get patientName(): string { return this._patientName; }
  get status(): BookingStatus { return this._status; }
  get createdAt(): string { return this._createdAt; }

  /**
   * Evaluates if the consultation's scheduled slot has concluded relative to a reference timestamp.
   */
  isPast(referenceDate: Date = new Date()): boolean {
    return new Date(this._endTime).getTime() < referenceDate.getTime();
  }

  // -------------------------------------------------------------
  // Lifecycle State Transitions with Domain Invariant Guards
  // -------------------------------------------------------------

  cancel(now?: Date): void {
    if (now && this.isPast(now)) {
      throw new ConsultationAlreadyPastError('Cannot cancel a consultation that has already concluded.');
    }
    if (this._status === BookingStatus.COMPLETED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.CANCELLED,
        'Cannot cancel a consultation that has already been completed.'
      );
    }
    if (this._status === BookingStatus.CANCELLED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.CANCELLED,
        'Cannot cancel an already cancelled consultation.'
      );
    }
    this._status = BookingStatus.CANCELLED;
  }

  confirm(): void {
    if (this._status === BookingStatus.CANCELLED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.CONFIRMED,
        'Cannot confirm a cancelled booking.'
      );
    }
    if (this._status === BookingStatus.COMPLETED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.CONFIRMED,
        'Cannot confirm a completed booking.'
      );
    }
    if (this._status === BookingStatus.CONFIRMED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.CONFIRMED,
        'Consultation is already confirmed.'
      );
    }
    this._status = BookingStatus.CONFIRMED;
  }

  markPendingSync(): void {
    if (this._status === BookingStatus.CANCELLED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.PENDING_SYNC,
        'Cannot queue a cancelled booking for sync.'
      );
    }
    if (this._status === BookingStatus.CONFIRMED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.PENDING_SYNC,
        'Cannot queue a confirmed booking for sync.'
      );
    }
    if (this._status === BookingStatus.COMPLETED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.PENDING_SYNC,
        'Cannot queue a completed booking for sync.'
      );
    }
    if (this._status === BookingStatus.PENDING_SYNC) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.PENDING_SYNC,
        'Booking is already queued for sync.'
      );
    }
    this._status = BookingStatus.PENDING_SYNC;
  }

  complete(): void {
    if (this._status === BookingStatus.CANCELLED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.COMPLETED,
        'Cannot complete a cancelled consultation.'
      );
    }
    if (this._status === BookingStatus.COMPLETED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.COMPLETED,
        'Consultation has already been completed.'
      );
    }
    if (this._status !== BookingStatus.CONFIRMED) {
      throw new InvalidBookingStateTransitionError(
        this._status,
        BookingStatus.COMPLETED,
        'Only confirmed consultations can be completed.'
      );
    }
    this._status = BookingStatus.COMPLETED;
  }

  toJSON(): Readonly<BookingProps> {
    return Object.freeze({
      id: this._id,
      doctorId: this._doctorId,
      doctorName: this._doctorName,
      slotId: this._slotId,
      startTime: this._startTime,
      endTime: this._endTime,
      patientName: this._patientName,
      status: this._status,
      createdAt: this._createdAt,
    });
  }
}
