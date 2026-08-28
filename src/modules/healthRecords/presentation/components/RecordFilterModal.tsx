/**
 * @file src/modules/healthRecords/presentation/components/RecordFilterModal.tsx
 * @description Bottom-sheet modal for multi-criteria health record filtering.
 *
 * Invariants:
 * - Allows multi-selection of Record Types and Ayurvedic medical tags.
 * - Synchronizes with Redux state upon applying and supports clean resets.
 */

import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { RecordType } from '../../../../core/domain/healthRecords/RecordType';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { Button } from '../../../../shared/components/Button';
import { CloseIcon, FilterIcon, TagIcon } from '../../../../shared/components/icons/AyurvedicIcons';

export interface RecordFilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedType: RecordType | 'ALL';
  selectedTag: string;
  tags: string[];
  onApplyFilters: (type: RecordType | 'ALL', tag: string) => void;
  onResetFilters: () => void;
}

export const RecordFilterModal: React.FC<RecordFilterModalProps> = ({
  visible,
  onClose,
  selectedType,
  selectedTag,
  tags,
  onApplyFilters,
  onResetFilters,
}) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const [tempType, setTempType] = useState<RecordType | 'ALL'>(selectedType);
  const [tempTag, setTempTag] = useState<string>(selectedTag);

  React.useEffect(() => {
    if (visible) {
      setTempType(selectedType);
      setTempTag(selectedTag);
    }
  }, [visible, selectedType, selectedTag]);

  const typeOptions: { key: RecordType | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'All Records' },
    { key: RecordType.PRESCRIPTION, label: 'Prescriptions' },
    { key: RecordType.LAB_REPORT, label: 'Lab Reports' },
    { key: RecordType.CONSULTATION, label: 'Consultations' },
    { key: RecordType.VACCINATION, label: 'Vaccinations' },
    { key: RecordType.ALLERGY, label: 'Allergies & Sensitivities' },
  ];

  const handleApply = () => {
    onApplyFilters(tempType, tempTag);
    onClose();
  };

  const handleReset = () => {
    setTempType('ALL');
    setTempTag('All Tags');
    onResetFilters();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalSheet, { backgroundColor: colors.card, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl }]}>
              {/* Header */}
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View style={styles.headerTitleRow}>
                  <FilterIcon size={20} color={colors.primary} />
                  <Text style={[typography.h3, { color: colors.text, marginLeft: spacing.xs }]}>
                    Filter Health Records
                  </Text>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={onClose} style={styles.closeBtn}>
                  <CloseIcon size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
                {/* Record Type Section */}
                <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginBottom: spacing.sm }]}>
                  Record Category
                </Text>
                <View style={styles.chipsContainer}>
                  {typeOptions.map((opt) => {
                    const isSelected = tempType === opt.key;
                    return (
                      <TouchableOpacity
                        key={opt.key}
                        activeOpacity={0.7}
                        onPress={() => setTempType(opt.key)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isSelected ? colors.primary : colors.background,
                            borderColor: isSelected ? colors.primary : colors.border,
                            borderRadius: borderRadius.md,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.chipText,
                            {
                              color: isSelected ? '#FFFFFF' : colors.textSecondary,
                              fontWeight: isSelected ? '700' : '500',
                            },
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Tags Section */}
                <Text
                  style={[
                    typography.bodyMedium,
                    { color: colors.text, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
                  ]}
                >
                  Ayurvedic Clinical Tag
                </Text>
                <View style={styles.chipsContainer}>
                  {tags.map((tag) => {
                    const isSelected = tempTag === tag;
                    return (
                      <TouchableOpacity
                        key={tag}
                        activeOpacity={0.7}
                        onPress={() => setTempTag(tag)}
                        style={[
                          styles.chip,
                          {
                            backgroundColor: isSelected ? colors.accent : colors.background,
                            borderColor: isSelected ? colors.accent : colors.border,
                            borderRadius: borderRadius.md,
                          },
                        ]}
                      >
                        <TagIcon size={12} color={isSelected ? '#FFFFFF' : colors.textMuted} />
                        <Text
                          style={[
                            styles.chipText,
                            {
                              color: isSelected ? '#FFFFFF' : colors.textSecondary,
                              fontWeight: isSelected ? '700' : '500',
                              marginLeft: 4,
                            },
                          ]}
                        >
                          {tag}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              {/* Footer Actions */}
              <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
                <Button
                  title="Reset"
                  variant="outline"
                  onPress={handleReset}
                  style={styles.actionBtn}
                />
                <Button
                  title="Apply Filters"
                  variant="primary"
                  onPress={handleApply}
                  style={styles.actionBtn}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '80%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    padding: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
  },
});
