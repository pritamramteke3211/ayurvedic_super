/**
 * @file src/shared/i18n/types.ts
 * @description Strongly-typed translation dictionary schema for Amrutam Ayurvedic Super App.
 *
 * Invariants:
 * - Guarantees exhaustive key mapping between all supported locales ('en', 'hi').
 * - Groups translations logically into common, consultation, shop, healthRecords, and ayurvedic domains.
 */

export type SupportedLocale = 'en' | 'hi';

export interface Translations {
  common: {
    appName: string;
    loading: string;
    retry: string;
    error: string;
    save: string;
    cancel: string;
    confirm: string;
    back: string;
    search: string;
    filter: string;
    all: string;
    offlineMode: string;
    success: string;
    details: string;
    language: string;
    english: string;
    hindi: string;
  };
  consultation: {
    tabTitle: string;
    findDoctor: string;
    searchPlaceholder: string;
    bookAppointment: string;
    selectSlot: string;
    availableSlots: string;
    experienceYears: string;
    consultationFee: string;
    qualifications: string;
    languagesSpoken: string;
    aboutDoctor: string;
    slotBooked: string;
    slotConflictError: string;
    myBookings: string;
    noDoctorsFound: string;
  };
  shop: {
    tabTitle: string;
    searchPlaceholder: string;
    categories: string;
    addToCart: string;
    addedToCart: string;
    inStock: string;
    outOfStock: string;
    cart: string;
    cartEmpty: string;
    cartEmptySubtext: string;
    orderSummary: string;
    subtotal: string;
    discount: string;
    deliveryFee: string;
    freeDelivery: string;
    totalAmount: string;
    proceedToCheckout: string;
    checkoutSuccess: string;
  };
  healthRecords: {
    tabTitle: string;
    timeline: string;
    recordDetails: string;
    addNewRecord: string;
    recordTypes: {
      all: string;
      prescription: string;
      labReport: string;
      consultationNote: string;
      prakritiAnalysis: string;
      vitalReading: string;
    };
    prakritiProfile: string;
    doctorPrescription: string;
    testResults: string;
    emptyRecords: string;
  };
  ayurvedic: {
    doshaVata: string;
    doshaPitta: string;
    doshaKapha: string;
    prakriti: string;
    nadiPariksha: string;
    herbalMedicine: string;
    rasayana: string;
  };
}
