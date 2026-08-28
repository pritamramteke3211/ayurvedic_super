/**
 * @file src/modules/consultation/presentation/components/DoctorCard.tsx
 * @description High-performance, memoized Doctor card tile with native-driver spring feedback and SVG icons.
 *
 * Invariants:
 * - Uses React.memo with prop comparison for smooth 60–120 FPS scrolling.
 * - Uses React Native Animated with useNativeDriver: true for 60 FPS UI-thread touch feedback.
 * - Renders doctor photo, specialty badge, SVG rating, fee, and booking CTA.
 */

import React, { useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Doctor } from '../../../../core/domain/consultation/Doctor';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { Button } from '../../../../shared/components/Button';
import {
  StarIcon,
  ShieldVerifiedIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

interface DoctorCardProps {
  doctor: Doctor;
  onPress: (doctor: Doctor) => void;
  onBookPress: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = React.memo(
  ({ doctor, onPress, onBookPress }) => {
    const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }).start();
    };

    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={() => onPress(doctor)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={[
            styles.container,
            {
              backgroundColor: colors.card,
              borderRadius: borderRadius.lg,
              borderColor: isDark ? colors.border : '#EBF0EC',
              padding: spacing.md,
              marginBottom: spacing.md,
            },
          ]}
        >
          {/* Top Section: Avatar + Name + Rating */}
          <View style={styles.headerRow}>
            <Image
              source={{ uri: doctor.avatarUrl }}
              style={[styles.avatar, { borderRadius: borderRadius.md }]}
              resizeMode="cover"
            />

            <View style={[styles.headerInfo, { marginLeft: spacing.md }]}>
              <View style={styles.titleRow}>
                <Text
                  style={[typography.h3, { color: colors.text, flex: 1 }]}
                  numberOfLines={1}
                >
                  {doctor.name}
                </Text>
                <ShieldVerifiedIcon size={18} color={colors.primary} />
              </View>

              <Text
                style={[
                  typography.bodySmall,
                  { color: colors.primary, fontWeight: '600', marginTop: 2 },
                ]}
                numberOfLines={1}
              >
                {doctor.specialty}
              </Text>

              <View style={styles.statsRow}>
                <View
                  style={[
                    styles.ratingBadge,
                    {
                      backgroundColor: isDark ? '#3D311A' : '#FEF3C7',
                      borderRadius: borderRadius.sm,
                      paddingHorizontal: spacing.xs + 2,
                      paddingVertical: 2,
                    },
                  ]}
                >
                  <StarIcon size={12} color="#D97706" />
                  <Text
                    style={[
                      typography.caption,
                      { color: '#92400E', fontWeight: '700', marginLeft: 4 },
                    ]}
                  >
                    {doctor.rating.toFixed(1)} ({doctor.reviewCount})
                  </Text>
                </View>

                <Text
                  style={[
                    typography.bodySmall,
                    { color: colors.textSecondary, marginLeft: spacing.sm },
                  ]}
                >
                  • {doctor.experienceYears} yrs exp
                </Text>
              </View>
            </View>
          </View>

          {/* Bio preview */}
          <Text
            style={[
              typography.bodySmall,
              { color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 18 },
            ]}
            numberOfLines={2}
          >
            {doctor.bio}
          </Text>

          {/* Divider */}
          <View
            style={[
              styles.divider,
              { backgroundColor: isDark ? colors.border : '#F3F4F6', marginVertical: spacing.sm },
            ]}
          />

          {/* Footer: Fee & Book CTA */}
          <View style={styles.footerRow}>
            <View>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                Consultation Fee
              </Text>
              <Text style={[typography.h3, { color: colors.primary }]}>
                ₹{doctor.consultationFee}
              </Text>
            </View>

            <Button
              title="Book Session"
              onPress={() => onBookPress(doctor)}
              variant="primary"
              size="sm"
            />
          </View>
        </Pressable>
      </Animated.View>
    );
  },
  (prev, next) => prev.doctor.id === next.doctor.id,
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    backgroundColor: '#E5E7EB',
  },
  headerInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
