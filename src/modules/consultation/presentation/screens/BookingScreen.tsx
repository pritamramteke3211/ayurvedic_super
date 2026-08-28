/**
 * @file src/modules/consultation/presentation/screens/BookingScreen.tsx
 * @description Slot selection and appointment confirmation screen with SVG icons and MMKV sync.
 *
 * Invariants:
 * - Prevents booking submission without a valid slot and patient name.
 * - Executes domain SlotConflictValidator before confirming and persists booking into MMKV.
 * - Employs React Navigation to navigate back or proceed to MyBookings on success.
 */

import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import {
  consultationActions,
  useConsultationStore,
} from '../../../../app/state/consultationStore';
import { ConsultationStackParamList } from '../../../../app/navigation/type';
import { SlotPicker } from '../components/SlotPicker';
import { Button } from '../../../../shared/components/Button';
import { Card } from '../../../../shared/components/Card';
import { Toast } from '../../../../shared/components/Toast';
import {
  CalendarSlotIcon,
  ClockTimeIcon,
  LeafIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

type NavigationProp = StackNavigationProp<ConsultationStackParamList, 'BookingSlot'>;

export const BookingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();
  const store = useConsultationStore();
  const [patientName, setPatientName] = useState('Pritam Ramteke');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedDoctor = store.selectedDoctor;

  const handleConfirmBooking = async () => {
    if (!store.selectedSlot) {
      Alert.alert('Slot Required', 'Please choose an available appointment time slot.');
      return;
    }

    if (!patientName.trim()) {
      Alert.alert('Patient Name Required', 'Please enter the patient name.');
      return;
    }

    const booking = await consultationActions.bookAppointment(patientName.trim());

    if (booking) {
      setToastMessage('🌿 Consultation successfully confirmed!');
      setTimeout(() => {
        navigation.navigate('MyBookings');
      }, 1200);
    }
  };

  if (!selectedDoctor) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[typography.bodyLarge, { color: colors.textSecondary }]}>
          Please select a doctor to book an appointment.
        </Text>
        <Button
          title="Return to Doctors"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={{ marginTop: 16 }}
        />
      </View>
    );
  }

  const formatSlotLabel = (isoString?: string) => {
    if (!isoString) return 'None Selected';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Navigation Header */}
      <View style={[styles.navHeader, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '700' }}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.h3, { color: colors.text, flex: 1, textAlign: 'center', marginRight: 40 }]}>
          Book Consultation
        </Text>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.md }]}>
        {/* Doctor Summary Header */}
        <Card variant="elevated" style={styles.doctorSummaryCard}>
          <Text style={[typography.h3, { color: colors.text }]}>
            {selectedDoctor.name}
          </Text>
          <Text style={[typography.bodySmall, { color: colors.primary, fontWeight: '600', marginTop: 2 }]}>
            {selectedDoctor.specialty} • {selectedDoctor.experienceYears} yrs experience
          </Text>
          <View style={styles.clinicRow}>
            <LeafIcon size={14} color={colors.primary} />
            <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 6 }]}>
              Classical Ayurvedic Clinic & Online Tele-Consultation
            </Text>
          </View>
        </Card>

        {/* Slot Picker Component */}
        <SlotPicker
          selectedDate={store.selectedDate}
          onDateChange={(date) => consultationActions.changeDate(date)}
          slots={store.slots}
          isLoadingSlots={store.isLoadingSlots}
          selectedSlot={store.selectedSlot}
          onSelectSlot={(slot) => consultationActions.selectSlot(slot)}
        />

        {/* Patient Details Input */}
        <Card variant="outlined" style={styles.formCard}>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>
            Patient Details
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginBottom: 6 }]}>
            Full Name
          </Text>
          <TextInput
            placeholder="Enter patient full name"
            placeholderTextColor={colors.textMuted}
            value={patientName}
            onChangeText={setPatientName}
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#262626' : '#FFFFFF',
                borderColor: colors.border,
                color: colors.text,
                borderRadius: borderRadius.md,
                padding: spacing.md,
              },
            ]}
          />
        </Card>

        {/* Price & Summary Breakdown */}
        <Card variant="outlined" style={styles.summaryCard}>
          <Text style={[typography.h3, { color: colors.text, marginBottom: spacing.sm }]}>
            Payment Summary
          </Text>
          <View style={styles.summaryRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ClockTimeIcon size={14} color={colors.textMuted} />
              <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginLeft: 6 }]}>
                Selected Slot
              </Text>
            </View>
            <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '600' }]}>
              {store.selectedSlot ? formatSlotLabel(store.selectedSlot.startTime) : 'Select a slot'}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CalendarSlotIcon size={14} color={colors.textMuted} />
              <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginLeft: 6 }]}>
                Date
              </Text>
            </View>
            <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '600' }]}>
              {store.selectedDate}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
              Consultation Fee
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '600' }]}>
              ₹{selectedDoctor.consultationFee}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
              Ayurvedic Health Care GST (0%)
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.success, fontWeight: '600' }]}>
              ₹0 (Free)
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: spacing.sm }]} />
          <View style={styles.summaryRow}>
            <Text style={[typography.h3, { color: colors.text }]}>Total Amount</Text>
            <Text style={[typography.h3, { color: colors.primary }]}>
              ₹{selectedDoctor.consultationFee}
            </Text>
          </View>
        </Card>

        {/* Error Alert if domain validation rejected booking */}
        {store.bookingError ? (
          <View style={[styles.errorBox, { backgroundColor: colors.error + '1A', borderColor: colors.error }]}>
            <Text style={{ color: colors.error, fontWeight: '600', fontSize: 13 }}>
              ⚠️ {store.bookingError}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Sticky Bottom Action */}
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
            TOTAL PAYABLE
          </Text>
          <Text style={[typography.h2, { color: colors.primary }]}>
            ₹{selectedDoctor.consultationFee}
          </Text>
        </View>

        <Button
          title={store.isBookingInProgress ? 'Confirming...' : 'Confirm Appointment'}
          onPress={handleConfirmBooking}
          variant="primary"
          size="lg"
          disabled={store.isBookingInProgress || !store.selectedSlot}
          style={{ minWidth: 200 }}
        />
      </View>

      <Toast
        visible={!!toastMessage}
        message={toastMessage || ''}
        type="success"
        onDismiss={() => setToastMessage(null)}
      />
    </KeyboardAvoidingView>
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
    paddingBottom: 110,
  },
  doctorSummaryCard: {
    padding: 16,
    marginBottom: 14,
  },
  clinicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  formCard: {
    padding: 16,
    marginBottom: 14,
  },
  input: {
    borderWidth: 1,
    fontSize: 15,
  },
  summaryCard: {
    padding: 16,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  divider: {
    height: 1,
  },
  errorBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
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
