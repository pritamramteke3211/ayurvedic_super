/**
 * @file src/app/state/consultationSlice.ts
 * @description Redux Toolkit slice for the Consultation module.
 * Coordinates doctors list pagination, filters, slot selection, and booking lifecycle.
 *
 * Invariants:
 * - Employs pure domain use cases for side-effect execution.
 * - Handles 4 UI states (Loading, Empty, Error, Data).
 * - Synchronizes user bookings and consultation preferences with MMKV storage.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Doctor } from '../../core/domain/consultation/Doctor';
import { Slot } from '../../core/domain/consultation/Slot';
import { Booking } from '../../core/domain/consultation/Booking';
import { mockConsultationRepository } from '../../infrastructure/repositories/MockConsultationRepository';
import { GetDoctorsUseCase } from '../../core/application/consultation/GetDoctorsUseCase';
import { GetDoctorSlotsUseCase } from '../../core/application/consultation/GetDoctorSlotsUseCase';
import { BookSlotUseCase, BookSlotDTO } from '../../core/application/consultation/BookSlotUseCase';
import { CancelBookingUseCase } from '../../core/application/consultation/CancelBookingUseCase';
import { GetUserBookingsUseCase } from '../../core/application/consultation/GetUserBookingsUseCase';
import { logger } from '../../infrastructure/logging/logger';

// Instantiate use cases
const getDoctorsUseCase = new GetDoctorsUseCase(mockConsultationRepository);
const getDoctorSlotsUseCase = new GetDoctorSlotsUseCase(mockConsultationRepository);
const bookSlotUseCase = new BookSlotUseCase(mockConsultationRepository);
const cancelBookingUseCase = new CancelBookingUseCase(mockConsultationRepository);
const getUserBookingsUseCase = new GetUserBookingsUseCase(mockConsultationRepository);

export interface ConsultationState {
  // Doctor List & Filter State
  doctors: Doctor[];
  page: number;
  hasMore: boolean;
  total: number;
  isLoadingDoctors: boolean;
  isLoadingMore: boolean;
  doctorError: string | null;
  searchQuery: string;
  selectedSpecialty: string;
  minRating?: number;
  maxFee?: number;
  minExperience?: number;
  sortBy?: 'rating_desc' | 'experience_desc' | 'fee_asc' | 'fee_desc';
  availableTodayOnly: boolean;

  // Doctor Details & Slots
  selectedDoctor: Doctor | null;
  isLoadingDoctorDetails: boolean;
  selectedDate: string; // YYYY-MM-DD
  slots: Slot[];
  isLoadingSlots: boolean;
  slotsError: string | null;
  selectedSlot: Slot | null;

  // Bookings
  userBookings: Booking[];
  isLoadingBookings: boolean;
  isBookingInProgress: boolean;
  bookingError: string | null;
  lastConfirmedBooking: Booking | null;
}

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

const initialState: ConsultationState = {
  doctors: [],
  page: 1,
  hasMore: true,
  total: 0,
  isLoadingDoctors: false,
  isLoadingMore: false,
  doctorError: null,
  searchQuery: '',
  selectedSpecialty: 'All Specialties',
  minRating: undefined,
  maxFee: undefined,
  minExperience: undefined,
  sortBy: undefined,
  availableTodayOnly: false,

  selectedDoctor: null,
  isLoadingDoctorDetails: false,
  selectedDate: getTodayDateStr(),
  slots: [],
  isLoadingSlots: false,
  slotsError: null,
  selectedSlot: null,

  userBookings: [],
  isLoadingBookings: false,
  isBookingInProgress: false,
  bookingError: null,
  lastConfirmedBooking: null,
};

// Async Thunks
export const fetchDoctorsThunk = createAsyncThunk(
  'consultation/fetchDoctors',
  async (reset: boolean = false, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as { consultation: ConsultationState }).consultation;
      const targetPage = reset ? 1 : state.page;
      const specialtyParam = state.selectedSpecialty === 'All Specialties' ? undefined : state.selectedSpecialty;

      const result = await getDoctorsUseCase.execute({
        page: targetPage,
        limit: 15,
        filters: {
          specialty: specialtyParam,
          query: state.searchQuery.trim() || undefined,
          minRating: state.minRating,
          maxFee: state.maxFee,
          minExperience: state.minExperience,
          sortBy: state.sortBy,
          availableToday: state.availableTodayOnly || undefined,
        },
      });

      return { result, reset };
    } catch (err: any) {
      logger.error('ConsultationSlice', 'Failed to fetch doctors', err);
      return rejectWithValue(err.message || 'Failed to load doctors');
    }
  },
);

export const fetchDoctorSlotsThunk = createAsyncThunk(
  'consultation/fetchDoctorSlots',
  async ({ doctorId, date }: { doctorId: string; date: string }, { rejectWithValue }) => {
    try {
      const slots = await getDoctorSlotsUseCase.execute(doctorId, date);
      return slots;
    } catch (err: any) {
      logger.error('ConsultationSlice', 'Failed to fetch doctor slots', err);
      return rejectWithValue(err.message || 'Failed to fetch available slots');
    }
  },
);

export const bookAppointmentThunk = createAsyncThunk(
  'consultation/bookAppointment',
  async (
    { patientName, patientPhone }: { patientName: string; patientPhone?: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = (getState() as { consultation: ConsultationState }).consultation;
      if (!state.selectedDoctor || !state.selectedSlot) {
        throw new Error('Doctor and time slot must be selected before booking.');
      }

      const dto: BookSlotDTO = {
        bookingId: `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        doctorId: state.selectedDoctor.id,
        slotId: state.selectedSlot.id,
        patientName,
        date: state.selectedDate,
      };

      const booking = await bookSlotUseCase.execute(dto);
      return booking;
    } catch (err: any) {
      logger.error('ConsultationSlice', 'Failed to book slot', err);
      return rejectWithValue(err.message || 'Failed to complete appointment booking');
    }
  },
);

export const fetchUserBookingsThunk = createAsyncThunk(
  'consultation/fetchUserBookings',
  async (_, { rejectWithValue }) => {
    try {
      const bookings = await getUserBookingsUseCase.execute();
      return bookings;
    } catch (err: any) {
      logger.error('ConsultationSlice', 'Failed to fetch user bookings', err);
      return rejectWithValue(err.message || 'Failed to load bookings');
    }
  },
);

export const cancelAppointmentThunk = createAsyncThunk(
  'consultation/cancelAppointment',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      await cancelBookingUseCase.execute(bookingId);
      return bookingId;
    } catch (err: any) {
      logger.error('ConsultationSlice', 'Failed to cancel appointment', err);
      return rejectWithValue(err.message || 'Failed to cancel appointment');
    }
  },
);

export const consultationSlice = createSlice({
  name: 'consultation',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedSpecialty(state, action: PayloadAction<string>) {
      state.selectedSpecialty = action.payload;
      state.page = 1;
    },
    setAvailableTodayOnly(state, action: PayloadAction<boolean>) {
      state.availableTodayOnly = action.payload;
      state.page = 1;
    },
    setAdvancedFilters(
      state,
      action: PayloadAction<{
        minRating?: number;
        maxFee?: number;
        minExperience?: number;
        sortBy?: 'rating_desc' | 'experience_desc' | 'fee_asc' | 'fee_desc';
        availableTodayOnly?: boolean;
      }>,
    ) {
      state.minRating = action.payload.minRating;
      state.maxFee = action.payload.maxFee;
      state.minExperience = action.payload.minExperience;
      state.sortBy = action.payload.sortBy;
      if (action.payload.availableTodayOnly !== undefined) {
        state.availableTodayOnly = action.payload.availableTodayOnly;
      }
      state.page = 1;
    },
    clearFilters(state) {
      state.searchQuery = '';
      state.selectedSpecialty = 'All Specialties';
      state.minRating = undefined;
      state.maxFee = undefined;
      state.minExperience = undefined;
      state.sortBy = undefined;
      state.availableTodayOnly = false;
      state.page = 1;
    },
    setSelectedDoctor(state, action: PayloadAction<Doctor | null>) {
      state.selectedDoctor = action.payload;
      state.selectedSlot = null;
      state.slots = [];
      state.slotsError = null;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
      state.selectedSlot = null;
    },
    selectSlot(state, action: PayloadAction<Slot | null>) {
      state.selectedSlot = action.payload;
      state.bookingError = null;
    },
    clearBookingError(state) {
      state.bookingError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Doctors
    builder
      .addCase(fetchDoctorsThunk.pending, (state, action) => {
        if (action.meta.arg) {
          state.isLoadingDoctors = true;
        } else {
          state.isLoadingMore = true;
        }
        state.doctorError = null;
      })
      .addCase(fetchDoctorsThunk.fulfilled, (state, action) => {
        const { result, reset } = action.payload;
        state.isLoadingDoctors = false;
        state.isLoadingMore = false;
        state.doctors = reset ? result.items : [...state.doctors, ...result.items];
        state.page = result.page + 1;
        state.hasMore = result.hasMore;
        state.total = result.total;
        state.doctorError = null;
      })
      .addCase(fetchDoctorsThunk.rejected, (state, action) => {
        state.isLoadingDoctors = false;
        state.isLoadingMore = false;
        state.doctorError = (action.payload as string) || 'Failed to load doctors';
      });

    // Fetch Slots
    builder
      .addCase(fetchDoctorSlotsThunk.pending, (state) => {
        state.isLoadingSlots = true;
        state.slotsError = null;
      })
      .addCase(fetchDoctorSlotsThunk.fulfilled, (state, action) => {
        state.isLoadingSlots = false;
        state.slots = action.payload;
        state.slotsError = null;
      })
      .addCase(fetchDoctorSlotsThunk.rejected, (state, action) => {
        state.isLoadingSlots = false;
        state.slotsError = (action.payload as string) || 'Failed to load slots';
      });

    // Book Appointment
    builder
      .addCase(bookAppointmentThunk.pending, (state) => {
        state.isBookingInProgress = true;
        state.bookingError = null;
      })
      .addCase(bookAppointmentThunk.fulfilled, (state, action) => {
        state.isBookingInProgress = false;
        state.lastConfirmedBooking = action.payload;
        state.userBookings = [action.payload, ...state.userBookings];
        state.bookingError = null;
        if (state.selectedSlot) {
          state.slots = state.slots.map((s) =>
            s.id === state.selectedSlot?.id ? { ...s, isBooked: true } : s,
          );
        }
      })
      .addCase(bookAppointmentThunk.rejected, (state, action) => {
        state.isBookingInProgress = false;
        state.bookingError = (action.payload as string) || 'Booking failed';
      });

    // Fetch User Bookings
    builder
      .addCase(fetchUserBookingsThunk.pending, (state) => {
        state.isLoadingBookings = true;
      })
      .addCase(fetchUserBookingsThunk.fulfilled, (state, action) => {
        state.isLoadingBookings = false;
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookingsThunk.rejected, (state) => {
        state.isLoadingBookings = false;
      });

    // Cancel Appointment
    builder.addCase(cancelAppointmentThunk.fulfilled, (state, action) => {
      state.userBookings = state.userBookings.map((b) =>
        b.id === action.payload ? { ...b, status: 'CANCELLED' as any } : b,
      );
    });
  },
});

export const consultationReducer = consultationSlice.reducer;
export const consultationSliceActions = consultationSlice.actions;
