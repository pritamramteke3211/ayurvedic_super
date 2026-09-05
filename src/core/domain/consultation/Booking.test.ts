/**
 * @file src/core/domain/consultation/Booking.test.ts
 * @description Unit tests verifying domain invariants, constructor guards, and state machine transitions for Booking.
 *
 * Invariants tested:
 * - Constructor throws InvalidBookingDataError when required IDs or patient name are missing or empty.
 * - Constructor throws InvalidBookingDataError when startTime is greater than or equal to endTime or invalid.
 * - State machine throws InvalidBookingStateTransitionError on forbidden transitions (e.g. from COMPLETED or CANCELLED).
 * - toJSON() returns an immutable frozen snapshot.
 */

import { Booking, BookingProps } from './Booking';
import { BookingStatus } from './BookingStatus';
import {
  ConsultationAlreadyPastError,
  InvalidBookingDataError,
  InvalidBookingStateTransitionError,
  InvalidStringError,
} from './ConsultationErrors';

describe('Booking Entity Domain Invariants', () => {
  const validProps: BookingProps = {
    id: 'booking-101',
    doctorId: 'doc-001',
    doctorName: 'Dr. Aarav Patel',
    slotId: 'slot-501',
    startTime: '2026-09-01T10:00:00.000Z',
    endTime: '2026-09-01T10:30:00.000Z',
    patientName: 'Pritam Ramteke',
    status: BookingStatus.CONFIRMED,
    createdAt: '2026-08-30T09:00:00.000Z',
  };

  describe('Constructor Invariant Validations', () => {
    it('instantiates successfully with valid properties', () => {
      const booking = new Booking(validProps);
      expect(booking.id).toBe(validProps.id);
      expect(booking.doctorId).toBe(validProps.doctorId);
      expect(booking.status).toBe(BookingStatus.CONFIRMED);
    });

    it('throws InvalidStringError if id is empty', () => {
      try {
        new Booking({ ...validProps, id: '   ' });
        fail('Expected InvalidStringError to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidStringError);
        const error = err as InvalidStringError;
        expect(error.entityName).toBe('Booking');
        expect(error.fieldName).toBe('id');
      }
    });

    it('throws InvalidStringError if doctorId is empty', () => {
      try {
        new Booking({ ...validProps, doctorId: '' });
        fail('Expected InvalidStringError to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidStringError);
        const error = err as InvalidStringError;
        expect(error.entityName).toBe('Booking');
        expect(error.fieldName).toBe('doctorId');
        expect(error.entityId).toBe(validProps.id);
      }
    });

    it('throws InvalidStringError if doctorName is empty', () => {
      try {
        new Booking({ ...validProps, doctorName: '  ' });
        fail('Expected InvalidStringError to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidStringError);
        const error = err as InvalidStringError;
        expect(error.entityName).toBe('Booking');
        expect(error.fieldName).toBe('doctorName');
        expect(error.entityId).toBe(validProps.id);
      }
    });

    it('throws InvalidStringError if slotId is empty', () => {
      try {
        new Booking({ ...validProps, slotId: '' });
        fail('Expected InvalidStringError to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidStringError);
        const error = err as InvalidStringError;
        expect(error.entityName).toBe('Booking');
        expect(error.fieldName).toBe('slotId');
        expect(error.entityId).toBe(validProps.id);
      }
    });

    it('throws InvalidStringError if patientName is empty', () => {
      try {
        new Booking({ ...validProps, patientName: '  ' });
        fail('Expected InvalidStringError to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidStringError);
        const error = err as InvalidStringError;
        expect(error.entityName).toBe('Booking');
        expect(error.fieldName).toBe('patientName');
        expect(error.entityId).toBe(validProps.id);
      }
    });

    it('throws InvalidBookingDataError if startTime is not a valid date', () => {
      expect(
        () => new Booking({ ...validProps, startTime: 'invalid-date' })
      ).toThrow(InvalidBookingDataError);
    });

    it('throws InvalidBookingDataError if startTime is equal to or after endTime', () => {
      expect(
        () =>
          new Booking({
            ...validProps,
            startTime: '2026-09-01T11:00:00.000Z',
            endTime: '2026-09-01T10:00:00.000Z',
          })
      ).toThrow(InvalidBookingDataError);
    });

    it('throws InvalidStringError if createdAt is empty', () => {
      expect(() => new Booking({ ...validProps, createdAt: '  ' })).toThrow(
        InvalidStringError
      );
    });

    it('throws InvalidBookingDataError if createdAt is not a valid date', () => {
      expect(
        () => new Booking({ ...validProps, createdAt: 'invalid-timestamp' })
      ).toThrow(InvalidBookingDataError);
    });
  });

  describe('Time Expiration & Concluded Slot Checks', () => {
    it('accurately reports isPast() based on reference timestamp', () => {
      const booking = new Booking(validProps);
      const beforeEnd = new Date('2026-09-01T10:15:00.000Z');
      const afterEnd = new Date('2026-09-01T10:45:00.000Z');

      expect(booking.isPast(beforeEnd)).toBe(false);
      expect(booking.isPast(afterEnd)).toBe(true);
    });

    it('throws ConsultationAlreadyPastError when cancelling a consultation that has already concluded', () => {
      const booking = new Booking(validProps);
      const afterEnd = new Date('2026-09-01T10:45:00.000Z');

      expect(() => booking.cancel(afterEnd)).toThrow(
        ConsultationAlreadyPastError
      );
    });
  });

  describe('State Machine & Transition Guards', () => {
    it('cancels an active booking successfully', () => {
      const booking = new Booking(validProps);
      booking.cancel();
      expect(booking.status).toBe(BookingStatus.CANCELLED);
    });

    it('throws InvalidBookingStateTransitionError when cancelling an already completed booking', () => {
      const booking = new Booking(validProps);
      booking.complete();
      expect(() => booking.cancel()).toThrow(InvalidBookingStateTransitionError);
    });

    it('throws InvalidBookingStateTransitionError when cancelling an already cancelled booking', () => {
      const booking = new Booking(validProps);
      booking.cancel();
      expect(() => booking.cancel()).toThrow(InvalidBookingStateTransitionError);
    });

    it('confirms a pending booking successfully', () => {
      const pendingBooking = new Booking({
        ...validProps,
        status: BookingStatus.PENDING,
      });
      pendingBooking.confirm();
      expect(pendingBooking.status).toBe(BookingStatus.CONFIRMED);
    });

    it('throws InvalidBookingStateTransitionError when confirming an already confirmed, cancelled, or completed booking', () => {
      const confirmedBooking = new Booking(validProps);
      expect(() => confirmedBooking.confirm()).toThrow(
        InvalidBookingStateTransitionError
      );

      const cancelledBooking = new Booking(validProps);
      cancelledBooking.cancel();
      expect(() => cancelledBooking.confirm()).toThrow(
        InvalidBookingStateTransitionError
      );

      const completedBooking = new Booking(validProps);
      completedBooking.complete();
      expect(() => completedBooking.confirm()).toThrow(
        InvalidBookingStateTransitionError
      );
    });

    it('throws InvalidBookingStateTransitionError when queueing an already queued booking for sync', () => {
      const syncBooking = new Booking({
        ...validProps,
        status: BookingStatus.PENDING_SYNC,
      });
      expect(() => syncBooking.markPendingSync()).toThrow(
        InvalidBookingStateTransitionError
      );
    });

    it('completes a confirmed booking successfully', () => {
      const booking = new Booking(validProps);
      booking.complete();
      expect(booking.status).toBe(BookingStatus.COMPLETED);
    });

    it('throws InvalidBookingStateTransitionError when completing an already completed or cancelled booking', () => {
      const booking = new Booking(validProps);
      booking.complete();
      expect(() => booking.complete()).toThrow(
        InvalidBookingStateTransitionError
      );

      const cancelledBooking = new Booking(validProps);
      cancelledBooking.cancel();
      expect(() => cancelledBooking.complete()).toThrow(
        InvalidBookingStateTransitionError
      );
    });
  });

  describe('toJSON() defensive snapshot', () => {
    it('returns an immutable frozen object', () => {
      const booking = new Booking(validProps);
      const json = booking.toJSON();

      expect(Object.isFrozen(json)).toBe(true);
      expect(json.id).toBe(validProps.id);
    });
  });
});
