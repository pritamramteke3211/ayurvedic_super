import { Slot } from './Slot';
import { Booking, BookingStatus } from './Booking';
import { SlotConflictError, SlotExpiredError, DoubleBookingError } from './ConsultationErrors';

export class SlotConflictValidator {
  /**
   * Validates if a slot can be booked against current time, existing doctor slots, and user's other bookings.
   */
  static validate(params: {
    slot: Slot;
    existingBookings: Booking[];
    now?: Date;
  }): void {
    const { slot, existingBookings, now = new Date() } = params;

    // 1. Check expiration
    if (slot.isExpired(now)) {
      throw new SlotExpiredError();
    }

    // 2. Check if slot is marked booked
    if (slot.isBooked) {
      throw new SlotConflictError();
    }

    // 3. Check for overlapping user bookings (double booking)
    const slotStart = new Date(slot.startTime).getTime();
    const slotEnd = new Date(slot.endTime).getTime();

    const hasOverlap = existingBookings.some(booking => {
      if (booking.status === BookingStatus.CANCELLED) return false;
      const bStart = new Date(booking.startTime).getTime();
      const bEnd = new Date(booking.endTime).getTime();
      return Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd);
    });

    if (hasOverlap) {
      throw new DoubleBookingError();
    }
  }
}
