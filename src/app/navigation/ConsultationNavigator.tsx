/**
 * @file src/app/navigation/ConsultationNavigator.tsx
 * @description React Navigation Stack Navigator for the Doctor Consultation module.
 *
 * Invariants:
 * - Employs @react-navigation/stack with native gesture handler integration and card transitions.
 * - Wraps the stack inside an ErrorBoundary for bulletproof error trapping.
 */

import React from 'react';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { ConsultationStackParamList } from './type';
import { DoctorListScreen } from '../../modules/consultation/presentation/screens/DoctorListScreen';
import { DoctorDetailScreen } from '../../modules/consultation/presentation/screens/DoctorDetailScreen';
import { BookingScreen } from '../../modules/consultation/presentation/screens/BookingScreen';
import { MyBookingsScreen } from '../../modules/consultation/presentation/screens/MyBookingsScreen';
import { useAppTheme } from '../theme/useAppTheme';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';

const Stack = createStackNavigator<ConsultationStackParamList>();

export const ConsultationNavigator: React.FC = () => {
  const { colors } = useAppTheme();

  return (
    <ErrorBoundary>
      <Stack.Navigator
        initialRouteName="DoctorList"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: colors.background },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="DoctorList"
          component={DoctorListScreen}
        />
        <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetailScreen}
        />
        <Stack.Screen
          name="BookingSlot"
          component={BookingScreen}
        />
        <Stack.Screen
          name="MyBookings"
          component={MyBookingsScreen}
        />
      </Stack.Navigator>
    </ErrorBoundary>
  );
};
