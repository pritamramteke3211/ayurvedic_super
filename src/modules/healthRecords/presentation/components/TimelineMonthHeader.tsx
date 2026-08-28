/**
 * @file src/modules/healthRecords/presentation/components/TimelineMonthHeader.tsx
 * @description Sticky/Section monthly timeline header displaying period and record count badge.
 *
 * Invariants:
 * - Employs pure functional rendering for minimal memory footprint in virtualized lists.
 * - Highlights chronological groups (e.g. "August 2026") with record count badge.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { CalendarSlotIcon } from '../../../../shared/components/icons/AyurvedicIcons';

export interface TimelineMonthHeaderProps {
  title: string;
  count?: number;
}

export const TimelineMonthHeader: React.FC<TimelineMonthHeaderProps> = React.memo(({ title, count }) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: spacing.md, paddingBottom: spacing.xs }]}>
      <View style={styles.contentRow}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: colors.primary + '18', borderRadius: borderRadius.sm, marginRight: spacing.xs },
          ]}
        >
          <CalendarSlotIcon size={14} color={colors.primary} />
        </View>
        <Text style={[typography.h3, { color: colors.text, fontWeight: '700' }]}>{title}</Text>
        {count !== undefined && count > 0 && (
          <View
            style={[
              styles.countPill,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.round },
            ]}
          >
            <Text style={[typography.caption, { color: colors.textSecondary, fontWeight: '600' }]}>
              {count} {count === 1 ? 'record' : 'records'}
            </Text>
          </View>
        )}
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWrapper: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countPill: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.6,
  },
});
