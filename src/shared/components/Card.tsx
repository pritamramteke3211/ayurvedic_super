/**
 * @file src/shared/components/Card.tsx
 * @description Themed Card container supporting elevated, outlined, and flat variants
 * with optional press interactions.
 *
 * Invariants:
 * - Adapts surface colors and border tokens automatically based on active theme mode.
 * - Renders an interactive TouchableOpacity if onPress is provided; otherwise renders a static View.
 */

import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../app/theme/useAppTheme';

export type CardVariant = 'elevated' | 'outlined' | 'flat';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'md',
  onPress,
  style,
}) => {
  const { colors, spacing, borderRadius, isDark } = useAppTheme();

  const paddingValues: Record<CardPadding, number> = {
    none: 0,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: isDark ? colors.border : '#F1F5F2',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 6,
          elevation: 2,
        };
      case 'outlined':
        return {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'flat':
        return {
          backgroundColor: colors.surface,
          borderWidth: 0,
        };
    }
  };

  const containerStyle: ViewStyle = {
    borderRadius: borderRadius.lg,
    padding: paddingValues[padding],
    ...getVariantStyle(),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[containerStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};
