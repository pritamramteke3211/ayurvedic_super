/**
 * @file src/modules/consultation/presentation/components/DoctorFilterModal.tsx
 * @description Bottom sheet modal for advanced multi-criteria filtering and sorting of Ayurvedic doctors.
 *
 * Invariants:
 * - Local state holds filter selections until user presses "Apply Filters".
 * - "Reset All" clears local state back to default.
 * - Supports theme-aware light/dark styling with accessible touch targets.
 */

import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../../../../app/theme/useAppTheme';

export interface DoctorFilterValues {
  minRating?: number;
  maxFee?: number;
  minExperience?: number;
  sortBy?: 'rating_desc' | 'experience_desc' | 'fee_asc' | 'fee_desc';
  availableTodayOnly?: boolean;
}

interface DoctorFilterModalProps {
  visible: boolean;
  onClose: () => void;
  initialFilters: DoctorFilterValues;
  onApply: (filters: DoctorFilterValues) => void;
  onReset: () => void;
}

const RATING_OPTIONS = [
  { label: 'Any Rating', value: undefined },
  { label: '★ 4.0+', value: 4.0 },
  { label: '★ 4.5+', value: 4.5 },
  { label: '★ 4.8+', value: 4.8 },
];

const FEE_OPTIONS = [
  { label: 'Any Fee', value: undefined },
  { label: 'Under ₹500', value: 500 },
  { label: 'Under ₹1,000', value: 1000 },
  { label: 'Under ₹1,500', value: 1500 },
  { label: 'Under ₹2,500', value: 2500 },
];

const EXP_OPTIONS = [
  { label: 'Any Experience', value: undefined },
  { label: '5+ Years', value: 5 },
  { label: '10+ Years', value: 10 },
  { label: '15+ Years', value: 15 },
  { label: '20+ Years', value: 20 },
];

const SORT_OPTIONS: { label: string; value: DoctorFilterValues['sortBy'] }[] = [
  { label: 'Recommended', value: undefined },
  { label: 'Rating: High to Low', value: 'rating_desc' },
  { label: 'Experience: Most Senior', value: 'experience_desc' },
  { label: 'Fee: Low to High', value: 'fee_asc' },
  { label: 'Fee: High to Low', value: 'fee_desc' },
];

export const DoctorFilterModal: React.FC<DoctorFilterModalProps> = ({
  visible,
  onClose,
  initialFilters,
  onApply,
  onReset,
}) => {
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();

  const [minRating, setMinRating] = useState<number | undefined>(initialFilters.minRating);
  const [maxFee, setMaxFee] = useState<number | undefined>(initialFilters.maxFee);
  const [minExperience, setMinExperience] = useState<number | undefined>(initialFilters.minExperience);
  const [sortBy, setSortBy] = useState<DoctorFilterValues['sortBy']>(initialFilters.sortBy);
  const [availableTodayOnly, setAvailableTodayOnly] = useState<boolean>(
    !!initialFilters.availableTodayOnly,
  );

  const handleReset = () => {
    setMinRating(undefined);
    setMaxFee(undefined);
    setMinExperience(undefined);
    setSortBy(undefined);
    setAvailableTodayOnly(false);
    onReset();
    onClose();
  };

  const handleApply = () => {
    onApply({
      minRating,
      maxFee,
      minExperience,
      sortBy,
      availableTodayOnly,
    });
    onClose();
  };

  const activeCount = [
    minRating !== undefined,
    maxFee !== undefined,
    minExperience !== undefined,
    sortBy !== undefined,
    availableTodayOnly,
  ].filter(Boolean).length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheetContainer,
            {
              backgroundColor: isDark ? colors.card : '#FFFFFF',
              borderColor: colors.border,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
            },
          ]}
        >
          {/* Sheet Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.border, paddingHorizontal: spacing.lg },
            ]}
          >
            <View>
              <Text style={[typography.h3, { color: colors.text }]}>
                Filter & Sort
              </Text>
              {activeCount > 0 && (
                <Text style={[typography.caption, { color: colors.primary, marginTop: 2 }]}>
                  {activeCount} active {activeCount === 1 ? 'filter' : 'filters'}
                </Text>
              )}
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleReset}
                activeOpacity={0.7}
                style={[styles.resetButton, { paddingHorizontal: spacing.sm }]}
              >
                <Text style={[typography.bodySmall, { color: colors.error }]}>
                  Reset All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: isDark ? colors.background : '#F3F4F6',
                    borderRadius: borderRadius.round,
                    marginLeft: spacing.sm,
                  },
                ]}
              >
                <Text style={[styles.closeIcon, { color: colors.text }]}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Filters */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.contentContainer, { paddingHorizontal: spacing.lg }]}
          >
            {/* Section 1: Sort By */}
            <View style={styles.section}>
              <Text style={[typography.h4, { color: colors.text, marginBottom: spacing.sm }]}>
                Sort By
              </Text>
              <View style={styles.chipsRow}>
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      onPress={() => setSortBy(opt.value)}
                      activeOpacity={0.75}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : isDark ? colors.background : '#F3F4F6',
                          borderColor: isSelected ? colors.primary : colors.border,
                          borderRadius: borderRadius.md,
                          paddingVertical: spacing.xs + 3,
                          paddingHorizontal: spacing.md,
                          marginRight: spacing.xs,
                          marginBottom: spacing.xs,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.caption,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? '600' : '400',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 2: Minimum Rating */}
            <View style={styles.section}>
              <Text style={[typography.h4, { color: colors.text, marginBottom: spacing.sm }]}>
                Minimum Rating
              </Text>
              <View style={styles.chipsRow}>
                {RATING_OPTIONS.map((opt) => {
                  const isSelected = minRating === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      onPress={() => setMinRating(opt.value)}
                      activeOpacity={0.75}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : isDark ? colors.background : '#F3F4F6',
                          borderColor: isSelected ? colors.primary : colors.border,
                          borderRadius: borderRadius.md,
                          paddingVertical: spacing.xs + 3,
                          paddingHorizontal: spacing.md,
                          marginRight: spacing.xs,
                          marginBottom: spacing.xs,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.caption,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? '600' : '400',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 3: Consultation Fee */}
            <View style={styles.section}>
              <Text style={[typography.h4, { color: colors.text, marginBottom: spacing.sm }]}>
                Max Consultation Fee
              </Text>
              <View style={styles.chipsRow}>
                {FEE_OPTIONS.map((opt) => {
                  const isSelected = maxFee === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      onPress={() => setMaxFee(opt.value)}
                      activeOpacity={0.75}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : isDark ? colors.background : '#F3F4F6',
                          borderColor: isSelected ? colors.primary : colors.border,
                          borderRadius: borderRadius.md,
                          paddingVertical: spacing.xs + 3,
                          paddingHorizontal: spacing.md,
                          marginRight: spacing.xs,
                          marginBottom: spacing.xs,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.caption,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? '600' : '400',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 4: Experience */}
            <View style={styles.section}>
              <Text style={[typography.h4, { color: colors.text, marginBottom: spacing.sm }]}>
                Minimum Experience
              </Text>
              <View style={styles.chipsRow}>
                {EXP_OPTIONS.map((opt) => {
                  const isSelected = minExperience === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      onPress={() => setMinExperience(opt.value)}
                      activeOpacity={0.75}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: isSelected ? colors.primary : isDark ? colors.background : '#F3F4F6',
                          borderColor: isSelected ? colors.primary : colors.border,
                          borderRadius: borderRadius.md,
                          paddingVertical: spacing.xs + 3,
                          paddingHorizontal: spacing.md,
                          marginRight: spacing.xs,
                          marginBottom: spacing.xs,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.caption,
                          {
                            color: isSelected ? '#FFFFFF' : colors.text,
                            fontWeight: isSelected ? '600' : '400',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Section 5: Availability */}
            <View style={styles.section}>
              <Text style={[typography.h4, { color: colors.text, marginBottom: spacing.sm }]}>
                Availability
              </Text>
              <TouchableOpacity
                onPress={() => setAvailableTodayOnly(!availableTodayOnly)}
                activeOpacity={0.75}
                style={[
                  styles.chip,
                  {
                    backgroundColor: availableTodayOnly ? colors.primary : isDark ? colors.background : '#F3F4F6',
                    borderColor: availableTodayOnly ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.xs + 3,
                    paddingHorizontal: spacing.md,
                    alignSelf: 'flex-start',
                  },
                ]}
              >
                <Text
                  style={[
                    typography.caption,
                    {
                      color: availableTodayOnly ? '#FFFFFF' : colors.text,
                      fontWeight: availableTodayOnly ? '600' : '400',
                    },
                  ]}
                >
                  ⚡ Available Today Only
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: colors.border,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                backgroundColor: isDark ? colors.card : '#FFFFFF',
              },
            ]}
          >
            <TouchableOpacity
              onPress={handleApply}
              activeOpacity={0.85}
              style={[
                styles.applyButton,
                {
                  backgroundColor: colors.primary,
                  borderRadius: borderRadius.lg,
                  paddingVertical: spacing.md,
                },
              ]}
            >
              <Text style={[typography.button, { color: '#FFFFFF', textAlign: 'center' }]}>
                Apply Filters {activeCount > 0 ? `(${activeCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    maxHeight: '85%',
    borderWidth: 1,
    borderBottomWidth: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetButton: {
    paddingVertical: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  contentContainer: {
    paddingVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
  },
  footer: {
    borderTopWidth: 1,
  },
  applyButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
