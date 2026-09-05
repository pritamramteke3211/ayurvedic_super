/**
 * @file src/core/domain/consultation/BookingStatus.ts
 * @description Domain enumeration representing the lifecycle states of an appointment booking.
 *
 * Invariants:
 * - State progression: PENDING -> CONFIRMED -> COMPLETED, with CANCELLED and COMPLETED being terminal states.
 * - PENDING_SYNC represents optimistic local offline state awaiting server synchronization.
 */

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PENDING_SYNC = 'PENDING_SYNC',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}
