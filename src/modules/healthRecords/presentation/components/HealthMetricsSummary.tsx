/**
 * @file src/modules/healthRecords/presentation/components/HealthMetricsSummary.tsx
 * @description Rich Ayurvedic health summary widget displaying Prakriti dosha balance, vitals, and category quick-filter chips.
 *
 * Invariants:
 * - Visualizes Prakriti dosha distribution (Vata, Pitta, Kapha) with proportional colored progress meters.
 * - Displays active vitals summary (pulse rhythm, blood pressure, BMI, Ojas score).
 * - Provides interactive quick-filter pills switching between RecordTypes.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { RecordType } from '../../../../core/domain/healthRecords/RecordType';
import { PrakritiStats, VitalSigns } from '../../../../app/state/healthRecordsSlice';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import {
  LeafIcon,
  ActivityPulseIcon,
  PillMedicineIcon,
  FlaskLabIcon,
  SyringeIcon,
  AlertCircleIcon,
  ShieldVerifiedIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

export interface HealthMetricsSummaryProps {
  totalCount: number;
  prakritiStats: PrakritiStats;
  vitalSigns: VitalSigns;
  selectedType: RecordType | 'ALL';
  onSelectType: (type: RecordType | 'ALL') => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
}

export const HealthMetricsSummary: React.FC<HealthMetricsSummaryProps> = ({
  totalCount,
  prakritiStats,
  vitalSigns,
  selectedType,
  onSelectType,
  onOpenFilters,
  activeFilterCount,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const filterCategories = [
    { key: 'ALL' as const, label: 'All Records', icon: <LeafIcon size={14} color={selectedType === 'ALL' ? '#FFFFFF' : colors.primary} /> },
    { key: RecordType.PRESCRIPTION, label: 'Prescriptions', icon: <PillMedicineIcon size={14} color={selectedType === RecordType.PRESCRIPTION ? '#FFFFFF' : '#2D6A4F'} /> },
    { key: RecordType.LAB_REPORT, label: 'Lab Reports', icon: <FlaskLabIcon size={14} color={selectedType === RecordType.LAB_REPORT ? '#FFFFFF' : '#0077B6'} /> },
    { key: RecordType.CONSULTATION, label: 'Consultations', icon: <LeafIcon size={14} color={selectedType === RecordType.CONSULTATION ? '#FFFFFF' : '#7209B7'} /> },
    { key: RecordType.VACCINATION, label: 'Vaccinations', icon: <SyringeIcon size={14} color={selectedType === RecordType.VACCINATION ? '#FFFFFF' : '#D97706'} /> },
    { key: RecordType.ALLERGY, label: 'Allergies', icon: <AlertCircleIcon size={14} color={selectedType === RecordType.ALLERGY ? '#FFFFFF' : '#E63946'} /> },
  ];

  return (
    <View style={styles.container}>
      {/* Top Banner: Prakriti Dosha Profile & Ojas Index */}
      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
            padding: spacing.md,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleWithIcon}>
            <View style={[styles.leafBadge, { backgroundColor: colors.primary + '18', borderRadius: borderRadius.sm }]}>
              <LeafIcon size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={[typography.h3, { color: colors.text }]}>Ayurvedic Health Profile</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                Constitutional Prakriti: <Text style={{ fontWeight: '700', color: colors.primary }}>{prakritiStats.dominantDosha}</Text>
              </Text>
            </View>
          </View>
          <View style={[styles.ojasBadge, { backgroundColor: '#52B78822', borderRadius: borderRadius.round }]}>
            <ShieldVerifiedIcon size={14} color="#2D6A4F" />
            <Text style={[typography.caption, { color: '#2D6A4F', fontWeight: '700', marginLeft: 4 }]}>
              Ojas {vitalSigns.ojasScore}/100
            </Text>
          </View>
        </View>

        {/* Tridosha Balance Bar */}
        <View style={{ marginTop: spacing.md }}>
          <View style={styles.doshaLabelsRow}>
            <Text style={[typography.caption, { color: '#457B9D', fontWeight: '600' }]}>
              Vata ({prakritiStats.vata}%)
            </Text>
            <Text style={[typography.caption, { color: '#E76F51', fontWeight: '600' }]}>
              Pitta ({prakritiStats.pitta}%)
            </Text>
            <Text style={[typography.caption, { color: '#2A9D8F', fontWeight: '600' }]}>
              Kapha ({prakritiStats.kapha}%)
            </Text>
          </View>
          <View style={[styles.doshaProgressBar, { borderRadius: borderRadius.round }]}>
            <View style={[styles.doshaSegment, { flex: prakritiStats.vata, backgroundColor: '#457B9D' }]} />
            <View style={[styles.doshaSegment, { flex: prakritiStats.pitta, backgroundColor: '#E76F51' }]} />
            <View style={[styles.doshaSegment, { flex: prakritiStats.kapha, backgroundColor: '#2A9D8F' }]} />
          </View>
        </View>

        {/* Vitals Grid */}
        <View style={[styles.vitalsGrid, { marginTop: spacing.md, paddingTop: spacing.sm, borderTopColor: colors.border, borderTopWidth: 1 }]}>
          <View style={styles.vitalItem}>
            <View style={styles.vitalHeader}>
              <ActivityPulseIcon size={12} color={colors.primary} />
              <Text style={[typography.caption, { color: colors.textMuted, marginLeft: 4 }]}>Pulse / Nadi</Text>
            </View>
            <Text style={[typography.bodySmall, { color: colors.text, fontWeight: '700', marginTop: 2 }]}>
              {vitalSigns.pulse}
            </Text>
          </View>
          <View style={styles.vitalItem}>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Blood Pressure</Text>
            <Text style={[typography.bodySmall, { color: colors.text, fontWeight: '700', marginTop: 2 }]}>
              {vitalSigns.bp}
            </Text>
          </View>
          <View style={styles.vitalItem}>
            <Text style={[typography.caption, { color: colors.textMuted }]}>Body Mass / Agni</Text>
            <Text style={[typography.bodySmall, { color: colors.text, fontWeight: '700', marginTop: 2 }]}>
              {vitalSigns.bmi}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Filter Horizontal Scroll */}
      <View style={{ marginTop: spacing.md }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {filterCategories.map((cat) => {
            const isSelected = selectedType === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                activeOpacity={0.8}
                onPress={() => onSelectType(cat.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.round,
                  },
                ]}
              >
                {cat.icon}
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                      marginLeft: 6,
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  summaryCard: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leafBadge: {
    padding: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ojasBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  doshaLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  doshaProgressBar: {
    height: 8,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  doshaSegment: {
    height: '100%',
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vitalItem: {
    flex: 1,
  },
  vitalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
  },
});
