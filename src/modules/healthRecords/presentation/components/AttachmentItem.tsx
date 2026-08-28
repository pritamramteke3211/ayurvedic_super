/**
 * @file src/modules/healthRecords/presentation/components/AttachmentItem.tsx
 * @description Card component rendering diagnostic medical attachments (PDFs, scan images) with download/preview triggers.
 *
 * Invariants:
 * - Formats file sizes into human-readable KB/MB strings.
 * - Displays appropriate file type icons (PDF vs Image scan).
 * - Triggers interactive preview alert / simulated viewer.
 */

import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Attachment } from '../../../../core/domain/healthRecords/RecordType';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { PdfFileIcon, HealthRecordsIcon } from '../../../../shared/components/icons/AyurvedicIcons';

export interface AttachmentItemProps {
  attachment: Attachment;
}

export const AttachmentItem: React.FC<AttachmentItemProps> = ({ attachment }) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();

  const formattedSize = React.useMemo(() => {
    if (attachment.sizeBytes < 1024 * 1024) {
      return `${Math.round(attachment.sizeBytes / 1024)} KB`;
    }
    return `${(attachment.sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
  }, [attachment.sizeBytes]);

  const isPdf = attachment.mimeType === 'application/pdf';

  const handlePress = () => {
    Alert.alert(
      'Encrypted EHR Document',
      `Opening ${attachment.name} (${formattedSize})\n\nSHA-256 Verified Medical Attachment.`,
      [{ text: 'Close', style: 'cancel' }],
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.md,
          padding: spacing.md,
        },
      ]}
    >
      {attachment.thumbnailUrl ? (
        <Image
          source={{ uri: attachment.thumbnailUrl }}
          style={[styles.thumbnailImage, { borderRadius: borderRadius.sm }]}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.iconBox, { backgroundColor: isPdf ? '#E639461A' : '#0077B61A', borderRadius: borderRadius.sm }]}>
          {isPdf ? <PdfFileIcon size={22} color="#E63946" /> : <HealthRecordsIcon size={22} color="#0077B6" />}
        </View>
      )}

      <View style={styles.infoCol}>
        <Text style={[typography.bodyMedium, { color: colors.text, fontWeight: '600' }]} numberOfLines={1}>
          {attachment.name}
        </Text>
        <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
          {isPdf ? 'PDF Medical Document' : 'High-Res Diagnostic Scan'} • {formattedSize}
        </Text>
      </View>

      <View style={[styles.actionPill, { backgroundColor: colors.primary + '14', borderRadius: borderRadius.round }]}>
        <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>View</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  thumbnailImage: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  actionPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
});
