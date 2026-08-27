export enum RecordType {
  LAB_REPORT = 'LAB_REPORT',
  PRESCRIPTION = 'PRESCRIPTION',
  CONSULTATION = 'CONSULTATION',
  VACCINATION = 'VACCINATION',
  ALLERGY = 'ALLERGY',
}

export interface Attachment {
  id: string;
  name: string;
  mimeType: 'image/jpeg' | 'image/png' | 'application/pdf';
  url: string;
  thumbnailUrl?: string;
  sizeBytes: number;
}
