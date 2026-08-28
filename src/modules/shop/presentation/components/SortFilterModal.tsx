/**
 * @file src/modules/shop/presentation/components/SortFilterModal.tsx
 * @description Modal bottom sheet for sorting and multi-filtering the 20,000 product catalog.
 *
 * Invariants:
 * - Provides immediate feedback and preview of active filter criteria.
 * - Allows clearing all filters or applying modifications atomically.
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
import { ProductSortOption } from '../../../../core/domain/shop/ShopRepository';
import { Button } from '../../../../shared/components/Button';
import {
  StarIcon,
  SortAscIcon,
  FilterIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

export interface FilterStateValues {
  sortBy: ProductSortOption;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  minRating?: number;
}

interface SortFilterModalProps {
  visible: boolean;
  initialFilters: FilterStateValues;
  onClose: () => void;
  onApply: (filters: FilterStateValues) => void;
  onReset: () => void;
}

const SORT_OPTIONS: { label: string; value: ProductSortOption }[] = [
  { label: 'Popularity', value: 'popular' },
  { label: 'Price: Low to High', value: 'price_low_high' },
  { label: 'Price: High to Low', value: 'price_high_low' },
  { label: 'Customer Rating', value: 'rating' },
];

const PRICE_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: 'All Prices' },
  { label: 'Under ₹500', max: 500 },
  { label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { label: 'Above ₹1,000', min: 1000 },
];

const RATING_PRESETS = [
  { label: 'Any Rating', value: undefined },
  { label: '4.0 ★ & above', value: 4.0 },
  { label: '4.5 ★ & above', value: 4.5 },
];

export const SortFilterModal: React.FC<SortFilterModalProps> = ({
  visible,
  initialFilters,
  onClose,
  onApply,
  onReset,
}) => {
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();

  const [sortBy, setSortBy] = useState<ProductSortOption>(initialFilters.sortBy);
  const [minPrice, setMinPrice] = useState<number | undefined>(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialFilters.maxPrice);
  const [inStockOnly, setInStockOnly] = useState<boolean>(initialFilters.inStockOnly);
  const [minRating, setMinRating] = useState<number | undefined>(initialFilters.minRating);

  const handleApply = () => {
    onApply({
      sortBy,
      minPrice,
      maxPrice,
      inStockOnly,
      minRating,
    });
    onClose();
  };

  const handleReset = () => {
    setSortBy('popular');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setInStockOnly(false);
    setMinRating(undefined);
    onReset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.sheetContainer,
            {
              backgroundColor: colors.card,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              borderColor: colors.border,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.border, padding: spacing.md },
            ]}
          >
            <View style={styles.headerTitleRow}>
              <FilterIcon size={20} color={colors.primary} />
              <Text
                style={[
                  styles.headerTitle,
                  { color: colors.text, fontSize: typography.h3.fontSize },
                ]}
              >
                Sort & Filter
              </Text>
            </View>
            <TouchableOpacity onPress={handleReset} hitSlop={8}>
              <Text style={[styles.resetText, { color: colors.error }]}>
                Reset All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={[styles.body, { padding: spacing.md }]}>
            {/* Sort Options */}
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: typography.body.fontSize },
              ]}
            >
              Sort By
            </Text>
            <View style={styles.optionsWrap}>
              {SORT_OPTIONS.map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setSortBy(opt.value)}
                    style={[
                      styles.filterChip,
                      {
                        borderRadius: borderRadius.md,
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected
                          ? isDark
                            ? '#1B3A2C'
                            : '#E8F5E9'
                          : colors.background,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? colors.primary : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Price Filter */}
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.body.fontSize,
                  marginTop: spacing.md,
                },
              ]}
            >
              Price Range
            </Text>
            <View style={styles.optionsWrap}>
              {PRICE_PRESETS.map((preset) => {
                const isSelected =
                  minPrice === preset.min && maxPrice === preset.max;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    onPress={() => {
                      setMinPrice(preset.min);
                      setMaxPrice(preset.max);
                    }}
                    style={[
                      styles.filterChip,
                      {
                        borderRadius: borderRadius.md,
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected
                          ? isDark
                            ? '#1B3A2C'
                            : '#E8F5E9'
                          : colors.background,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? colors.primary : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Rating Filter */}
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.text,
                  fontSize: typography.body.fontSize,
                  marginTop: spacing.md,
                },
              ]}
            >
              Minimum Rating
            </Text>
            <View style={styles.optionsWrap}>
              {RATING_PRESETS.map((preset) => {
                const isSelected = minRating === preset.value;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    onPress={() => setMinRating(preset.value)}
                    style={[
                      styles.filterChip,
                      {
                        borderRadius: borderRadius.md,
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected
                          ? isDark
                            ? '#1B3A2C'
                            : '#E8F5E9'
                          : colors.background,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: isSelected ? colors.primary : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}
                    >
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* In-Stock Only Toggle */}
            <TouchableOpacity
              onPress={() => setInStockOnly(!inStockOnly)}
              activeOpacity={0.7}
              style={[
                styles.stockToggleRow,
                {
                  backgroundColor: inStockOnly
                    ? isDark
                      ? '#1B3A2C'
                      : '#E8F5E9'
                    : colors.background,
                  borderColor: inStockOnly ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginTop: spacing.lg,
                  marginBottom: spacing.xl,
                },
              ]}
            >
              <View>
                <Text
                  style={[
                    styles.stockToggleTitle,
                    { color: colors.text, fontSize: typography.body.fontSize },
                  ]}
                >
                  In-Stock Items Only
                </Text>
                <Text
                  style={[
                    styles.stockToggleSub,
                    { color: colors.textMuted, fontSize: typography.caption.fontSize },
                  ]}
                >
                  Hide out-of-stock items from catalog
                </Text>
              </View>
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: inStockOnly ? colors.primary : colors.border,
                    backgroundColor: inStockOnly ? colors.primary : 'transparent',
                    borderRadius: borderRadius.sm,
                  },
                ]}
              >
                {inStockOnly && <Text style={styles.checkmarkText}>✓</Text>}
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer CTAs */}
          <View
            style={[
              styles.footer,
              { borderTopColor: colors.border, padding: spacing.md },
            ]}
          >
            <Button
              title="Apply Filters"
              onPress={handleApply}
              variant="primary"
              fullWidth
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    maxHeight: '85%',
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '700',
    marginLeft: 8,
  },
  resetText: {
    fontWeight: '600',
    fontSize: 13,
  },
  body: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 13,
  },
  stockToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  stockToggleTitle: {
    fontWeight: '600',
  },
  stockToggleSub: {
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  footer: {
    borderTopWidth: 1,
  },
});
