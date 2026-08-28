/**
 * @file src/core/domain/consultation/SlotConflictValidator.test.ts
 * @description Domain invariant unit tests for SlotConflictValidator.
 *
 * Invariants tested:
 * - Rejects expired slots with SlotExpiredError.
 * - Rejects already-booked slots with SlotConflictError.
 * - Rejects overlapping appointments for the same patient with DoubleBookingError.
 * - Ignores cancelled bookings during overlap calculation.
 */

import { Slot } from './Slot';
import { Booking, BookingStatus } from './Booking';
import { SlotConflictValidator } from './SlotConflictValidator';
import {
  DoubleBookingError,
  SlotConflictError,
  SlotExpiredError,
} from './ConsultationErrors';

describe('SlotConflictValidator', () => {
  const futureStart = '2026-08-30T10:00:00.000Z';
  const futureEnd = '2026-08-30T10:30:00.000Z';
  const testNow = new Date('2026-08-28T08:00:00.000Z');

  it('throws SlotExpiredError when slot is in the past', () => {
    const expiredSlot = new Slot({
      id: 'slot-1',
      doctorId: 'doc-1',
      startTime: '2026-08-25T10:00:00.000Z',
      endTime: '2026-08-25T10:30:00.000Z',
      isBooked: false,
    });

    expect(() => {
      SlotConflictValidator.validate({
        slot: expiredSlot,
        existingBookings: [],
        now: testNow,
      });
    }).toThrow(SlotExpiredError);
  });

  it('throws SlotConflictError when slot is already booked by another user', () => {
    const bookedSlot = new Slot({
      id: 'slot-2',
      doctorId: 'doc-1',
      startTime: futureStart,
      endTime: futureEnd,
      isBooked: true,
    });

    expect(() => {
      SlotConflictValidator.validate({
        slot: bookedSlot,
        existingBookings: [],
        now: testNow,
      });
    }).toThrow(SlotConflictError);
  });

  it('throws DoubleBookingError when user has an overlapping confirmed booking', () => {
    const validSlot = new Slot({
      id: 'slot-3',
      doctorId: 'doc-1',
      startTime: futureStart,
      endTime: futureEnd,
      isBooked: false,
    });

    const overlappingBooking = new Booking({
      id: 'bk-1',
      doctorId: 'doc-2',
      doctorName: 'Dr. Priya Sharma',
      slotId: 'slot-other',
      startTime: '2026-08-30T10:15:00.000Z',
      endTime: '2026-08-30T10:45:00.000Z',
      patientName: 'Pritam',
      status: BookingStatus.CONFIRMED,
      createdAt: '2026-08-28T00:00:00.000Z',
    });

    expect(() => {
      SlotConflictValidator.validate({
        slot: validSlot,
        existingBookings: [overlappingBooking],
        now: testNow,
      });
    }).toThrow(DoubleBookingError);
  });

  it('allows booking when overlapping previous booking was CANCELLED', () => {
    const validSlot = new Slot({
      id: 'slot-4',
      doctorId: 'doc-1',
      startTime: futureStart,
      endTime: futureEnd,
      isBooked: false,
    });

    const cancelledBooking = new Booking({
      id: 'bk-2',
      doctorId: 'doc-2',
      doctorName: 'Dr. Priya Sharma',
      slotId: 'slot-other',
      startTime: futureStart,
      endTime: futureEnd,
      patientName: 'Pritam',
      status: BookingStatus.CANCELLED,
      createdAt: '2026-08-28T00:00:00.000Z',
    });

    expect(() => {
      SlotConflictValidator.validate({
        slot: validSlot,
        existingBookings: [cancelledBooking],
        now: testNow,
      });
    }).not.toThrow();
  });
});
