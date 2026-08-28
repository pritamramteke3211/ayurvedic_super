/**
 * @file src/modules/healthRecords/presentation/components/RecordCard.tsx
 * @description High-performance memoized timeline record card for FlashList.
 *
 * Invariants:
 * - Employs React.memo with strict shallow comparison for 60 FPS scrolling across 10,000 items.
 * - Distinct color-coded badge & icon for each RecordType (Prescription, Lab Report, Consultation, Vaccination, Allergy).
 * - Displays timeline visual connector, doctor details, tags, and attachment count indicator.
 */

import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HealthRecordProps } from '../../../../core/domain/healthRecords/HealthRecord';
import { RecordType } from '../../../../core/domain/healthRecords/RecordType';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import {
  PillMedicineIcon,
  FlaskLabIcon,
  LeafIcon,
  SyringeIcon,
  AlertCircleIcon,
  PdfFileIcon,
  ChevronRightIcon,
  TagIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

export interface RecordCardProps {
  record: HealthRecordProps;
  onPress: (record: HealthRecordProps) => void;
  isLastInGroup?: boolean;
}

export const RecordCard: React.FC<RecordCardProps> = React.memo(({ record, onPress, isLastInGroup = false }) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  // Color mapping based on RecordType
  const getTypeConfig = (type: RecordType) => {
    switch (type) {
      case RecordType.PRESCRIPTION:
        return {
          label: 'Prescription',
          color: '#2D6A4F',
          bg: '#E8F5E9',
          darkBg: '#1B4332',
          icon: <PillMedicineIcon size={14} color="#2D6A4F" />,
        };
      case RecordType.LAB_REPORT:
        return {
          label: 'Lab Report',
          color: '#0077B6',
          bg: '#E0F2FE',
          darkBg: '#03045E',
          icon: <FlaskLabIcon size={14} color="#0077B6" />,
        };
      case RecordType.CONSULTATION:
        return {
          label: 'Consultation',
          color: '#7209B7',
          bg: '#F3E8FF',
          darkBg: '#3A0CA3',
          icon: <LeafIcon size={14} color="#7209B7" />,
        };
      case RecordType.VACCINATION:
        return {
          label: 'Immunization',
          color: '#D97706',
          bg: '#FEF3C7',
          darkBg: '#78350F',
          icon: <SyringeIcon size={14} color="#D97706" />,
        };
      case RecordType.ALLERGY:
        return {
          label: 'Allergy / Sensitivity',
          color: '#E63946',
          bg: '#FFE5E8',
          darkBg: '#660708',
          icon: <AlertCircleIcon size={14} color="#E63946" />,
        };
    }
  };

  const typeConfig = getTypeConfig(record.type);

  // Format date: "28 Aug 2026"
  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(record.date);
      return d.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return record.date;
    }
  }, [record.date]);

  return (
    <View style={styles.outerRow}>
      {/* Timeline spine and node */}
      <View style={styles.spineContainer}>
        <View style={[styles.timelineNode, { borderColor: typeConfig.color, backgroundColor: colors.card }]}>
          <View style={[styles.timelineInnerDot, { backgroundColor: typeConfig.color }]} />
        </View>
        {!isLastInGroup && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
      </View>

      {/* Main Card Content */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(record)}
        style={[
          styles.cardContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            marginBottom: spacing.md,
          },
        ]}
      >
        {/* Top Row: Type Badge + Date */}
        <View style={styles.topRow}>
          <View style={[styles.typeBadge, { backgroundColor: typeConfig.bg }]}>
            {typeConfig.icon}
            <Text style={[styles.typeBadgeText, { color: typeConfig.color, marginLeft: 4 }]}>
              {typeConfig.label}
            </Text>
          </View>
          <Text style={[typography.caption, { color: colors.textMuted }]}>{formattedDate}</Text>
        </View>

        {/* Title */}
        <Text style={[typography.h3, { color: colors.text, marginTop: spacing.xs }]} numberOfLines={2}>
          {record.title}
        </Text>

        {/* Doctor & Facility */}
        {(record.doctorName || record.facility) && (
          <Text
            style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}
            numberOfLines={1}
          >
            {record.doctorName ? `${record.doctorName} • ` : ''}
            {record.facility}
          </Text>
        )}

        {/* Notes preview if available */}
        {record.notes && (
          <Text
            style={[typography.caption, { color: colors.textMuted, marginTop: spacing.xs, fontStyle: 'italic' }]}
            numberOfLines={2}
          >
            "{record.notes}"
          </Text>
        )}

        {/* Bottom Row: Tags + Attachments indicator */}
        <View style={[styles.bottomRow, { marginTop: spacing.sm }]}>
          <View style={styles.tagsContainer}>
            {record.tags.slice(0, 2).map((tag, idx) => (
              <View
                key={`${record.id}-tag-${idx}`}
                style={[styles.tagChip, { backgroundColor: colors.background, borderColor: colors.border }]}
              >
                <TagIcon size={10} color={colors.primary} />
                <Text style={[styles.tagText, { color: colors.textSecondary, marginLeft: 3 }]}>
                  {tag}
                </Text>
              </View>
            ))}
            {record.tags.length > 2 && (
              <Text style={[styles.moreTagsText, { color: colors.textMuted }]}>
                +{record.tags.length - 2}
              </Text>
            )}
          </View>

          {/* Attachments indicator */}
          {record.attachments && record.attachments.length > 0 ? (
            <View style={styles.attachmentRow}>
              {record.attachments.find((a) => a.thumbnailUrl)?.thumbnailUrl && (
                <Image
                  source={{ uri: record.attachments.find((a) => a.thumbnailUrl)?.thumbnailUrl }}
                  style={[styles.miniThumbnail, { borderRadius: borderRadius.sm }]}
                />
              )}
              <View style={[styles.attachmentBadge, { backgroundColor: colors.primary + '12' }]}>
                <PdfFileIcon size={12} color={colors.primary} />
                <Text style={[styles.attachmentText, { color: colors.primary, marginLeft: 3 }]}>
                  {record.attachments.length} {record.attachments.length === 1 ? 'doc' : 'docs'}
                </Text>
              </View>
            </View>
          ) : (
            <ChevronRightIcon size={16} color={colors.textMuted} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  outerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingHorizontal: 16,
  },
  spineContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 10,
  },
  timelineNode: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    zIndex: 2,
  },
  timelineInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
    zIndex: 1,
  },
  cardContainer: {
    flex: 1,
    borderWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 0.8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniThumbnail: {
    width: 24,
    height: 24,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  attachmentText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
