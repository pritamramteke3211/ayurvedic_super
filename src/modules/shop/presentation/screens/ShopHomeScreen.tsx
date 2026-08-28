/**
 * @file src/modules/shop/presentation/screens/ShopHomeScreen.tsx
 * @description Shop Module entry screen placeholder showcasing 20,000 product catalog entry point.
 *
 * Invariants:
 * - Employs design tokens from useAppTheme.
 * - Ready for FlashList product feed and category filter bar.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { ShoppingBagIcon } from '../../../../shared/components/icons/AyurvedicIcons';

export const ShopHomeScreen: React.FC = () => {
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
        <ShoppingBagIcon size={36} color={colors.primary} />
      </View>
      <Text style={[typography.h1, { color: colors.text, textAlign: 'center' }]}>
        Ayurvedic Shop
      </Text>
      <Text
        style={[
          typography.bodyMedium,
          { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, maxWidth: 280 },
        ]}
      >
        20,000+ Classical Ayurvedic herbs, rasayanas, herbal teas & wellness remedies.
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
