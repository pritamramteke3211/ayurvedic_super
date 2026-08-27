import { Doctor } from './Doctor';
import { Slot } from './Slot';
import { Booking } from './Booking';
import { PaginatedResult, PaginationParams } from '../../types/common';

export interface DoctorFilterCriteria {
  query?: string;
  specialty?: string;
  minRating?: number;
  maxFee?: number;
  availableToday?: boolean;
}

export interface ConsultationRepository {
  getDoctors(params: PaginationParams & { filters?: DoctorFilterCriteria }): Promise<PaginatedResult<Doctor>>;
  getDoctorById(id: string): Promise<Doctor | null>;
  getDoctorSlots(doctorId: string, date: string): Promise<Slot[]>;
  saveBooking(booking: Booking): Promise<void>;
  cancelBooking(bookingId: string): Promise<void>;
  getUserBookings(): Promise<Booking[]>;
}
