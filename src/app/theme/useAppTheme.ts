/**
 * @file src/app/theme/useAppTheme.ts
 * @description Centralized React hook providing reactive theme tokens (colors, typography, spacing, borderRadius).
 *
 * Invariants:
 * - Automatically adapts to device color scheme (light/dark mode).
 * - Exposes typed color tokens conforming to the ThemeColors interface.
 */

import { useColorScheme } from 'react-native';
import { colors, ThemeColors } from './colors';
import { spacing, borderRadius } from './spacing';
import { typography } from './typography';

export interface AppTheme {
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
}

export function useAppTheme(): AppTheme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const activeColors = isDark ? colors.dark : colors.light;

  return {
    isDark,
    colors: activeColors,
    spacing,
    borderRadius,
    typography,
  };
}
