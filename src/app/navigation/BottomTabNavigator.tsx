/**
 * @file src/app/navigation/BottomTabNavigator.tsx
 * @description Primary bottom tab navigator switching between Consultation, Shop, and Health Records.
 *
 * Invariants:
 * - Uses @react-navigation/bottom-tabs with custom SVG icons and theme tokens.
 * - Tab switching maintains stack state in individual module navigators.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ConsultationNavigator } from './ConsultationNavigator';
import { ShopNavigator } from './ShopNavigator';
import { HealthRecordsHomeScreen } from '../../modules/healthRecords/presentation/screens/HealthRecordsHomeScreen';
import { useAppTheme } from '../theme/useAppTheme';
import {
  LeafIcon,
  ShoppingBagIcon,
  HealthRecordsIcon,
} from '../../shared/components/icons/AyurvedicIcons';

export type BottomTabParamList = {
  Consultations: undefined;
  Shop: undefined;
  HealthRecords: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  const { colors, isDark } = useAppTheme();

  return (
    <Tab.Navigator
      initialRouteName="Consultations"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Consultations"
        component={ConsultationNavigator}
        options={{
          tabBarLabel: 'Consult',
          tabBarIcon: ({ color, size }) => (
            <LeafIcon size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopNavigator}
        options={{
          tabBarLabel: 'Shop',
          tabBarIcon: ({ color, size }) => (
            <ShoppingBagIcon size={size || 22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HealthRecords"
        component={HealthRecordsHomeScreen}
        options={{
          tabBarLabel: 'Records',
          tabBarIcon: ({ color, size }) => (
            <HealthRecordsIcon size={size || 22} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
