/**
 * @file src/modules/healthRecords/presentation/screens/AddRecordScreen.tsx
 * @description Form screen allowing patients to upload and log new Ayurvedic health records.
 *
 * Invariants:
 * - Validates input fields and title constraints before dispatching AddHealthRecordUseCase.
 * - Supports dynamic RecordType selection, medical tag toggling, and diagnostic attachment simulation.
 * - Automatically persists to MMKV and enqueues to offline syncQueue.
 */

import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../app/state/hooks';
import { addHealthRecordThunk } from '../../../../app/state/healthRecordsSlice';
import { RecordType, Attachment } from '../../../../core/domain/healthRecords/RecordType';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { AddRecordScreenProps } from '../../../../app/navigation/type';
import { AVAILABLE_RECORD_TAGS } from '../../../../infrastructure/mock/healthRecordsMockData';
import { Button } from '../../../../shared/components/Button';
import {
  ArrowLeftIcon,
  PdfFileIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

export const AddRecordScreen: React.FC<AddRecordScreenProps> = ({ navigation }) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const dispatch = useAppDispatch();
  const { isAddingRecord, addRecordError } = useAppSelector((state) => state.healthRecords);

  const [title, setTitle] = useState('');
  const [selectedType, setSelectedType] = useState<RecordType>(RecordType.PRESCRIPTION);
  const [doctorName, setDoctorName] = useState('');
  const [facility, setFacility] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Panchakarma', 'Ayurveda']);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [titleError, setTitleError] = useState<string | null>(null);

  const typeOptions = [
    { type: RecordType.PRESCRIPTION, label: 'Prescription' },
    { type: RecordType.LAB_REPORT, label: 'Lab Report' },
    { type: RecordType.CONSULTATION, label: 'Consultation' },
    { type: RecordType.VACCINATION, label: 'Vaccine' },
    { type: RecordType.ALLERGY, label: 'Allergy' },
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddMockAttachment = () => {
    const isPdf = attachments.length % 2 === 0;
    const newAtt: Attachment = {
      id: `att-user-${Date.now()}`,
      name: isPdf
        ? `clinical_report_${attachments.length + 1}.pdf`
        : `prescription_scan_${attachments.length + 1}.jpg`,
      mimeType: isPdf ? 'application/pdf' : 'image/jpeg',
      url: `https://storage.amrutam.co.in/ehr/upload/${Date.now()}`,
      sizeBytes: 850000 + attachments.length * 150000,
    };
    setAttachments([...attachments, newAtt]);
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachments(attachments.filter((a) => a.id !== attId));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setTitleError('Record title is required');
      return;
    }
    setTitleError(null);

    const recordId = `REC-USR-${Date.now().toString().slice(-6)}`;
    const nowIso = new Date().toISOString();

    const result = await dispatch(
      addHealthRecordThunk({
        id: recordId,
        title: title.trim(),
        type: selectedType,
        date: nowIso,
        doctorName: doctorName.trim() || undefined,
        facility: facility.trim() || undefined,
        notes: notes.trim() || undefined,
        tags: selectedTags,
        attachments,
      }),
    );

    if (addHealthRecordThunk.fulfilled.match(result)) {
      Alert.alert('Health Record Created', `"${title.trim()}" has been securely logged into your timeline.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.navBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ArrowLeftIcon size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[typography.h3, { color: colors.text, flex: 1, marginLeft: 12 }]}>
          Log New Health Record
        </Text>
      </View>

      <ScrollView style={styles.formScroll} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Record Type Selector */}
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginBottom: 8 }]}>
          Record Type *
        </Text>
        <View style={styles.typeRow}>
          {typeOptions.map((opt) => {
            const isSelected = selectedType === opt.type;
            return (
              <TouchableOpacity
                key={opt.type}
                activeOpacity={0.7}
                onPress={() => setSelectedType(opt.type)}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.typeChipText,
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

        {/* Title Input */}
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginTop: spacing.md, marginBottom: 6 }]}>
          Record Title *
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: titleError ? '#E63946' : colors.border,
              color: colors.text,
              borderRadius: borderRadius.md,
            },
          ]}
          placeholder="e.g. Panchakarma Virechana Summary, Blood Panel..."
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={(text) => {
            setTitle(text);
            if (titleError) setTitleError(null);
          }}
        />
        {titleError && (
          <Text style={[typography.caption, { color: '#E63946', marginTop: 4 }]}>{titleError}</Text>
        )}

        {/* Doctor Name Input */}
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginTop: spacing.md, marginBottom: 6 }]}>
          Doctor / Vaidya Name (Optional)
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
              borderRadius: borderRadius.md,
            },
          ]}
          placeholder="e.g. Dr. Rajeshwar Shastri, BAMS"
          placeholderTextColor={colors.textMuted}
          value={doctorName}
          onChangeText={setDoctorName}
        />

        {/* Health Facility Input */}
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginTop: spacing.md, marginBottom: 6 }]}>
          Hospital / Clinic Name (Optional)
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
              borderRadius: borderRadius.md,
            },
          ]}
          placeholder="e.g. Amrutam Hospital, Gwalior"
          placeholderTextColor={colors.textMuted}
          value={facility}
          onChangeText={setFacility}
        />

        {/* Clinical Notes / Description */}
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginTop: spacing.md, marginBottom: 6 }]}>
          Clinical Notes & Ayurvedic Observations
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
              borderRadius: borderRadius.md,
            },
          ]}
          placeholder="Enter Ayurvedic symptoms, diagnosis, diet restrictions (Pathya) or dosage instructions..."
          placeholderTextColor={colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
        />

        {/* Medical Tags Picker */}
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginTop: spacing.md, marginBottom: 8 }]}>
          Health Tags
        </Text>
        <View style={styles.tagsWrapper}>
          {AVAILABLE_RECORD_TAGS.filter((t) => t !== 'All Tags').map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.7}
                onPress={() => toggleTag(tag)}
                style={[
                  styles.tagPill,
                  {
                    backgroundColor: isSelected ? colors.primary + '18' : colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderRadius: borderRadius.round,
                  },
                ]}
              >
                <TagIcon size={12} color={isSelected ? colors.primary : colors.textMuted} />
                <Text
                  style={[
                    styles.tagPillText,
                    {
                      color: isSelected ? colors.primary : colors.textSecondary,
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

        {/* Diagnostic Attachments */}
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '700', marginTop: spacing.md, marginBottom: 8 }]}>
          Diagnostic Documents & Scans ({attachments.length})
        </Text>

        {attachments.map((att) => (
          <View
            key={att.id}
            style={[
              styles.attRow,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: borderRadius.md },
            ]}
          >
            <PdfFileIcon size={20} color="#E63946" />
            <Text style={[typography.bodySmall, { color: colors.text, flex: 1, marginLeft: 8 }]} numberOfLines={1}>
              {att.name}
            </Text>
            <TouchableOpacity onPress={() => handleRemoveAttachment(att.id)} style={{ padding: 4 }}>
              <TrashIcon size={16} color="#E63946" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleAddMockAttachment}
          style={[
            styles.addAttBtn,
            { borderColor: colors.primary, borderRadius: borderRadius.md, backgroundColor: colors.primary + '0A' },
          ]}
        >
          <PlusIcon size={16} color={colors.primary} />
          <Text style={[typography.bodyMedium, { color: colors.primary, fontWeight: '600', marginLeft: 6 }]}>
            Attach Diagnostic Report / Prescription Scan
          </Text>
        </TouchableOpacity>

        {/* Save Button */}
        <View style={{ marginTop: spacing.xl }}>
          <Button
            title="Save Health Record"
            variant="primary"
            onPress={handleSave}
            loading={isAddingRecord}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconBtn: {
    padding: 6,
  },
  formScroll: {
    padding: 16,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  typeChipText: {
    fontSize: 13,
  },
  input: {
    height: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 14,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  tagPillText: {
    fontSize: 12,
  },
  attRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  addAttBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    marginTop: 4,
  },
});
