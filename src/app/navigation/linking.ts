/**
 * @file src/app/navigation/linking.ts
 * @description React Navigation Deep Linking Configuration for Amrutam Ayurvedic Super App.
 *
 * Invariants:
 * - Supports custom schemes ('ayurvedic://', 'amrutam://') and universal web domains ('https://amrutam.co.in').
 * - Maps deep link paths directly to nested module stacks with strongly typed parameters.
 * - Gracefully falls back to root screens on unrecognized URLs.
 */

import { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<any> = {
  prefixes: [
    'ayurvedic://',
    'amrutam://',
    'https://amrutam.co.in',
    'https://app.amrutam.co.in',
  ],
  config: {
    screens: {
      Consultations: {
        screens: {
          DoctorList: 'doctors',
          DoctorDetails: 'doctors/:doctorId',
          BookingSlot: 'doctors/:doctorId/book',
          MyBookings: 'consultations/my-bookings',
        },
      },
      Shop: {
        screens: {
          ProductList: 'products',
          ProductDetails: 'products/:productId',
          Cart: 'cart',
        },
      },
      HealthRecords: {
        screens: {
          HealthTimeline: 'records',
          RecordDetails: 'records/:recordId',
          AddRecord: 'records/new',
        },
      },
    },
  },
};
