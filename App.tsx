/**
 * @file App.tsx
 * @description Amrutam Ayurvedic Super App Root Component.
 *
 * Invariants:
 * - Provides Redux Provider (<Provider store={store}>) at application root.
 * - Mounts global OfflineBanner and initializes background sync queue listeners.
 * - Provides SafeAreaProvider and dynamic theme status bar.
 * - Mounts the MainNavigator containing Consultation, Shop, and Health Records tabs.
 */

import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/app/state/store';
import { MainNavigator } from './src/app/navigation/MainNavigator';
import { OfflineBanner } from './src/shared/components/OfflineBanner';
import { syncManager } from './src/infrastructure/network/syncManager';
import { useAppTheme } from './src/app/theme/useAppTheme';

function AppContent() {
  const { isDark, colors } = useAppTheme();

  useEffect(() => {
    syncManager.startListening();
    return () => {
      syncManager.stopListening();
    };
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <OfflineBanner />
      <MainNavigator />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
