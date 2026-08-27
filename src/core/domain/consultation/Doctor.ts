export interface DoctorProps {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  avatarUrl: string;
  bio: string;
  languages: string[];
  isAvailableToday: boolean;
}

export class Doctor {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _specialty: string;
  private readonly _experienceYears: number;
  private readonly _rating: number;
  private readonly _reviewCount: number;
  private readonly _consultationFee: number;
  private readonly _avatarUrl: string;
  private readonly _bio: string;
  private readonly _languages: string[];
  private readonly _isAvailableToday: boolean;

  constructor(props: DoctorProps) {
    this._id = props.id;
    this._name = props.name;
    this._specialty = props.specialty;
    this._experienceYears = props.experienceYears;
    this._rating = props.rating;
    this._reviewCount = props.reviewCount;
    this._consultationFee = props.consultationFee;
    this._avatarUrl = props.avatarUrl;
    this._bio = props.bio;
    this._languages = props.languages;
    this._isAvailableToday = props.isAvailableToday;
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get specialty(): string { return this._specialty; }
  get experienceYears(): number { return this._experienceYears; }
  get rating(): number { return this._rating; }
  get reviewCount(): number { return this._reviewCount; }
  get consultationFee(): number { return this._consultationFee; }
  get avatarUrl(): string { return this._avatarUrl; }
  get bio(): string { return this._bio; }
  get languages(): string[] { return [...this._languages]; }
  get isAvailableToday(): boolean { return this._isAvailableToday; }

  toJSON(): Readonly<DoctorProps> {
    return Object.freeze({
      id: this._id,
      name: this._name,
      specialty: this._specialty,
      experienceYears: this._experienceYears,
      rating: this._rating,
      reviewCount: this._reviewCount,
      consultationFee: this._consultationFee,
      avatarUrl: this._avatarUrl,
      bio: this._bio,
      languages: this._languages,
      isAvailableToday: this._isAvailableToday,
    });
  }
}
