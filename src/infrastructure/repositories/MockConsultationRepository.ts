/**
 * @file src/infrastructure/repositories/MockConsultationRepository.ts
 * @description In-memory and MMKV-persisted mock implementation of ConsultationRepository.
 * Manages 5,000 virtualized doctors, dynamic slot calculation, and user booking persistence.
 *
 * Invariants:
 * - Lazy-initializes the 5,000 doctor dataset on first access to conserve startup resources.
 * - Simulates realistic network latency and chaos fault injection via ChaosFaultSimulator.
 * - Automatically reconciles user bookings from local MMKV storage with doctor availability slots.
 */

import {
  ConsultationRepository,
  DoctorFilterCriteria,
} from '../../core/domain/consultation/ConsultationRepository';
import { Doctor } from '../../core/domain/consultation/Doctor';
import { Slot } from '../../core/domain/consultation/Slot';
import { Booking, BookingProps, BookingStatus } from '../../core/domain/consultation/Booking';
import { BookingNotFoundError } from '../../core/domain/consultation/ConsultationErrors';
import { PaginatedResult, PaginationParams } from '../../core/types/common';
import { generate5kDoctors, generateDoctorSlotsForDate } from '../mock/consultationMockData';
import { storage } from '../storage/mmkv';
import { syncQueue } from '../storage/syncQueue';
import { networkManager } from '../network/networkManager';
import { chaosSimulator } from '../api/mockServer';
import { logger } from '../logging/logger';

const BOOKINGS_STORAGE_KEY = 'amrutam_consultation_user_bookings';

export class MockConsultationRepository implements ConsultationRepository {
  private doctorsCache: Doctor[] | null = null;

  /**
   * Lazily loads the 5,000 in-memory doctor database.
   */
  private getDoctorsDataset(): Doctor[] {
    if (!this.doctorsCache) {
      const startTime = Date.now();
      this.doctorsCache = generate5kDoctors();
      logger.info('MockConsultationRepository', `Generated 5,000 doctors in ${Date.now() - startTime}ms`);
    }
    return this.doctorsCache;
  }

  /**
   * Fetches paginated, filtered, and searchable doctors from the 5,000 dataset.
   */
  async getDoctors(
    params: PaginationParams & { filters?: DoctorFilterCriteria } = { page: 1, limit: 20 },
  ): Promise<PaginatedResult<Doctor>> {
    await chaosSimulator.simulateNetworkHop();

    const allDoctors = this.getDoctorsDataset();
    const { page = 1, limit = 20, filters } = params;

    let filtered = allDoctors;

    if (filters) {
      const { query, specialty, minRating, maxFee, minExperience, availableToday, sortBy } = filters;

      if (query && query.trim().length > 0) {
        const q = query.toLowerCase().trim();
        filtered = filtered.filter(
          (doc) =>
            doc.name.toLowerCase().includes(q) ||
            doc.specialty.toLowerCase().includes(q) ||
            doc.bio.toLowerCase().includes(q) ||
            doc.languages.some((l) => l.toLowerCase().includes(q)),
        );
      }

      if (specialty && specialty !== 'All' && specialty !== 'All Specialties') {
        const specLower = specialty.toLowerCase();
        filtered = filtered.filter((doc) => doc.specialty.toLowerCase().includes(specLower));
      }

      if (minRating !== undefined && minRating > 0) {
        filtered = filtered.filter((doc) => doc.rating >= minRating);
      }

      if (maxFee !== undefined && maxFee > 0) {
        filtered = filtered.filter((doc) => doc.consultationFee <= maxFee);
      }

      if (minExperience !== undefined && minExperience > 0) {
        filtered = filtered.filter((doc) => doc.experienceYears >= minExperience);
      }

      if (availableToday) {
        filtered = filtered.filter((doc) => doc.isAvailableToday);
      }

      if (sortBy) {
        filtered = [...filtered]; // Copy before sorting
        switch (sortBy) {
          case 'rating_desc':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'experience_desc':
            filtered.sort((a, b) => b.experienceYears - a.experienceYears);
            break;
          case 'fee_asc':
            filtered.sort((a, b) => a.consultationFee - b.consultationFee);
            break;
          case 'fee_desc':
            filtered.sort((a, b) => b.consultationFee - a.consultationFee);
            break;
        }
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  /**
   * Retrieves a single doctor by their unique identifier.
   */
  async getDoctorById(id: string): Promise<Doctor | null> {
    await chaosSimulator.simulateNetworkHop();
    const allDoctors = this.getDoctorsDataset();
    const doctor = allDoctors.find((d) => d.id === id);
    return doctor ?? null;
  }

  /**
   * Generates and returns time slots for a given doctor and calendar date.
   * Cross-references stored bookings to mark user-reserved slots as booked.
   */
  async getDoctorSlots(doctorId: string, date: string): Promise<Slot[]> {
    await chaosSimulator.simulateNetworkHop();
    const baseSlots = generateDoctorSlotsForDate(doctorId, date);
    const userBookings = await this.getUserBookings();

    // Mark any slot booked by this user as booked
    return baseSlots.map((slot) => {
      const isReservedByUser = userBookings.some(
        (b) => b.doctorId === doctorId && b.slotId === slot.id && b.status !== BookingStatus.CANCELLED,
      );

      if (isReservedByUser && !slot.isBooked) {
        return new Slot({
          id: slot.id,
          doctorId: slot.doctorId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: true,
        });
      }
      return slot;
    });
  }

  /**
   * Persists a new booking into local MMKV storage.
   * If offline, enqueues a CREATE_BOOKING sync action for background synchronization.
   */
  async saveBooking(booking: Booking): Promise<void> {
    await chaosSimulator.simulateNetworkHop();
    const rawBookings = storage.getObject<BookingProps[]>(BOOKINGS_STORAGE_KEY) || [];

    // Replace if exists, else append
    const existingIndex = rawBookings.findIndex((b) => b.id === booking.id);
    if (existingIndex >= 0) {
      rawBookings[existingIndex] = booking.toJSON();
    } else {
      rawBookings.unshift(booking.toJSON());
    }

    storage.setObject(BOOKINGS_STORAGE_KEY, rawBookings);
    logger.info('MockConsultationRepository', `Saved booking ${booking.id} for Dr. ${booking.doctorName}`);

    // If offline, enqueue for background sync
    if (!networkManager.isOnline) {
      syncQueue.enqueue('CREATE_BOOKING', booking.toJSON());
      logger.info('MockConsultationRepository', `Enqueued offline booking ${booking.id} into SyncQueue`);
    }
  }

  /**
   * Cancels an existing user booking in local MMKV storage.
   * If offline, enqueues a CANCEL_BOOKING sync action for background synchronization.
   */
  async cancelBooking(bookingId: string): Promise<void> {
    await chaosSimulator.simulateNetworkHop();
    const rawBookings = storage.getObject<BookingProps[]>(BOOKINGS_STORAGE_KEY) || [];
    const targetIndex = rawBookings.findIndex((b) => b.id === bookingId);

    if (targetIndex < 0) {
      throw new BookingNotFoundError(bookingId);
    }

    const booking = new Booking(rawBookings[targetIndex]);
    booking.cancel();
    rawBookings[targetIndex] = booking.toJSON();

    storage.setObject(BOOKINGS_STORAGE_KEY, rawBookings);
    logger.info('MockConsultationRepository', `Cancelled booking ${bookingId}`);

    // If offline, enqueue for background sync
    if (!networkManager.isOnline) {
      syncQueue.enqueue('CANCEL_BOOKING', { bookingId });
      logger.info('MockConsultationRepository', `Enqueued offline cancellation ${bookingId} into SyncQueue`);
    }
  }

  /**
   * Retrieves all user bookings stored in MMKV storage.
   */
  async getUserBookings(): Promise<Booking[]> {
    const rawBookings = storage.getObject<BookingProps[]>(BOOKINGS_STORAGE_KEY) || [];
    return rawBookings.map((props) => new Booking(props));
  }
}

export const mockConsultationRepository = new MockConsultationRepository();
