/**
 * @file src/shared/components/Skeleton.tsx
 * @description State 1 (Loading) shimmer placeholder components with native-driver looping animation.
 *
 * Invariants:
 * - Executes looping opacity animation (0.35 to 0.8) on native thread via useNativeDriver: true.
 * - Adapts shimmer base colors for dark and light themes.
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '../../app/theme/useAppTheme';

export interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius: radius,
  style,
}) => {
  const { borderRadius: defaultRadius, isDark } = useAppTheme();
  const opacityAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    return () => pulseLoop.stop();
  }, [opacityAnim]);

  const baseColor = isDark ? '#2D2D2D' : '#E5E7EB';

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius !== undefined ? radius : defaultRadius.sm,
          backgroundColor: baseColor,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

/**
 * Pre-composed loading card placeholder for Doctor items.
 */
export const DoctorCardSkeleton: React.FC = () => {
  const { colors, spacing, borderRadius, isDark } = useAppTheme();

  return (
    <View
      style={[
        styles.doctorCardSkeleton,
        {
          backgroundColor: colors.card,
          borderRadius: borderRadius.lg,
          borderColor: isDark ? colors.border : '#F1F5F2',
          padding: spacing.md,
          marginBottom: spacing.md,
        },
      ]}
    >
      <View style={styles.headerRow}>
        {/* Avatar Placeholder */}
        <Skeleton width={64} height={64} borderRadius={borderRadius.md} />

        {/* Info Column */}
        <View style={[styles.infoCol, { marginLeft: spacing.md }]}>
          <Skeleton width="75%" height={18} borderRadius={4} />
          <View style={{ height: 8 }} />
          <Skeleton width="50%" height={14} borderRadius={4} />
          <View style={{ height: 8 }} />
          <Skeleton width="40%" height={12} borderRadius={4} />
        </View>
      </View>

      <View style={{ height: spacing.md }} />
      <Skeleton width="100%" height={32} borderRadius={borderRadius.sm} />

      <View style={{ height: spacing.md }} />
      <View style={styles.footerRow}>
        <Skeleton width="30%" height={20} borderRadius={4} />
        <Skeleton width="40%" height={36} borderRadius={borderRadius.md} />
      </View>
    </View>
  );
};

/**
 * Pre-composed loading placeholder for appointment slots.
 */
export const SlotGridSkeleton: React.FC = () => {
  const { spacing } = useAppTheme();

  return (
    <View style={styles.slotGridContainer}>
      <Skeleton width="35%" height={18} borderRadius={4} style={{ marginBottom: spacing.sm }} />
      <View style={styles.slotChipsRow}>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <Skeleton
            key={key}
            width="30%"
            height={42}
            borderRadius={8}
            style={{ marginBottom: spacing.sm }}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  doctorCardSkeleton: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotGridContainer: {
    marginVertical: 12,
  },
  slotChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
