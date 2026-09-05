/**
 * @file src/app/navigation/HealthRecordsNavigator.tsx
 * @description Stack navigator for Health Records module (Timeline, Details, Add Record).
 *
 * Invariants:
 * - Employs strongly-typed HealthRecordsStackParamList.
 * - Displays an Under Maintenance / Focus placeholder during Consultation auditing with dev preview mode.
 * - Wraps stack inside an ErrorBoundary for bulletproof error trapping.
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HealthRecordsStackParamList } from './type';
import { HealthTimelineScreen } from '../../modules/healthRecords/presentation/screens/HealthTimelineScreen';
import { RecordDetailScreen } from '../../modules/healthRecords/presentation/screens/RecordDetailScreen';
import { AddRecordScreen } from '../../modules/healthRecords/presentation/screens/AddRecordScreen';
import { useAppTheme } from '../theme/useAppTheme';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';
import { UnderMaintenanceView } from '../../shared/components/FeatureStatusPlaceholder';

const Stack = createStackNavigator<HealthRecordsStackParamList>();

/**
 * Health Records Module placeholder screen displaying Under Maintenance status during Consultation audit.
 */
const HealthRecordsMaintenanceScreen: React.FC<{ onPreview: () => void }> = ({ onPreview }) => {
  return (
    <UnderMaintenanceView
      featureName="Ayurvedic Health Records & EHR"
      title="Health Records Under Upgrade"
      description="The Electronic Health Records and Prakriti Timeline module is undergoing offline vault encryption upgrades while you focus on auditing the Consultation Module."
      estimatedRelease="Security & Offline Sync Sprint"
      highlights={[
        'AES-256 encrypted local record vault sync',
        'Prakriti dosha assessment & EHR PDF attachments',
        '10,000+ patient medical history indexing',
      ]}
      primaryActionTitle="🌿 Focus on Consultation Module"
      secondaryActionTitle="👁️ Preview Records Screen (Dev Mode)"
      onSecondaryActionPress={onPreview}
    />
  );
};

export const HealthRecordsNavigator: React.FC = () => {
  const { colors } = useAppTheme();
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <ErrorBoundary>
      {isPreviewMode ? (
        <View style={styles.previewContainer}>
          <View style={[styles.devBanner, { backgroundColor: colors.warning + '22', borderColor: colors.warning }]}>
            <Text style={[styles.devBannerText, { color: colors.warning }]}>
              🛠️ DEV PREVIEW MODE ACTIVE
            </Text>
            <TouchableOpacity onPress={() => setIsPreviewMode(false)}>
              <Text style={[styles.devBannerAction, { color: colors.primary }]}>
                Back to Maintenance View
              </Text>
            </TouchableOpacity>
          </View>
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
        </View>
      ) : (
        <HealthRecordsMaintenanceScreen onPreview={() => setIsPreviewMode(true)} />
      )}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
  },
  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  devBannerText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  devBannerAction: {
    fontSize: 11,
    fontWeight: '700',
  },
});
