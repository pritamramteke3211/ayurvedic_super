/**
 * @file src/shared/components/OfflineBanner.tsx
 * @description Global offline status and background sync progress banner.
 *
 * Invariants:
 * - Slides down smoothly when device is offline.
 * - Displays active pending sync count and reconnect indicator.
 */

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useIsOnline } from '../../infrastructure/network/networkManager';
import { syncManager } from '../../infrastructure/network/syncManager';
import { useAppTheme } from '../../app/theme/useAppTheme';

export const OfflineBanner: React.FC = () => {
  const isOnline = useIsOnline();
  const { colors, typography } = useAppTheme();
  const [syncStatus, setSyncStatus] = useState<{ isSyncing: boolean; count: number }>({
    isSyncing: false,
    count: 0,
  });

  useEffect(() => {
    return syncManager.subscribe((isSyncing, count) => {
      setSyncStatus({ isSyncing, count });
    });
  }, []);

  if (isOnline && !syncStatus.isSyncing && syncStatus.count === 0) {
    return null;
  }

  let bannerBg = colors.warning;
  let bannerText = '⚡ Offline Mode: Changes will auto-sync when online';

  if (syncStatus.isSyncing) {
    bannerBg = colors.primary;
    bannerText = `🔄 Syncing ${syncStatus.count} pending offline change${syncStatus.count > 1 ? 's' : ''}...`;
  } else if (!isOnline) {
    bannerBg = '#D97706';
    bannerText = syncStatus.count > 0
      ? `⚡ Offline Mode (${syncStatus.count} action${syncStatus.count > 1 ? 's' : ''} queued)`
      : '⚡ Offline Mode: Working from local cache';
  }

  return (
    <View style={[styles.container, { backgroundColor: bannerBg }]}>
      <Text style={[typography.caption, styles.text]}>
        {bannerText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
  },
});
