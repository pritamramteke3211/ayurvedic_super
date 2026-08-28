/**
 * @file src/app/navigation/MainNavigator.tsx
 * @description Root Navigation Container integrating @react-navigation/native with dynamic Ayurvedic theme tokens.
 *
 * Invariants:
 * - Provides top-level NavigationContainer with active dark/light mode theme configuration.
 * - Mounts BottomTabNavigator providing access to Consultation, Shop, and Health Records.
 */

import React from 'react';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { BottomTabNavigator } from './BottomTabNavigator';
import { useAppTheme } from '../theme/useAppTheme';
import { linking } from './linking';

export const MainNavigator: React.FC = () => {
  const { isDark, colors } = useAppTheme();

  const navigationTheme: Theme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '900' },
    },
  };

  return (
    <NavigationContainer theme={navigationTheme} linking={linking}>
      <BottomTabNavigator />
    </NavigationContainer>
  );
};
