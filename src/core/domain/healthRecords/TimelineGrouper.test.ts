/**
 * @file src/core/domain/healthRecords/TimelineGrouper.test.ts
 * @description Unit tests for pure TimelineGrouper domain logic.
 *
 * Invariants:
 * - Records are grouped chronologically by month and year.
 * - Groups and internal records are sorted descending by date (most recent first).
 * - Empty record sets return an empty group array without crashing.
 * - Same month/year records are collated under the same group period key (e.g., "2026-08").
 */

import { TimelineGrouper } from './TimelineGrouper';
import { HealthRecord } from './HealthRecord';
import { RecordType } from './RecordType';

describe('TimelineGrouper Domain Service', () => {
  const createMockRecord = (id: string, dateIso: string, title = 'Sample Record'): HealthRecord => {
    return new HealthRecord({
      id,
      title,
      type: RecordType.PRESCRIPTION,
      date: dateIso,
      tags: ['Ayurveda'],
      attachments: [],
      createdAt: dateIso,
    });
  };

  it('should return an empty array when given an empty list of records', () => {
    const groups = TimelineGrouper.group([]);
    expect(groups).toEqual([]);
  });

  it('should group records occurring in the same month together', () => {
    const rec1 = createMockRecord('r1', '2026-08-15T10:00:00.000Z', 'August Record 1');
    const rec2 = createMockRecord('r2', '2026-08-02T14:30:00.000Z', 'August Record 2');

    const groups = TimelineGrouper.group([rec2, rec1]);

    expect(groups).toHaveLength(1);
    expect(groups[0].periodKey).toBe('2026-08');
    expect(groups[0].title).toBe('August 2026');
    expect(groups[0].records).toHaveLength(2);
    // Sorted descending: rec1 (Aug 15) before rec2 (Aug 2)
    expect(groups[0].records[0].id).toBe('r1');
    expect(groups[0].records[1].id).toBe('r2');
  });

  it('should separate records into distinct monthly groups ordered descending by period', () => {
    const rAug = createMockRecord('rAug', '2026-08-10T10:00:00.000Z', 'August 2026');
    const rJul = createMockRecord('rJul', '2026-07-20T10:00:00.000Z', 'July 2026');
    const rJan = createMockRecord('rJan', '2025-01-05T10:00:00.000Z', 'January 2025');

    const groups = TimelineGrouper.group([rJul, rJan, rAug]);

    expect(groups).toHaveLength(3);
    expect(groups[0].periodKey).toBe('2026-08');
    expect(groups[0].title).toBe('August 2026');
    expect(groups[1].periodKey).toBe('2026-07');
    expect(groups[1].title).toBe('July 2026');
    expect(groups[2].periodKey).toBe('2025-01');
    expect(groups[2].title).toBe('January 2025');
  });
});
