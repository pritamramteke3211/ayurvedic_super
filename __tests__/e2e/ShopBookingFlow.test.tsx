/**
 * @file __tests__/e2e/ShopBookingFlow.test.tsx
 * @description End-to-End Integration Flow Test for Amrutam Ayurvedic Super App using third-party dependencies (i18next, react-native-keychain, etc.).
 *
 * Invariants:
 * - 1. Shop & Cart Workflow: Adding items, calculating subtotals, item discounts, and delivery rules via CartCalculator.
 * - 2. Doctor Consultation Workflow: Slot validation, expired slots, and conflict detection via SlotConflictValidator.
 * - 3. Health Records Timeline Workflow: Grouping records chronologically by Month/Year via TimelineGrouper.
 * - 4. Secure Storage Integration: Keychain-backed session token and patient health flag persistence with in-memory fallback.
 * - 5. Internationalization: Dynamic switching between English and Hindi Ayurvedic vocabulary via i18next.
 */

import { CartCalculator } from '../../src/core/domain/shop/CartCalculator';
import { CartItem } from '../../src/core/domain/shop/CartItem';
import { Product } from '../../src/core/domain/shop/Product';
import { SlotConflictValidator } from '../../src/core/domain/consultation/SlotConflictValidator';
import { Slot } from '../../src/core/domain/consultation/Slot';
import { Booking, BookingStatus } from '../../src/core/domain/consultation/Booking';
import { SlotConflictError, DoubleBookingError } from '../../src/core/domain/consultation/ConsultationErrors';
import { TimelineGrouper } from '../../src/core/domain/healthRecords/TimelineGrouper';
import { HealthRecord } from '../../src/core/domain/healthRecords/HealthRecord';
import { RecordType } from '../../src/core/domain/healthRecords/RecordType';
import { SecureStorageService } from '../../src/infrastructure/storage/secureStorage';
import { changeLanguage, getCurrentTranslations } from '../../src/shared/i18n';

describe('Ayurvedic Super App — End-to-End Core User Workflows', () => {
  describe('Workflow 1: Shop Browsing, Cart Calculation & Checkout Calculation', () => {
    it('calculates totals, bulk quantity, item discounts, and free delivery thresholds correctly', () => {
      const prod1 = new Product({
        id: 'prod_ashwa_01',
        name: 'Pure Ashwagandha Churna',
        category: 'Herbs & Powders',
        price: 500,
        discountPrice: 450,
        rating: 4.8,
        reviewCount: 120,
        imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108',
        description: 'Organic stress-relief adaptogen.',
        inStock: true,
        stockCount: 25,
        ingredients: ['Ashwagandha Root Extract'],
        benefits: ['Stress Relief', 'Immunity'],
      });

      const prod2 = new Product({
        id: 'prod_triphala_02',
        name: 'Triphala Guggulu Tablets',
        category: 'Digestive Health',
        price: 350,
        rating: 4.7,
        reviewCount: 85,
        imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae',
        description: 'Digestive balance formulation.',
        inStock: true,
        stockCount: 15,
        ingredients: ['Amla', 'Haritaki', 'Bibhitaki', 'Guggulu'],
        benefits: ['Digestion', 'Detox'],
      });

      const items: CartItem[] = [
        new CartItem({ product: prod1, quantity: 2 }), // Original: 1000, Discount: 100 (Effective: 900)
        new CartItem({ product: prod2, quantity: 1 }), // Original: 350, Discount: 0 (Effective: 350)
      ];

      // Subtotal = 1000 + 350 = 1350, Discount = 100, Delivery = 0 (subtotal > 500), Total = 1250
      const summary = CartCalculator.calculateSummary(items);

      expect(summary.itemCount).toBe(3);
      expect(summary.subtotal).toBe(1350);
      expect(summary.discount).toBe(100);
      expect(summary.deliveryFee).toBe(0);
      expect(summary.total).toBe(1250);
    });
  });

  describe('Workflow 2: Doctor Consultation Booking & Slot Conflict Prevention', () => {
    const existingBookings: Booking[] = [
      new Booking({
        id: 'booking_01',
        slotId: 'slot_booked_10am',
        doctorId: 'doc_sharma_01',
        doctorName: 'Dr. Sharma',
        patientName: 'Pritam Ramteke',
        startTime: '2026-09-01T10:00:00Z',
        endTime: '2026-09-01T10:30:00Z',
        status: BookingStatus.CONFIRMED,
        createdAt: '2026-08-28T10:00:00Z',
      }),
    ];

    it('approves booking for a non-conflicting available slot', () => {
      const targetSlot = new Slot({
        id: 'slot_avail_11am',
        doctorId: 'doc_sharma_01',
        startTime: '2026-09-01T11:00:00Z',
        endTime: '2026-09-01T11:30:00Z',
        isBooked: false,
      });

      expect(() => {
        SlotConflictValidator.validate({
          slot: targetSlot,
          existingBookings,
          now: new Date('2026-08-28T09:00:00Z'),
        });
      }).not.toThrow();
    });

    it('rejects booking when slot is already marked booked', () => {
      const bookedSlot = new Slot({
        id: 'slot_already_booked',
        doctorId: 'doc_sharma_01',
        startTime: '2026-09-01T12:00:00Z',
        endTime: '2026-09-01T12:30:00Z',
        isBooked: true,
      });

      expect(() => {
        SlotConflictValidator.validate({
          slot: bookedSlot,
          existingBookings,
          now: new Date('2026-08-28T09:00:00Z'),
        });
      }).toThrow(SlotConflictError);
    });

    it('rejects booking when slot overlaps with an existing user appointment', () => {
      const overlappingSlot = new Slot({
        id: 'slot_conflict_1015am',
        doctorId: 'doc_verma_02',
        startTime: '2026-09-01T10:15:00Z',
        endTime: '2026-09-01T10:45:00Z',
        isBooked: false,
      });

      expect(() => {
        SlotConflictValidator.validate({
          slot: overlappingSlot,
          existingBookings,
          now: new Date('2026-08-28T09:00:00Z'),
        });
      }).toThrow(DoubleBookingError);
    });
  });

  describe('Workflow 3: Patient Health Records Timeline Grouping', () => {
    it('groups patient records chronologically by Month & Year sections', () => {
      const records: HealthRecord[] = [
        new HealthRecord({
          id: 'rec_01',
          title: 'Prakriti Balance Assessment',
          type: RecordType.CONSULTATION,
          date: '2026-08-15T10:00:00Z',
          doctorName: 'Dr. Vaidya Raman',
          tags: ['Vata', 'Pitta', 'Prakriti'],
          notes: 'Balanced constitution with mild Vata elevation.',
          attachments: [],
          createdAt: '2026-08-15T10:00:00Z',
        }),
        new HealthRecord({
          id: 'rec_02',
          title: 'Nadi & Pulse Diagnostic',
          type: RecordType.PRESCRIPTION,
          date: '2026-08-01T09:00:00Z',
          doctorName: 'Dr. Vaidya Raman',
          tags: ['Pulse', 'Nadi'],
          notes: 'Pulse rate 72 bpm, rhythmic.',
          attachments: [],
          createdAt: '2026-08-01T09:00:00Z',
        }),
        new HealthRecord({
          id: 'rec_03',
          title: 'Lipid Profile & Liver Panel',
          type: RecordType.LAB_REPORT,
          date: '2026-07-20T11:00:00Z',
          doctorName: 'Metropolis Labs',
          tags: ['Cholesterol', 'Liver'],
          notes: 'All markers within normal Ayurvedic baseline.',
          attachments: [],
          createdAt: '2026-07-20T11:00:00Z',
        }),
      ];

      const sections = TimelineGrouper.group(records);

      expect(sections.length).toBe(2);
      expect(sections[0].title).toBe('August 2026');
      expect(sections[0].records.length).toBe(2);
      expect(sections[1].title).toBe('July 2026');
      expect(sections[1].records.length).toBe(1);
    });
  });

  describe('Workflow 4: Encrypted Local Storage & Patient Session Security', () => {
    it('stores and retrieves encrypted patient session tokens and flags', async () => {
      const vault = new SecureStorageService('e2e-test-vault', 'e2e-key-xyz');
      vault.clearAll();

      await vault.setAuthToken('amrutam_session_jwt_9988');
      expect(await vault.getAuthToken()).toBe('amrutam_session_jwt_9988');

      vault.setSensitiveData('prakriti_status', { dominantDosha: 'Pitta', score: 88 });
      const sensitive = vault.getSensitiveData<{ dominantDosha: string; score: number }>('prakriti_status');

      expect(sensitive).toEqual({ dominantDosha: 'Pitta', score: 88 });

      await vault.clearAuthToken();
      expect(await vault.getAuthToken()).toBeNull();
    });
  });

  describe('Workflow 5: Multilingual Support (English <-> Hindi) with Ayurvedic Terms via i18next', () => {
    it('switches vocabulary seamlessly and retains full domain coverage', async () => {
      await changeLanguage('en');
      let t = getCurrentTranslations();
      expect(t.consultation.findDoctor).toBe('Find an Ayurvedic Vaidya');
      expect(t.shop.addToCart).toBe('Add to Cart');

      await changeLanguage('hi');
      t = getCurrentTranslations();
      expect(t.consultation.findDoctor).toBe('आयुर्वेदिक वैद्य खोजें');
      expect(t.shop.addToCart).toBe('कार्ट में जोड़ें');
      expect(t.ayurvedic.nadiPariksha).toBe('नाड़ी परीक्षा');
    });
  });
});
