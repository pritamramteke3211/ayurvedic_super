import { BookingStatus } from './BookingStatus';
import { ConsultationDomainError } from './ConsultationErrors';

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

  get id(): string { return this._id; }
  get doctorId(): string { return this._doctorId; }
  get doctorName(): string { return this._doctorName; }
  get slotId(): string { return this._slotId; }
  get startTime(): string { return this._startTime; }
  get endTime(): string { return this._endTime; }
  get patientName(): string { return this._patientName; }
  get status(): BookingStatus { return this._status; }
  get createdAt(): string { return this._createdAt; }

  // -------------------------------------------------------------
  // Lifecycle State Transitions with Domain Invariant Guards
  // -------------------------------------------------------------

  cancel(): void {
    if (this._status === BookingStatus.COMPLETED) {
      throw new ConsultationDomainError('Cannot cancel a consultation that has already been completed.');
    }
    this._status = BookingStatus.CANCELLED;
  }

  confirm(): void {
    if (this._status === BookingStatus.CANCELLED) {
      throw new ConsultationDomainError('Cannot confirm a cancelled booking.');
    }
    this._status = BookingStatus.CONFIRMED;
  }

  markPendingSync(): void {
    if (this._status === BookingStatus.CANCELLED) {
      throw new ConsultationDomainError('Cannot queue a cancelled booking for sync.');
    }
    this._status = BookingStatus.PENDING_SYNC;
  }

  complete(): void {
    if (this._status === BookingStatus.CANCELLED) {
      throw new ConsultationDomainError('Cannot complete a cancelled consultation.');
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
