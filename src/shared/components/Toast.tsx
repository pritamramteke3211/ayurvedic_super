/**
 * @file src/shared/components/Toast.tsx
 * @description Floating in-app notification banner for instant feedback (booking confirmations, cancellation alerts).
 *
 * Invariants:
 * - Automatically dismisses after durationMs.
 * - Supports success, warning, and error aesthetic styles.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppTheme } from '../../app/theme/useAppTheme';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  durationMs?: number;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'success',
  durationMs = 3500,
  onDismiss,
}) => {
  const { colors, spacing, borderRadius } = useAppTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();

      const timer = setTimeout(() => {
        handleDismiss();
      }, durationMs);

      return () => clearTimeout(timer);
    } else {
      opacity.setValue(0);
      translateY.setValue(-20);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
    ]).start(() => onDismiss());
  };

  if (!visible) return null;

  const getStyle = (): { bg: string; icon: string; border: string } => {
    switch (type) {
      case 'success':
        return { bg: '#064E3B', icon: '🌿', border: colors.primaryLight };
      case 'error':
        return { bg: '#7F1D1D', icon: '❌', border: colors.error };
      case 'info':
      default:
        return { bg: '#1E293B', icon: 'ℹ️', border: '#64748B' };
    }
  };

  const { bg, icon, border } = getStyle();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: bg,
          borderColor: border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginHorizontal: spacing.md,
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={handleDismiss} style={styles.row}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.message}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 9999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
