/**
 * @file src/modules/healthRecords/presentation/screens/HealthRecordsHomeScreen.tsx
 * @description Health Records Module entry screen placeholder showcasing patient timeline.
 *
 * Invariants:
 * - Employs design tokens from useAppTheme.
 * - Ready for 10,000 Patient medical record timeline and digital prescriptions.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { HealthRecordsIcon } from '../../../../shared/components/icons/AyurvedicIcons';

export const HealthRecordsHomeScreen: React.FC = () => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}>
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.primary + '1A',
            borderRadius: borderRadius.round,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        <HealthRecordsIcon size={36} color={colors.primary} />
      </View>
      <Text style={[typography.h1, { color: colors.text, textAlign: 'center' }]}>
        Health Records & Timeline
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, maxWidth: 280 },
        ]}
      >
        Encrypted EHR timeline, digital prescriptions, prakriti analysis & lab reports.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
