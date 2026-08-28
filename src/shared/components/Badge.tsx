/**
 * @file src/shared/components/Badge.tsx
 * @description Compact semantic tag/badge used for doctor specialties, ratings, and status pills.
 *
 * Invariants:
 * - Employs accessible contrast ratios between badge background and text colors.
 */

import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../app/theme/useAppTheme';

export type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'secondary',
  size = 'sm',
  icon,
  style,
  textStyle,
}) => {
  const { colors, spacing, borderRadius, isDark } = useAppTheme();

  const getColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'primary':
        return { bg: isDark ? '#1B4332' : '#E8F5E9', text: colors.primary };
      case 'secondary':
        return { bg: colors.secondary, text: colors.primaryDark };
      case 'accent':
        return { bg: isDark ? '#3D2F1B' : '#FEF3E2', text: colors.accent };
      case 'success':
        return { bg: isDark ? '#064E3B' : '#D1FAE5', text: colors.success };
      case 'warning':
        return { bg: isDark ? '#451A03' : '#FEF3C7', text: colors.warning };
      case 'error':
        return { bg: isDark ? '#450A0A' : '#FEE2E2', text: colors.error };
      case 'neutral':
      default:
        return { bg: isDark ? '#2D2D2D' : '#F3F4F6', text: colors.textSecondary };
    }
  };

  const { bg, text: textColor } = getColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderRadius: borderRadius.round,
          paddingVertical: isSmall ? 2 : spacing.xs,
          paddingHorizontal: isSmall ? spacing.sm : spacing.md,
        },
        style,
      ]}
    >
      {icon ? <View style={styles.iconMargin}>{icon}</View> : null}
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: isSmall ? 11 : 13,
            fontWeight: '600',
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  iconMargin: {
    marginRight: 4,
  },
  text: {
    letterSpacing: 0.2,
  },
});
