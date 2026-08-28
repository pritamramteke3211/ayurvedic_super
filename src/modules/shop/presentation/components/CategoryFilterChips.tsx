/**
 * @file src/modules/shop/presentation/components/CategoryFilterChips.tsx
 * @description Horizontal scrollable filter chips for Ayurvedic shop product categories.
 *
 * Invariants:
 * - High-speed instant filter switching.
 * - Adheres to theme tokens and accessibility touch target sizes (min 44px height).
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
import { SHOP_CATEGORIES } from '../../../../infrastructure/mock/shopMockData';

interface CategoryFilterChipsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilterChips: React.FC<CategoryFilterChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { colors, spacing, borderRadius, typography } = useAppTheme();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.container, { paddingHorizontal: spacing.md }]}
      >
        {SHOP_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelectCategory(category)}
              activeOpacity={0.7}
              style={[
                styles.chip,
                {
                  borderRadius: borderRadius.round,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  marginRight: spacing.sm,
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? '#FFFFFF' : colors.text,
                    fontSize: typography.caption.fontSize,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    letterSpacing: 0.2,
  },
});
