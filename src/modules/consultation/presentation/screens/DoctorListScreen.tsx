/**
 * @file src/modules/consultation/presentation/screens/DoctorListScreen.tsx
 * @description Virtualized directory screen for 5,000 Ayurvedic Doctors.
 * Supports instant search, specialty filtering, infinite scroll, and all 4 explicit UI states.
 *
 * Invariants:
 * - Implements 4 explicit UI states: Loading (Skeleton), Empty (EmptyState), Error (ErrorView + Retry), Data (Virtualized List).
 * - Debounces search input and paginates in batches of 20.
 * - Uses React Navigation stack navigation to transition between screens.
 */

import React, { useEffect, useCallback, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import {
  consultationActions,
  useConsultationStore,
} from '../../../../app/state/consultationStore';
import { ConsultationStackParamList } from '../../../../app/navigation/type';
import { Doctor } from '../../../../core/domain/consultation/Doctor';
import { DoctorCard } from '../components/DoctorCard';
import { SpecialtyFilterBar } from '../components/SpecialtyFilterBar';
import { DoctorFilterModal } from '../components/DoctorFilterModal';
import { DoctorCardSkeleton } from '../../../../shared/components/Skeleton';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { ErrorView } from '../../../../shared/components/ErrorView';
import {
  SearchLensIcon,
  FilterIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

type NavigationProp = StackNavigationProp<ConsultationStackParamList, 'DoctorList'>;

export const DoctorListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();
  const store = useConsultationStore();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  useEffect(() => {
    consultationActions.fetchDoctors(true);
    consultationActions.fetchUserBookings();
  }, []);

  const activeFilterCount = [
    store.minRating !== undefined,
    store.maxFee !== undefined,
    store.minExperience !== undefined,
    store.sortBy !== undefined,
  ].filter(Boolean).length;

  const handleDoctorPress = useCallback(
    (doctor: Doctor) => {
      consultationActions.selectDoctor(doctor);
      navigation.navigate('DoctorDetails', { doctorId: doctor.id });
    },
    [navigation],
  );

  const handleBookPress = useCallback(
    (doctor: Doctor) => {
      consultationActions.selectDoctor(doctor);
      navigation.navigate('BookingSlot', { doctorId: doctor.id });
    },
    [navigation],
  );

  const handleMyBookingsPress = useCallback(() => {
    navigation.navigate('MyBookings');
  }, [navigation]);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Screen Title & My Bookings Shortcut */}
      <View style={styles.topBar}>
        <View>
          <Text style={[typography.h1, { color: colors.text }]}>
            Ayurvedic Doctors
          </Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
            {store.total > 0
              ? `${store.total.toLocaleString()} Classical Vaidyas & Specialists`
              : 'Find classical Ayurvedic practitioners'}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleMyBookingsPress}
          style={[
            styles.myBookingsButton,
            {
              backgroundColor: colors.secondary,
              borderColor: colors.primary,
              borderRadius: borderRadius.round,
              paddingVertical: spacing.xs + 2,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <Text style={[styles.myBookingsText, { color: colors.primaryDark }]}>
            📅 My Appointments {store.userBookings.length > 0 ? `(${store.userBookings.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Input Bar + Filter Trigger */}
      <View style={[styles.searchRow, { marginTop: spacing.md }]}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDark ? colors.card : '#FFFFFF',
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
              paddingHorizontal: spacing.md,
              flex: 1,
            },
          ]}
        >
          <SearchLensIcon size={18} color={colors.textMuted} />
          <TextInput
            placeholder="Search doctor, specialty, city, disease..."
            placeholderTextColor={colors.textMuted}
            value={store.searchQuery}
            onChangeText={(text) => consultationActions.setSearchQuery(text)}
            style={[
              styles.searchInput,
              {
                color: colors.text,
                fontSize: 14,
                marginLeft: spacing.xs,
              },
            ]}
          />
          {store.searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() => consultationActions.setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={{ color: colors.textMuted, fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => setIsFilterModalVisible(true)}
          activeOpacity={0.8}
          style={[
            styles.filterTriggerButton,
            {
              backgroundColor: activeFilterCount > 0 ? colors.primary : isDark ? colors.card : '#FFFFFF',
              borderColor: activeFilterCount > 0 ? colors.primary : colors.border,
              borderRadius: borderRadius.lg,
              marginLeft: spacing.xs + 2,
              paddingHorizontal: spacing.md - 2,
            },
          ]}
        >
          <FilterIcon size={18} color={activeFilterCount > 0 ? '#FFFFFF' : colors.text} />
          {activeFilterCount > 0 && (
            <View style={[styles.filterBadge, { backgroundColor: colors.accent }]}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filter Tags Bar (if active) */}
      {activeFilterCount > 0 && (
        <View
          style={[
            styles.activeFiltersBar,
            {
              backgroundColor: isDark ? colors.card : colors.secondary,
              borderColor: colors.primary,
              borderRadius: borderRadius.md,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              marginTop: spacing.xs + 2,
            },
          ]}
        >
          <Text style={[typography.caption, { color: colors.primaryDark, flex: 1 }]}>
            Filters applied: {store.minRating ? `★${store.minRating}+ ` : ''}
            {store.maxFee ? `≤₹${store.maxFee} ` : ''}
            {store.minExperience ? `Exp ${store.minExperience}y+ ` : ''}
            {store.sortBy ? `Sorted ` : ''}
          </Text>
          <TouchableOpacity onPress={() => consultationActions.clearFilters()}>
            <Text style={[typography.caption, { color: colors.error, fontWeight: '700' }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Chips Bar */}
      <SpecialtyFilterBar
        selectedSpecialty={store.selectedSpecialty}
        onSelectSpecialty={(spec) => consultationActions.setSelectedSpecialty(spec)}
        availableTodayOnly={store.availableTodayOnly}
        onToggleAvailableToday={() => consultationActions.toggleAvailableToday()}
      />
    </View>
  );

  const renderFooter = () => {
    if (!store.isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={[typography.caption, { color: colors.textSecondary, marginLeft: 8 }]}>
          Loading more vaidyas...
        </Text>
      </View>
    );
  };

  const renderModal = () => (
    <DoctorFilterModal
      visible={isFilterModalVisible}
      onClose={() => setIsFilterModalVisible(false)}
      initialFilters={{
        minRating: store.minRating,
        maxFee: store.maxFee,
        minExperience: store.minExperience,
        sortBy: store.sortBy,
        availableTodayOnly: store.availableTodayOnly,
      }}
      onApply={(filters) => consultationActions.setAdvancedFilters(filters)}
      onReset={() => consultationActions.clearFilters()}
    />
  );

  // State 3: Error
  if (store.doctorError && store.doctors.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ErrorView
          message={store.doctorError}
          onRetry={() => consultationActions.fetchDoctors(true)}
          retryTitle="Retry Loading Doctors"
        />
        {renderModal()}
      </View>
    );
  }

  // State 1: Loading Initial
  if (store.isLoadingDoctors && store.doctors.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <View style={{ paddingHorizontal: spacing.md }}>
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
          <DoctorCardSkeleton />
        </View>
        {renderModal()}
      </View>
    );
  }

  // State 2: Empty
  if (store.doctors.length === 0 && !store.isLoadingDoctors) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <EmptyState
          title="No Doctors Found"
          description="We couldn't find any Ayurvedic specialists matching your current search or filters."
          emoji="🌿"
          actionTitle="Clear Filters"
          onActionPress={() => consultationActions.clearFilters()}
        />
        {renderModal()}
      </View>
    );
  }

  // State 4: Data (List)
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlashList<Doctor>
        data={store.doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard
            doctor={item}
            onPress={handleDoctorPress}
            onBookPress={handleBookPress}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.md }]}
        onEndReached={() => consultationActions.fetchMoreDoctors()}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={store.isLoadingDoctors}
            onRefresh={() => consultationActions.fetchDoctors(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />
      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  headerSection: {
    paddingTop: 12,
    marginBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myBookingsButton: {
    borderWidth: 1,
  },
  myBookingsText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
  },
  filterTriggerButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  activeFiltersBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  footerLoader: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
