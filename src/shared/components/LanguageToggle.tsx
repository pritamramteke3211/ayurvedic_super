/**
 * @file src/shared/components/LanguageToggle.tsx
 * @description Theme-aware pill toggle allowing dynamic switching between English (EN) and Hindi (हिन्दी).
 *
 * Invariants:
 * - Employs accessibility labels and smooth visual feedback on toggle.
 * - Reactive to i18n manager state updates.
 */

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../app/theme/useAppTheme';
import { useTranslation } from '../i18n/useTranslation';

export interface LanguageToggleProps {
  compact?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ compact = false }) => {
  const { colors, spacing, borderRadius } = useAppTheme();
  const { locale, setLocale } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: borderRadius.round,
          padding: 2,
        },
      ]}
      accessibilityRole="radiogroup"
      accessibilityLabel="Language Selection"
    >
      <TouchableOpacity
        style={[
          styles.pill,
          locale === 'en' && [styles.activePill, { backgroundColor: colors.primary }],
          compact && styles.compactPill,
        ]}
        onPress={() => setLocale('en')}
        accessibilityRole="radio"
        accessibilityState={{ selected: locale === 'en' }}
        accessibilityLabel="English"
      >
        <Text
          style={[
            styles.text,
            { color: locale === 'en' ? '#FFFFFF' : colors.textMuted },
            compact && styles.compactText,
          ]}
        >
          EN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.pill,
          locale === 'hi' && [styles.activePill, { backgroundColor: colors.primary }],
          compact && styles.compactPill,
        ]}
        onPress={() => setLocale('hi')}
        accessibilityRole="radio"
        accessibilityState={{ selected: locale === 'hi' }}
        accessibilityLabel="Hindi"
      >
        <Text
          style={[
            styles.text,
            { color: locale === 'hi' ? '#FFFFFF' : colors.textMuted },
            compact && styles.compactText,
          ]}
        >
          हिन्दी
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  compactPill: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  activePill: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
  compactText: {
    fontSize: 11,
  },
});
