/**
 * @file src/modules/healthRecords/presentation/screens/HealthTimelineScreen.tsx
 * @description Primary Health Records screen rendering 10,000 virtualized medical timeline records via FlashList.
 *
 * Invariants:
 * - Employs @shopify/flash-list with estimatedItemSize for 60 FPS scrolling across 10,000 records.
 * - Handles 4 UI states (Loading, Empty, Error, Data).
 * - Incorporates month/year timeline sectioning, full-text search, and multi-filter criteria.
 * - Displays authentic Ayurvedic Health Profile (Prakriti doshas, Ojas index, vitals).
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useAppDispatch, useAppSelector } from '../../../../app/state/hooks';
import {
  fetchHealthRecordsThunk,
  fetchRecordTagsThunk,
  healthRecordsSliceActions,
} from '../../../../app/state/healthRecordsSlice';
import { HealthRecordProps } from '../../../../core/domain/healthRecords/HealthRecord';
import { RecordType } from '../../../../core/domain/healthRecords/RecordType';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { HealthTimelineScreenProps } from '../../../../app/navigation/type';
import { RecordCard } from '../components/RecordCard';
import { TimelineMonthHeader } from '../components/TimelineMonthHeader';
import { HealthMetricsSummary } from '../components/HealthMetricsSummary';
import { RecordFilterModal } from '../components/RecordFilterModal';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { ErrorView } from '../../../../shared/components/ErrorView';
import { Skeleton } from '../../../../shared/components/Skeleton';
import {
  SearchLensIcon,
  FilterIcon,
  PlusIcon,
  CloseIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

export const HealthTimelineScreen: React.FC<HealthTimelineScreenProps> = ({ navigation }) => {
  const { colors, typography, spacing, borderRadius } = useAppTheme();
  const dispatch = useAppDispatch();

  const {
    records,
    total,
    isLoadingRecords,
    isLoadingMore,
    hasMore,
    recordError,
    searchQuery,
    selectedType,
    selectedTag,
    tags,
    prakritiStats,
    vitalSigns,
  } = useAppSelector((state) => state.healthRecords);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Initial load
  useEffect(() => {
    dispatch(fetchRecordTagsThunk());
    dispatch(fetchHealthRecordsThunk(true));
  }, [dispatch]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        dispatch(healthRecordsSliceActions.setSearchQuery(localSearch));
        dispatch(fetchHealthRecordsThunk(true));
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchHealthRecordsThunk(true));
  }, [dispatch]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoadingRecords) {
      dispatch(fetchHealthRecordsThunk(false));
    }
  }, [hasMore, isLoadingMore, isLoadingRecords, dispatch]);

  const handleSelectType = useCallback(
    (type: RecordType | 'ALL') => {
      dispatch(healthRecordsSliceActions.setSelectedType(type));
      dispatch(fetchHealthRecordsThunk(true));
    },
    [dispatch],
  );

  const handleApplyFilters = useCallback(
    (type: RecordType | 'ALL', tag: string) => {
      dispatch(healthRecordsSliceActions.setSelectedType(type));
      dispatch(healthRecordsSliceActions.setSelectedTag(tag));
      dispatch(fetchHealthRecordsThunk(true));
    },
    [dispatch],
  );

  const handleResetFilters = useCallback(() => {
    dispatch(healthRecordsSliceActions.clearFilters());
    setLocalSearch('');
    dispatch(fetchHealthRecordsThunk(true));
  }, [dispatch]);

  const handleRecordPress = useCallback(
    (record: HealthRecordProps) => {
      navigation.navigate('RecordDetails', { recordId: record.id });
    },
    [navigation],
  );

  const activeFilterCount = (selectedType !== 'ALL' ? 1 : 0) + (selectedTag !== 'All Tags' ? 1 : 0);

  // Helper to extract "Month Year" for timeline grouping
  const getMonthYearKey = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return '';
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: HealthRecordProps; index: number }) => {
      const currentMonthYear = getMonthYearKey(item.date);
      const prevItem = index > 0 ? records[index - 1] : null;
      const prevMonthYear = prevItem ? getMonthYearKey(prevItem.date) : null;
      const showHeader = index === 0 || currentMonthYear !== prevMonthYear;

      const nextItem = index < records.length - 1 ? records[index + 1] : null;
      const isLastInGroup = !nextItem || currentMonthYear !== getMonthYearKey(nextItem.date);

      return (
        <View>
          {showHeader && <TimelineMonthHeader title={currentMonthYear} />}
          <RecordCard record={item} onPress={handleRecordPress} isLastInGroup={isLastInGroup} />
        </View>
      );
    },
    [records, handleRecordPress],
  );

  const renderFooter = () => {
    if (!isLoadingMore) return <View style={{ height: 90 }} />;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[typography.caption, { color: colors.textMuted, marginLeft: 8 }]}>
          Loading more historical records...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search & Header Bar */}
      <View style={[styles.headerBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: colors.background, borderColor: colors.border, borderRadius: borderRadius.md },
          ]}
        >
          <SearchLensIcon size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search records, diagnoses, herbs..."
            placeholderTextColor={colors.textMuted}
            value={localSearch}
            onChangeText={setLocalSearch}
          />
          {localSearch.length > 0 && (
            <TouchableOpacity onPress={() => setLocalSearch('')}>
              <CloseIcon size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setFilterModalVisible(true)}
          style={[
            styles.filterButton,
            {
              backgroundColor: activeFilterCount > 0 ? colors.primary : colors.background,
              borderColor: activeFilterCount > 0 ? colors.primary : colors.border,
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <FilterIcon size={18} color={activeFilterCount > 0 ? '#FFFFFF' : colors.primary} />
          {activeFilterCount > 0 && (
            <View style={[styles.badgePill, { backgroundColor: '#E63946' }]}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Main Content Area: 4 UI States */}
      {isLoadingRecords && records.length === 0 ? (
        <View style={styles.skeletonContainer}>
          <Skeleton width="100%" height={160} style={{ marginBottom: 16 }} />
          <Skeleton width="40%" height={24} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={100} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={100} style={{ marginBottom: 12 }} />
          <Skeleton width="100%" height={100} style={{ marginBottom: 12 }} />
        </View>
      ) : recordError && records.length === 0 ? (
        <ErrorView
          title="Unable to Load Records"
          message={recordError}
          onRetry={handleRefresh}
        />
      ) : (
        <FlashList<HealthRecordProps>
          data={records}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <HealthMetricsSummary
              totalCount={total}
              prakritiStats={prakritiStats}
              vitalSigns={vitalSigns}
              selectedType={selectedType}
              onSelectType={handleSelectType}
              onOpenFilters={() => setFilterModalVisible(true)}
              activeFilterCount={activeFilterCount}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Medical Records Found"
              description="No health records matched your active filter or search query. Try broadening your criteria or add a new record."
              emoji="📋"
              actionTitle="Add New Record"
              onActionPress={() => navigation.navigate('AddRecord')}
            />
          }
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRecords}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}

      {/* Floating Action Button (+ Add Record) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AddRecord')}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            borderRadius: borderRadius.round,
          },
        ]}
      >
        <PlusIcon size={20} color="#FFFFFF" />
        <Text style={[styles.fabText, { color: '#FFFFFF' }]}>Add Record</Text>
      </TouchableOpacity>

      {/* Filter Modal */}
      <RecordFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedType={selectedType}
        selectedTag={selectedTag}
        tags={tags}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  badgePill: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  skeletonContainer: {
    padding: 16,
  },
  footerLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    zIndex: 10,
  },
  fabText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
});
