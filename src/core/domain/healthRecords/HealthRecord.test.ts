/**
 * @file src/core/domain/healthRecords/HealthRecord.test.ts
 * @description Unit tests for HealthRecord pure domain entity.
 *
 * Invariants:
 * - Rejects empty or whitespace-only titles with InvalidRecordTitleError.
 * - Encapsulates props with immutable getters.
 * - toJSON() returns an immutable readonly snapshot of internal state.
 */

import { HealthRecord } from './HealthRecord';
import { RecordType } from './RecordType';
import { InvalidRecordTitleError } from './HealthRecordErrors';

describe('HealthRecord Domain Entity', () => {
  const validProps = {
    id: 'REC-000001',
    title: 'Ashwagandharishta Protocol',
    type: RecordType.PRESCRIPTION,
    date: '2026-08-28T10:00:00.000Z',
    doctorName: 'Dr. Rajeshwar Shastri',
    facility: 'Amrutam Hospital',
    notes: 'Prescribed for stress relief',
    tags: ['Vata Balancing', 'Stress & Sleep'],
    attachments: [
      {
        id: 'att-1',
        name: 'prescription.pdf',
        mimeType: 'application/pdf' as const,
        url: 'https://example.com/prescription.pdf',
        sizeBytes: 250000,
      },
    ],
    createdAt: '2026-08-28T10:00:00.000Z',
  };

  it('should instantiate successfully with valid props', () => {
    const record = new HealthRecord(validProps);

    expect(record.id).toBe(validProps.id);
    expect(record.title).toBe(validProps.title);
    expect(record.type).toBe(RecordType.PRESCRIPTION);
    expect(record.doctorName).toBe(validProps.doctorName);
    expect(record.facility).toBe(validProps.facility);
    expect(record.tags).toEqual(validProps.tags);
    expect(record.attachments).toHaveLength(1);
  });

  it('should throw InvalidRecordTitleError if title is empty or only whitespace', () => {
    expect(() => {
      new HealthRecord({
        ...validProps,
        title: '',
      });
    }).toThrow(InvalidRecordTitleError);

    expect(() => {
      new HealthRecord({
        ...validProps,
        title: '   ',
      });
    }).toThrow(InvalidRecordTitleError);
  });

  it('should return a frozen serialized JSON snapshot via toJSON()', () => {
    const record = new HealthRecord(validProps);
    const json = record.toJSON();

    expect(json.id).toBe(validProps.id);
    expect(json.title).toBe(validProps.title);
    expect(Object.isFrozen(json)).toBe(true);
  });
});
