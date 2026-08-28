/**
 * @file src/shared/components/ErrorView.tsx
 * @description State 3 (Error with Retry) presentation component providing clear error messaging and recovery actions.
 *
 * Invariants:
 * - Always provides an explicit retry mechanism when `onRetry` is supplied.
 * - Formats network and domain errors into user-digestible explanations.
 */

import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../app/theme/useAppTheme';
import { Button } from './Button';

export interface ErrorViewProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryTitle?: string;
  isRetrying?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Something Went Wrong',
  message,
  onRetry,
  retryTitle = 'Try Again',
  isRetrying = false,
  style,
}) => {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }, style]}>
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: colors.error + '18',
            borderColor: colors.error + '40',
            marginBottom: spacing.md,
          },
        ]}
      >
        <Text style={styles.iconText}>⚠️</Text>
      </View>

      <Text style={[typography.h3, { color: colors.text, textAlign: 'center' }]}>
        {title}
      </Text>

      <Text
        style={[
          typography.bodyMedium,
          {
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: spacing.sm,
            marginBottom: onRetry ? spacing.lg : 0,
            maxWidth: 320,
          },
        ]}
      >
        {message}
      </Text>

      {onRetry ? (
        <Button
          title={retryTitle}
          onPress={onRetry}
          loading={isRetrying}
          variant="primary"
          size="md"
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 28,
  },
});
