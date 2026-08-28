/**
 * @file src/app/state/consultationStore.ts
 * @description Redux-backed facade providing typed hooks and unified action dispatchers.
 *
 * Invariants:
 * - Backed 100% by Redux Toolkit store.
 * - Components can use useConsultationStore() or useAppSelector((state) => state.consultation).
 * - consultationActions dispatches typed thunks and slice actions to the Redux store.
 */

import { store } from './store';
import { useAppSelector, useAppDispatch } from './hooks';
import {
  consultationSliceActions,
  fetchDoctorsThunk,
  fetchDoctorSlotsThunk,
  bookAppointmentThunk,
  fetchUserBookingsThunk,
  cancelAppointmentThunk,
  type ConsultationState,
} from './consultationSlice';
import { Doctor } from '../../core/domain/consultation/Doctor';
import { Slot } from '../../core/domain/consultation/Slot';

export type { ConsultationState };

/**
 * Hook to consume Consultation state from Redux.
 */
export function useConsultationStore(): ConsultationState {
  return useAppSelector((state) => state.consultation);
}

/**
 * Direct action dispatchers backed by Redux Toolkit.
 */
export const consultationActions = {
  fetchDoctors: async (reset: boolean = false) => {
    return store.dispatch(fetchDoctorsThunk(reset)).unwrap();
  },

  fetchMoreDoctors: async () => {
    const state = store.getState().consultation;
    if (state.hasMore && !state.isLoadingMore && !state.isLoadingDoctors) {
      return store.dispatch(fetchDoctorsThunk(false)).unwrap();
    }
  },

  setSearchQuery: (query: string) => {
    store.dispatch(consultationSliceActions.setSearchQuery(query));
    // Auto-trigger search with debouncing or immediate fetch
    store.dispatch(fetchDoctorsThunk(true));
  },

  setSelectedSpecialty: (specialty: string) => {
    store.dispatch(consultationSliceActions.setSelectedSpecialty(specialty));
    store.dispatch(fetchDoctorsThunk(true));
  },

  setAvailableTodayOnly: (only: boolean) => {
    store.dispatch(consultationSliceActions.setAvailableTodayOnly(only));
    store.dispatch(fetchDoctorsThunk(true));
  },

  toggleAvailableToday: () => {
    const current = store.getState().consultation.availableTodayOnly;
    store.dispatch(consultationSliceActions.setAvailableTodayOnly(!current));
    store.dispatch(fetchDoctorsThunk(true));
  },

  setAdvancedFilters: (filters: {
    minRating?: number;
    maxFee?: number;
    minExperience?: number;
    sortBy?: 'rating_desc' | 'experience_desc' | 'fee_asc' | 'fee_desc';
    availableTodayOnly?: boolean;
  }) => {
    store.dispatch(consultationSliceActions.setAdvancedFilters(filters));
    store.dispatch(fetchDoctorsThunk(true));
  },

  clearFilters: () => {
    store.dispatch(consultationSliceActions.clearFilters());
    store.dispatch(fetchDoctorsThunk(true));
  },

  selectDoctor: (doctor: Doctor) => {
    store.dispatch(consultationSliceActions.setSelectedDoctor(doctor));
    const state = store.getState().consultation;
    store.dispatch(
      fetchDoctorSlotsThunk({
        doctorId: doctor.id,
        date: state.selectedDate,
      }),
    );
  },

  changeDate: (dateStr: string) => {
    store.dispatch(consultationSliceActions.setSelectedDate(dateStr));
    const state = store.getState().consultation;
    if (state.selectedDoctor) {
      store.dispatch(
        fetchDoctorSlotsThunk({
          doctorId: state.selectedDoctor.id,
          date: dateStr,
        }),
      );
    }
  },

  selectSlot: (slot: Slot) => {
    store.dispatch(consultationSliceActions.selectSlot(slot));
  },

  bookAppointment: async (patientName: string, patientPhone?: string) => {
    try {
      const res = await store
        .dispatch(bookAppointmentThunk({ patientName, patientPhone }))
        .unwrap();
      return res;
    } catch {
      return null;
    }
  },

  fetchUserBookings: async () => {
    return store.dispatch(fetchUserBookingsThunk()).unwrap();
  },

  cancelAppointment: async (bookingId: string) => {
    return store.dispatch(cancelAppointmentThunk(bookingId)).unwrap();
  },
};
