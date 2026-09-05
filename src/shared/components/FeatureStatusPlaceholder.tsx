/**
 * @file src/shared/components/FeatureStatusPlaceholder.tsx
 * @description Reusable status and feedback placeholder screen component for features that are
 * in "Coming Soon", "Under Maintenance", "Study / Focus Mode", or "Restricted Access".
 *
 * Invariants:
 * - Adheres to Clean Architecture and Design System tokens via useAppTheme.
 * - Provides accessible visual hierarchy, status badge, feature highlights, and action CTAs.
 * - Supports seamless switching or navigation to active modules (e.g., Consultation).
 */

import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppTheme } from '../../app/theme/useAppTheme';
import { Badge, BadgeVariant } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import {
  HourglassComingSoonIcon,
  WrenchMaintenanceIcon,
  BookOpenStudyIcon,
  LockRestrictedIcon,
  CheckCircleIcon,
} from './icons/AyurvedicIcons';

export type FeatureStatusVariant =
  | 'coming_soon'
  | 'under_maintenance'
  | 'study_focus_mode'
  | 'access_restricted';

export interface FeatureStatusPlaceholderProps {
  /**
   * The visual mode/status to present.
   */
  variant: FeatureStatusVariant;
  /**
   * Name of the module/feature (e.g., "Amrutam Herb Store" or "Ayurvedic Health Records").
   */
  featureName: string;
  /**
   * Custom headline title (overrides default variant headline).
   */
  title?: string;
  /**
   * Custom descriptive text explaining current status or roadmap timeline.
   */
  description?: string;
  /**
   * Estimated release or maintenance completion tag (e.g., "Phase 4 Rollout", "Est. 2h").
   */
  estimatedRelease?: string;
  /**
   * Highlights or bullet points to showcase upcoming capabilities or maintenance activities.
   */
  highlights?: string[];
  /**
   * Primary CTA button title (default: "Switch to Consultation Module").
   */
  primaryActionTitle?: string;
  /**
   * Callback on primary CTA press. Defaults to navigating to the Consultation tab.
   */
  onPrimaryActionPress?: () => void;
  /**
   * Optional secondary action button title (e.g., "Preview Active UI", "Notify Me").
   */
  secondaryActionTitle?: string;
  /**
   * Callback on secondary action button press.
   */
  onSecondaryActionPress?: () => void;
  /**
   * Optional custom style override for the container.
   */
  style?: StyleProp<ViewStyle>;
}

interface VariantConfig {
  badgeLabel: string;
  badgeVariant: BadgeVariant;
  defaultTitle: string;
  defaultDescription: string;
  iconNode: (color: string) => React.ReactNode;
  iconBgColor: string;
  accentBorderColor: string;
}

export const FeatureStatusPlaceholder: React.FC<FeatureStatusPlaceholderProps> = ({
  variant,
  featureName,
  title,
  description,
  estimatedRelease,
  highlights,
  primaryActionTitle = 'Switch to Consultation Module',
  onPrimaryActionPress,
  secondaryActionTitle,
  onSecondaryActionPress,
  style,
}) => {
  const navigation = useNavigation<any>();
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();

  const getVariantConfig = (): VariantConfig => {
    switch (variant) {
      case 'coming_soon':
        return {
          badgeLabel: 'COMING SOON',
          badgeVariant: 'accent',
          defaultTitle: `${featureName} is on the Horizon`,
          defaultDescription:
            'We are crafting a classical Ayurvedic shopping experience with authentic herbs, classical formulations, and certified Vaidya recommendations.',
          iconNode: (color) => <HourglassComingSoonIcon size={36} color={color} />,
          iconBgColor: isDark ? '#3D2F1B' : '#FEF3E2',
          accentBorderColor: colors.accent,
        };
      case 'under_maintenance':
        return {
          badgeLabel: 'UNDER MAINTENANCE',
          badgeVariant: 'warning',
          defaultTitle: `${featureName} Maintenance in Progress`,
          defaultDescription:
            'We are upgrading the health records encryption vault and Prakriti timeline synchronization engine. Services will resume shortly.',
          iconNode: (color) => <WrenchMaintenanceIcon size={36} color={color} />,
          iconBgColor: isDark ? '#451A03' : '#FEF3C7',
          accentBorderColor: colors.warning,
        };
      case 'study_focus_mode':
        return {
          badgeLabel: 'AUDIT & FOCUS MODE',
          badgeVariant: 'primary',
          defaultTitle: 'Consultation Module Focus Active',
          defaultDescription:
            'Other modules are parked while you perform a deep-dive audit of the Consultation domain, application use cases, and virtualized doctor directory.',
          iconNode: (color) => <BookOpenStudyIcon size={36} color={color} />,
          iconBgColor: isDark ? '#1B4332' : '#E8F5E9',
          accentBorderColor: colors.primary,
        };
      case 'access_restricted':
      default:
        return {
          badgeLabel: 'RESTRICTED ACCESS',
          badgeVariant: 'error',
          defaultTitle: `${featureName} Requires Authorization`,
          defaultDescription:
            'Please complete your Vaidya or patient verification to access this Ayurvedic clinical workspace.',
          iconNode: (color) => <LockRestrictedIcon size={36} color={color} />,
          iconBgColor: isDark ? '#450A0A' : '#FEE2E2',
          accentBorderColor: colors.error,
        };
    }
  };

  const config = getVariantConfig();

  const handlePrimaryPress = () => {
    if (onPrimaryActionPress) {
      onPrimaryActionPress();
    } else {
      try {
        navigation.navigate('Consultations');
      } catch {
        // Fallback if tab name differs
      }
    }
  };

  const defaultHighlightsByVariant: Record<FeatureStatusVariant, string[]> = {
    coming_soon: [
      'Authentic Ayurvedic single herbs & Rasayanas',
      'Doctor-prescribed formulation carts',
      'Batch purity & laboratory certificate tracking',
    ],
    under_maintenance: [
      'AES-256 encrypted local record vault sync',
      'Multi-record Prakriti & dosha timeline indexing',
      'EHR PDF export & high-res report attachments',
    ],
    study_focus_mode: [
      'Pure Domain Entities: Doctor, Booking, Slot',
      'Use Cases: BookSlotUseCase, SlotConflictValidator',
      'Virtualized 5,000 doctor directory with FlashList',
    ],
    access_restricted: [
      'End-to-end encrypted medical consults',
      'HIPAA / ABDM compliant health locker access',
      'Verified classical practitioner network',
    ],
  };

  const displayHighlights = highlights || defaultHighlightsByVariant[variant];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, style]}>
      {/* Decorative Glow & Icon Container */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: config.iconBgColor,
            borderColor: config.accentBorderColor,
            borderRadius: borderRadius.round,
          },
        ]}
      >
        {config.iconNode(config.accentBorderColor)}
      </View>

      {/* Status Badge */}
      <Badge
        label={config.badgeLabel}
        variant={config.badgeVariant}
        size="md"
        style={{ marginTop: spacing.md, marginBottom: spacing.xs }}
      />

      {/* Main Headline */}
      <Text
        style={[
          typography.h2,
          {
            color: colors.text,
            textAlign: 'center',
            marginTop: spacing.xs,
            paddingHorizontal: spacing.md,
          },
        ]}
      >
        {title || config.defaultTitle}
      </Text>

      {/* Description */}
      <Text
        style={[
          typography.bodyMedium,
          {
            color: colors.textSecondary,
            textAlign: 'center',
            marginTop: spacing.sm,
            marginBottom: spacing.md,
            paddingHorizontal: spacing.lg,
            lineHeight: 22,
          },
        ]}
      >
        {description || config.defaultDescription}
      </Text>

      {/* Estimated Time / Tag if available */}
      {estimatedRelease ? (
        <View
          style={[
            styles.tagRow,
            {
              backgroundColor: isDark ? '#262626' : colors.secondary,
              borderColor: colors.border,
              borderRadius: borderRadius.md,
              paddingVertical: spacing.xs,
              paddingHorizontal: spacing.md,
              marginBottom: spacing.md,
            },
          ]}
        >
          <Text style={[typography.caption, { color: colors.primaryDark, fontWeight: '700' }]}>
            ⏳ Target: {estimatedRelease}
          </Text>
        </View>
      ) : null}

      {/* Feature Highlights Card */}
      {displayHighlights && displayHighlights.length > 0 ? (
        <Card variant="outlined" style={[styles.highlightsCard, { marginHorizontal: spacing.lg }]}>
          <Text
            style={[
              typography.caption,
              {
                color: colors.textMuted,
                fontWeight: '700',
                letterSpacing: 0.5,
                marginBottom: spacing.xs + 2,
              },
            ]}
          >
            {variant === 'under_maintenance'
              ? 'ACTIVE SYSTEM TASKS'
              : variant === 'study_focus_mode'
              ? 'ACTIVE STUDY TARGETS'
              : 'UPCOMING CAPABILITIES'}
          </Text>

          {displayHighlights.map((item, index) => (
            <View key={index} style={styles.highlightItem}>
              <CheckCircleIcon size={16} color={config.accentBorderColor} />
              <Text
                style={[
                  typography.bodySmall,
                  {
                    color: colors.text,
                    marginLeft: spacing.xs + 4,
                    flex: 1,
                  },
                ]}
              >
                {item}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}

      {/* Action Buttons */}
      <View style={[styles.buttonContainer, { marginTop: spacing.lg, paddingHorizontal: spacing.lg }]}>
        <Button
          title={primaryActionTitle}
          onPress={handlePrimaryPress}
          variant="primary"
          size="lg"
          style={styles.actionBtn}
        />

        {secondaryActionTitle && onSecondaryActionPress ? (
          <Button
            title={secondaryActionTitle}
            onPress={onSecondaryActionPress}
            variant="outline"
            size="md"
            style={[styles.actionBtn, { marginTop: spacing.sm }]}
          />
        ) : null}
      </View>
    </View>
  );
};

// Convenience component for Coming Soon views
export const ComingSoonView: React.FC<
  Omit<FeatureStatusPlaceholderProps, 'variant'> & { variant?: FeatureStatusVariant }
> = (props) => <FeatureStatusPlaceholder variant="coming_soon" {...props} />;

// Convenience component for Under Maintenance views
export const UnderMaintenanceView: React.FC<
  Omit<FeatureStatusPlaceholderProps, 'variant'> & { variant?: FeatureStatusVariant }
> = (props) => <FeatureStatusPlaceholder variant="under_maintenance" {...props} />;

// Convenience component for Study Focus Mode views
export const StudyFocusModeView: React.FC<
  Omit<FeatureStatusPlaceholderProps, 'variant'> & { variant?: FeatureStatusVariant }
> = (props) => <FeatureStatusPlaceholder variant="study_focus_mode" {...props} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tagRow: {
    borderWidth: 1,
  },
  highlightsCard: {
    width: '90%',
    padding: 16,
    marginVertical: 4,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    width: '100%',
  },
  actionBtn: {
    width: '100%',
  },
});
