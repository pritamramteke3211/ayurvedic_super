/**
 * @file src/modules/consultation/presentation/components/SpecialtyFilterBar.tsx
 * @description Horizontal scrollable filter bar containing Ayurvedic specialty chips and availability toggle.
 *
 * Invariants:
 * - Single-select active specialty filter.
 * - Multi-criteria toggle for 'Available Today'.
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { AYURVEDIC_SPECIALTIES } from '../../../../infrastructure/mock/consultationMockData';

interface SpecialtyFilterBarProps {
  selectedSpecialty: string;
  onSelectSpecialty: (specialty: string) => void;
  availableTodayOnly: boolean;
  onToggleAvailableToday: () => void;
}

export const SpecialtyFilterBar: React.FC<SpecialtyFilterBarProps> = ({
  selectedSpecialty,
  onSelectSpecialty,
  availableTodayOnly,
  onToggleAvailableToday,
}) => {
  const { colors, spacing, borderRadius, isDark } = useAppTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.md }]}
      >
        {/* 'Available Today' Fast Toggle Chip */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onToggleAvailableToday}
          style={[
            styles.chip,
            {
              backgroundColor: availableTodayOnly ? colors.primary : colors.card,
              borderColor: availableTodayOnly ? colors.primary : colors.border,
              borderRadius: borderRadius.round,
              paddingVertical: spacing.xs + 2,
              paddingHorizontal: spacing.md,
              marginRight: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              styles.chipText,
              {
                color: availableTodayOnly ? '#FFFFFF' : colors.text,
                fontWeight: availableTodayOnly ? '700' : '500',
              },
            ]}
          >
            ⚡ Available Today
          </Text>
        </TouchableOpacity>

        {/* Specialty Filter Chips */}
        {AYURVEDIC_SPECIALTIES.map((spec) => {
          const isSelected = selectedSpecialty === spec;

          return (
            <TouchableOpacity
              key={spec}
              activeOpacity={0.8}
              onPress={() => onSelectSpecialty(spec)}
              style={[
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.primary : isDark ? colors.card : '#FFFFFF',
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderRadius: borderRadius.round,
                  paddingVertical: spacing.xs + 2,
                  paddingHorizontal: spacing.md,
                  marginRight: spacing.sm,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.text,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {spec}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chipText: {
    fontSize: 13,
  },
});
