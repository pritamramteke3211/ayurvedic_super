export interface SlotProps {
  id: string;
  doctorId: string;
  startTime: string; // ISO 8601 string
  endTime: string;   // ISO 8601 string
  isBooked: boolean;
}

export class Slot {
  private readonly _id: string;
  private readonly _doctorId: string;
  private readonly _startTime: string;
  private readonly _endTime: string;
  private _isBooked: boolean;

  constructor(props: SlotProps) {
    this._id = props.id;
    this._doctorId = props.doctorId;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this._isBooked = props.isBooked;
  }

  get id(): string { return this._id; }
  get doctorId(): string { return this._doctorId; }
  get startTime(): string { return this._startTime; }
  get endTime(): string { return this._endTime; }
  get isBooked(): boolean { return this._isBooked; }

  isExpired(referenceDate: Date = new Date()): boolean {
    return new Date(this._startTime).getTime() < referenceDate.getTime();
  }

  markBooked(): void {
    this._isBooked = true;
  }

  markAvailable(): void {
    this._isBooked = false;
  }

  toJSON(): Readonly<SlotProps> {
    return Object.freeze({
      id: this._id,
      doctorId: this._doctorId,
      startTime: this._startTime,
      endTime: this._endTime,
      isBooked: this._isBooked,
    });
  }
}
