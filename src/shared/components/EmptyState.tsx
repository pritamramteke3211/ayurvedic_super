/**
 * @file src/shared/components/EmptyState.tsx
 * @description State 2 (Empty) visual fallback component when data lists or searches return zero records.
 *
 * Invariants:
 * - Provides distinct title, descriptive explanation, and an optional CTA button.
 * - Center-aligns content for balanced visual hierarchy.
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

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  emoji?: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  emoji = '🌿',
  actionTitle,
  onActionPress,
  style,
}) => {
  const { colors, spacing, typography } = useAppTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }, style]}>
      {icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : (
        <Text style={styles.emoji}>{emoji}</Text>
      )}

      <Text style={[typography.h3, { color: colors.text, textAlign: 'center', marginTop: spacing.md }]}>
        {title}
      </Text>

      <Text
        style={[
          typography.bodyMedium,
          {
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: spacing.sm,
            marginBottom: actionTitle ? spacing.lg : 0,
            maxWidth: 320,
          },
        ]}
      >
        {description}
      </Text>

      {actionTitle && onActionPress ? (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          variant="outline"
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
  iconContainer: {
    marginBottom: 8,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
  },
});
