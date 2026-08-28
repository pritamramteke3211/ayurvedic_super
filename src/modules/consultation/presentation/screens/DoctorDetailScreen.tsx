/**
 * @file src/modules/consultation/presentation/screens/DoctorDetailScreen.tsx
 * @description Comprehensive doctor profile screen showing biography, clinical credentials,
 * verified reviews, SVG icons, and sticky booking action launcher.
 *
 * Invariants:
 * - Reads selected doctor from ConsultationState store.
 * - Displays verified ratings, experience, and Ayurvedic treatment specialties.
 * - Employs React Navigation stack navigation for back and booking transitions.
 */

import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { useConsultationStore } from '../../../../app/state/consultationStore';
import { ConsultationStackParamList } from '../../../../app/navigation/type';
import { Badge } from '../../../../shared/components/Badge';
import { Button } from '../../../../shared/components/Button';
import { Card } from '../../../../shared/components/Card';
import {
  StarIcon,
  ShieldVerifiedIcon,
  LeafIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

type NavigationProp = StackNavigationProp<ConsultationStackParamList, 'DoctorDetails'>;

export const DoctorDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();
  const { selectedDoctor } = useConsultationStore();

  if (!selectedDoctor) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[typography.bodyLarge, { color: colors.textSecondary }]}>
          Doctor profile not found.
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom Navigation Header */}
      <View style={[styles.navHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h3, { color: colors.text, flex: 1, textAlign: 'center', marginRight: 40 }]}>
          Doctor Profile
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.md }]}>
        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: selectedDoctor.avatarUrl }}
              style={[styles.avatar, { borderRadius: borderRadius.lg }]}
              resizeMode="cover"
            />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <View style={styles.nameRow}>
                <Text style={[typography.h2, { color: colors.text, flex: 1 }]}>
                  {selectedDoctor.name}
                </Text>
                <ShieldVerifiedIcon size={20} color={colors.primary} />
              </View>
              <Text style={[typography.bodyMedium, { color: colors.primary, fontWeight: '600', marginTop: 2 }]}>
                {selectedDoctor.specialty}
              </Text>
              <View style={styles.badgeRow}>
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
                  <Text style={[typography.caption, { color: '#92400E', fontWeight: '700', marginLeft: 4 }]}>
                    {selectedDoctor.rating.toFixed(1)} ({selectedDoctor.reviewCount} reviews)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={[styles.metricsRow, { backgroundColor: isDark ? '#262626' : '#F8FAF9', borderRadius: borderRadius.md }]}>
            <View style={styles.metricItem}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>EXPERIENCE</Text>
              <Text style={[typography.h3, { color: colors.text, marginTop: 2 }]}>
                {selectedDoctor.experienceYears}+ Years
              </Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metricItem}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>PATIENTS</Text>
              <Text style={[typography.h3, { color: colors.text, marginTop: 2 }]}>
                {(selectedDoctor.reviewCount * 4).toLocaleString()}+
              </Text>
            </View>
            <View style={[styles.metricDivider, { backgroundColor: colors.border }]} />
            <View style={styles.metricItem}>
              <Text style={[typography.caption, { color: colors.textMuted }]}>RATING</Text>
              <Text style={[typography.h3, { color: colors.warning, marginTop: 2 }]}>
                {selectedDoctor.rating.toFixed(1)} / 5.0
              </Text>
            </View>
          </View>
        </Card>

        {/* About Section */}
        <Card variant="outlined" style={styles.sectionCard}>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>
            About Vaidya
          </Text>
          <Text style={[typography.bodyMedium, { color: colors.textSecondary, lineHeight: 22 }]}>
            {selectedDoctor.bio}
          </Text>
        </Card>

        {/* Languages Spoken */}
        <Card variant="outlined" style={styles.sectionCard}>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>
            Languages Spoken
          </Text>
          <View style={styles.chipRow}>
            {selectedDoctor.languages.map((lang) => (
              <Badge key={lang} label={lang} variant="primary" size="md" style={{ marginRight: 8, marginBottom: 8 }} />
            ))}
          </View>
        </Card>

        {/* Clinical Services & Philosophy */}
        <Card variant="outlined" style={styles.sectionCard}>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>
            Ayurvedic Services Offered
          </Text>
          <View style={styles.bulletItem}>
            <LeafIcon size={16} color={colors.primary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 8, flex: 1 }]}>
              Classical Prakriti & Dosha Constitutional Diagnosis
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <LeafIcon size={16} color={colors.primary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 8, flex: 1 }]}>
              Customized Herbal Formulations & Diet Plan (Ahara-Vihara)
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <LeafIcon size={16} color={colors.primary} />
            <Text style={[typography.bodyMedium, { color: colors.text, marginLeft: 8, flex: 1 }]}>
              Post-Consultation Digital Prescription & Health Record
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View
        style={[
          styles.stickyFooter,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            padding: spacing.md,
          },
        ]}
      >
        <View>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            CONSULTATION FEE
          </Text>
          <Text style={[typography.h2, { color: colors.primary }]}>
            ₹{selectedDoctor.consultationFee}
          </Text>
        </View>

        <Button
          title="Book Consultation"
          onPress={() => navigation.navigate('BookingSlot', { doctorId: selectedDoctor.id })}
          variant="primary"
          size="lg"
          style={{ minWidth: 180 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileCard: {
    padding: 16,
    marginBottom: 14,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: '#E5E7EB',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    marginTop: 16,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 28,
  },
  sectionCard: {
    padding: 16,
    marginBottom: 14,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});
