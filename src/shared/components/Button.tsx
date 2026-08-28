/**
 * @file src/shared/components/Button.tsx
 * @description Accessible, theme-aware Button primitive supporting multiple visual variants,
 * sizing scales, loading states, and icon decorations.
 *
 * Invariants:
 * - When `loading` or `disabled` is true, press events are suppressed.
 * - Sizing and color palettes adapt dynamically to active light/dark themes.
 */

import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../app/theme/useAppTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const { colors, spacing, borderRadius } = useAppTheme();
  const isInteractive = !disabled && !loading;

  // Size specifications
  const sizeStyles: Record<ButtonSize, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
    sm: { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.sm + 4, fontSize: 13 },
    md: { paddingVertical: spacing.sm + 4, paddingHorizontal: spacing.md, fontSize: 15 },
    lg: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, fontSize: 17 },
  };

  const currentSize = sizeStyles[size];

  // Variant backgrounds and borders
  const getContainerStyle = (): ViewStyle => {
    let backgroundColor = 'transparent';
    let borderColor = 'transparent';
    let borderWidth = 0;

    switch (variant) {
      case 'primary':
        backgroundColor = disabled ? colors.textMuted : colors.primary;
        break;
      case 'secondary':
        backgroundColor = disabled ? colors.border : colors.secondary;
        break;
      case 'outline':
        backgroundColor = 'transparent';
        borderColor = disabled ? colors.border : colors.primary;
        borderWidth = 1.5;
        break;
      case 'danger':
        backgroundColor = disabled ? colors.textMuted : colors.error;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        break;
    }

    return {
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius: borderRadius.md,
      paddingVertical: currentSize.paddingVertical,
      paddingHorizontal: currentSize.paddingHorizontal,
      alignSelf: fullWidth ? 'stretch' : 'auto',
      opacity: disabled ? 0.6 : 1,
    };
  };

  // Text colors
  const getTextColor = (): string => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return colors.primaryDark;
      case 'outline':
      case 'ghost':
        return disabled ? colors.textMuted : colors.primary;
      default:
        return colors.text;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!isInteractive}
      style={[styles.base, getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.iconSpacing}>{leftIcon}</View> : null}
          <Text
            style={[
              styles.textBase,
              { color: getTextColor(), fontSize: currentSize.fontSize },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon ? <View style={styles.iconSpacingRight}>{rightIcon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacing: {
    marginRight: 8,
  },
  iconSpacingRight: {
    marginLeft: 8,
  },
  textBase: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
