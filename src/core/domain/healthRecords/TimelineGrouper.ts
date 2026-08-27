import { HealthRecord } from './HealthRecord';

export interface TimelineGroup {
  periodKey: string; // e.g. "2026-08"
  title: string;     // e.g. "August 2026"
  records: HealthRecord[];
}

export class TimelineGrouper {
  /**
   * Pure function grouping health records chronologically by Month/Year.
   */
  static group(records: HealthRecord[]): TimelineGroup[] {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Sort descending by date
    const sorted = [...records].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const groupMap = new Map<string, TimelineGroup>();

    for (const record of sorted) {
      const d = new Date(record.date);
      const year = d.getFullYear();
      const month = d.getMonth();
      const periodKey = `${year}-${String(month + 1).padStart(2, '0')}`;

      if (!groupMap.has(periodKey)) {
        groupMap.set(periodKey, {
          periodKey,
          title: `${monthNames[month]} ${year}`,
          records: [],
        });
      }

      groupMap.get(periodKey)!.records.push(record);
    }

    return Array.from(groupMap.values());
  }
}
