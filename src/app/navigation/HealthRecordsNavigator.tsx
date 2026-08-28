/**
 * @file src/app/navigation/HealthRecordsNavigator.tsx
 * @description Stack navigator for Health Records module (Timeline, Details, Add Record).
 *
 * Invariants:
 * - Employs strongly-typed HealthRecordsStackParamList.
 * - Manages seamless stack transitions with custom in-screen Ayurvedic headers.
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HealthRecordsStackParamList } from './type';
import { HealthTimelineScreen } from '../../modules/healthRecords/presentation/screens/HealthTimelineScreen';
import { RecordDetailScreen } from '../../modules/healthRecords/presentation/screens/RecordDetailScreen';
import { AddRecordScreen } from '../../modules/healthRecords/presentation/screens/AddRecordScreen';

const Stack = createStackNavigator<HealthRecordsStackParamList>();

export const HealthRecordsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="HealthTimeline"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="HealthTimeline" component={HealthTimelineScreen} />
      <Stack.Screen name="RecordDetails" component={RecordDetailScreen} />
      <Stack.Screen name="AddRecord" component={AddRecordScreen} />
    </Stack.Navigator>
  );
};
