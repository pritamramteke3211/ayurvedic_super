import { RecordType, Attachment } from './RecordType';
import { InvalidRecordTitleError } from './HealthRecordErrors';

export interface HealthRecordProps {
  id: string;
  title: string;
  type: RecordType;
  date: string; // ISO 8601 string
  doctorName?: string;
  facility?: string;
  notes?: string;
  tags: string[];
  attachments: Attachment[];
  createdAt: string;
}

export class HealthRecord {
  private readonly _id: string;
  private _title: string;
  private readonly _type: RecordType;
  private readonly _date: string;
  private readonly _doctorName?: string;
  private readonly _facility?: string;
  private _notes?: string;
  private _tags: string[];
  private _attachments: Attachment[];
  private readonly _createdAt: string;

  constructor(props: HealthRecordProps) {
    if (!props.title || props.title.trim().length === 0) {
      throw new InvalidRecordTitleError();
    }
    this._id = props.id;
    this._title = props.title.trim();
    this._type = props.type;
    this._date = props.date;
    this._doctorName = props.doctorName;
    this._facility = props.facility;
    this._notes = props.notes;
    this._tags = props.tags;
    this._attachments = props.attachments;
    this._createdAt = props.createdAt;
  }

  get id(): string { return this._id; }
  get title(): string { return this._title; }
  get type(): RecordType { return this._type; }
  get date(): string { return this._date; }
  get doctorName(): string | undefined { return this._doctorName; }
  get facility(): string | undefined { return this._facility; }
  get notes(): string | undefined { return this._notes; }
  get tags(): string[] { return [...this._tags]; }
  get attachments(): Attachment[] { return [...this._attachments]; }
  get createdAt(): string { return this._createdAt; }

  toJSON(): Readonly<HealthRecordProps> {
    return Object.freeze({
      id: this._id,
      title: this._title,
      type: this._type,
      date: this._date,
      doctorName: this._doctorName,
      facility: this._facility,
      notes: this._notes,
      tags: this._tags,
      attachments: this._attachments,
      createdAt: this._createdAt,
    });
  }
}
