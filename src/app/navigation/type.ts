/**
 * @file src/app/navigation/type.ts
 * @description Strongly-typed parameter lists and screen prop helpers for React Navigation stacks and tabs.
 *
 * Invariants:
 * - Every navigable route has an explicit typed parameter payload or `undefined`.
 * - Provides type-safe navigation helpers for consultation, shop, and health records modules.
 */

import { StackScreenProps } from '@react-navigation/stack';
import { RoutePaths } from './RoutePaths';

export type ConsultationStackParamList = {
  DoctorList: undefined;
  DoctorDetails: { doctorId: string };
  BookingSlot: { doctorId: string };
  MyBookings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ConsultationStack: undefined;
  DoctorDetails: { doctorId: string };
  BookingSlot: { doctorId: string };
  BookingConfirmation: { bookingId: string };
  MyBookings: undefined;
  ProductList: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  Wishlist: undefined;
  Checkout: undefined;
  HealthTimeline: undefined;
  RecordDetails: { recordId: string };
  AddRecord: undefined;
};

export type TabParamList = {
  ConsultationTab: undefined;
  ShopTab: undefined;
  HealthRecordsTab: undefined;
};

// Screen Props Helper Types
export type DoctorListScreenProps = StackScreenProps<ConsultationStackParamList, 'DoctorList'>;
export type DoctorDetailScreenProps = StackScreenProps<ConsultationStackParamList, 'DoctorDetails'>;
export type BookingScreenProps = StackScreenProps<ConsultationStackParamList, 'BookingSlot'>;
export type MyBookingsScreenProps = StackScreenProps<ConsultationStackParamList, 'MyBookings'>;
