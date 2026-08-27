export const RoutePaths = {
  // Tabs
  ConsultationTab: 'ConsultationTab',
  ShopTab: 'ShopTab',
  HealthRecordsTab: 'HealthRecordsTab',

  // Consultation
  DoctorList: 'DoctorList',
  DoctorDetails: 'DoctorDetails',
  BookingSlot: 'BookingSlot',
  BookingConfirmation: 'BookingConfirmation',
  UpcomingConsultations: 'UpcomingConsultations',

  // Shop
  ProductList: 'ProductList',
  ProductDetails: 'ProductDetails',
  Cart: 'Cart',
  Wishlist: 'Wishlist',
  Checkout: 'Checkout',

  // Health Records
  HealthTimeline: 'HealthTimeline',
  RecordDetails: 'RecordDetails',
  AddRecord: 'AddRecord',
} as const;

export type RoutePathKey = keyof typeof RoutePaths;
export type RoutePathValue = (typeof RoutePaths)[RoutePathKey];
