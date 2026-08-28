/**
 * @file src/infrastructure/api/mockDataGenerator.ts
 * @description Centralized scale mock data generators (5,000 doctors, 20,000 products, 10,000 health records).
 *
 * Invariants:
 * - Generates deterministic mock entities using seeded PRNGs for reproducible scale testing.
 */

import { generate5kDoctors, generateDoctorSlotsForDate } from '../mock/consultationMockData';

export { generate5kDoctors, generateDoctorSlotsForDate };

export const mockDataGenerators = {
  doctors: generate5kDoctors,
  doctorSlots: generateDoctorSlotsForDate,
};
