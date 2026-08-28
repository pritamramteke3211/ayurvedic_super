/**
 * @file src/modules/consultation/presentation/components/SlotPicker.tsx
 * @description Multi-day calendar selector and categorized slot picker (Morning / Afternoon / Evening).
 *
 * Invariants:
 * - Prevents selecting already-booked slots.
 * - Categorizes slots into clear time windows.
 */

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Slot } from '../../../../core/domain/consultation/Slot';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { Skeleton } from '../../../../shared/components/Skeleton';
import {
  CalendarSlotIcon,
  ClockTimeIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

interface SlotPickerProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (dateStr: string) => void;
  slots: Slot[];
  isLoadingSlots: boolean;
  selectedSlot: Slot | null;
  onSelectSlot: (slot: Slot) => void;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  selectedDate,
  onDateChange,
  slots,
  isLoadingSlots,
  selectedSlot,
  onSelectSlot,
}) => {
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();

  // Generate next 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const isoDate = d.toISOString().split('T')[0];
    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });

    return { isoDate, dayName, dayNumber, monthName };
  });

  const formatSlotTime = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return isoString;
    }
  };

  // Group slots into Morning (< 12:00), Afternoon (12:00 - 17:00), Evening (>= 17:00)
  const morningSlots = slots.filter((s) => {
    const hour = new Date(s.startTime).getUTCHours();
    return hour < 12;
  });

  const afternoonSlots = slots.filter((s) => {
    const hour = new Date(s.startTime).getUTCHours();
    return hour >= 12 && hour < 17;
  });

  const eveningSlots = slots.filter((s) => {
    const hour = new Date(s.startTime).getUTCHours();
    return hour >= 17;
  });

  const renderSlotGroup = (title: string, icon: string, groupSlots: Slot[]) => {
    if (groupSlots.length === 0) return null;

    return (
      <View style={styles.groupContainer}>
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginBottom: spacing.sm }]}>
          {icon} {title}
        </Text>
        <View style={styles.slotsGrid}>
          {groupSlots.map((slot) => {
            const isSelected = selectedSlot?.id === slot.id;
            const isBooked = slot.isBooked;

            let bgColor = colors.card;
            let borderColor = colors.border;
            let textColor = colors.text;

            if (isSelected) {
              bgColor = colors.primary;
              borderColor = colors.primary;
              textColor = '#FFFFFF';
            } else if (isBooked) {
              bgColor = isDark ? '#262626' : '#F3F4F6';
              borderColor = isDark ? '#333333' : '#E5E7EB';
              textColor = colors.textMuted;
            }

            return (
              <TouchableOpacity
                key={slot.id}
                activeOpacity={0.8}
                disabled={isBooked}
                onPress={() => onSelectSlot(slot)}
                style={[
                  styles.slotChip,
                  {
                    backgroundColor: bgColor,
                    borderColor,
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.sm + 2,
                    marginBottom: spacing.sm,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.slotTimeText,
                    {
                      color: textColor,
                      fontWeight: isSelected ? '700' : '500',
                      textDecorationLine: isBooked ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {formatSlotTime(slot.startTime)}
                </Text>
                {isBooked ? (
                  <Text style={[styles.bookedSubtext, { color: colors.textMuted }]}>
                    Booked
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Date Selector Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <CalendarSlotIcon size={18} color={colors.primary} />
        <Text style={[typography.h3, { color: colors.text, marginLeft: 8 }]}>
          Select Consultation Date
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.dateScroll, { marginBottom: spacing.md }]}
      >
        {dateOptions.map((opt) => {
          const isSelected = selectedDate === opt.isoDate;

          return (
            <TouchableOpacity
              key={opt.isoDate}
              activeOpacity={0.8}
              onPress={() => onDateChange(opt.isoDate)}
              style={[
                styles.dateCard,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderRadius: borderRadius.md,
                  paddingVertical: spacing.sm + 2,
                  paddingHorizontal: spacing.md,
                  marginRight: spacing.sm,
                },
              ]}
            >
              <Text
                style={[
                  styles.dayName,
                  { color: isSelected ? '#D8F3DC' : colors.textSecondary },
                ]}
              >
                {opt.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  { color: isSelected ? '#FFFFFF' : colors.text },
                ]}
              >
                {opt.dayNumber}
              </Text>
              <Text
                style={[
                  styles.monthName,
                  { color: isSelected ? '#D8F3DC' : colors.textMuted },
                ]}
              >
                {opt.monthName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Slots Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
        <ClockTimeIcon size={18} color={colors.primary} />
        <Text style={[typography.h3, { color: colors.text, marginLeft: 8 }]}>
          Available Time Slots
        </Text>
      </View>

      {isLoadingSlots ? (
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              width="31%"
              height={44}
              borderRadius={borderRadius.md}
              style={{ marginBottom: spacing.sm }}
            />
          ))}
        </View>
      ) : (
        <View>
          {renderSlotGroup('Morning (09:00 AM – 12:00 PM)', '🌅', morningSlots)}
          {renderSlotGroup('Afternoon (02:00 PM – 05:00 PM)', '☀️', afternoonSlots)}
          {renderSlotGroup('Evening (06:00 PM – 08:30 PM)', '🌙', eveningSlots)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  dateScroll: {
    paddingVertical: 4,
  },
  dateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dayName: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  monthName: {
    fontSize: 10,
    marginTop: 2,
  },
  groupContainer: {
    marginBottom: 16,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  slotChip: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  slotTimeText: {
    fontSize: 12,
  },
  bookedSubtext: {
    fontSize: 9,
    marginTop: 1,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
