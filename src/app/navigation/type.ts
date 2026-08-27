export type RootStackParamList = {
  MainTabs: undefined;
  DoctorDetails: { doctorId: string };
  BookingSlot: { doctorId: string };
  BookingConfirmation: { bookingId: string };
  ProductDetails: { productId: string };
  Cart: undefined;
  Wishlist: undefined;
  Checkout: undefined;
  RecordDetails: { recordId: string };
  AddRecord: undefined;
};

export type TabParamList = {
  ConsultationTab: undefined;
  ShopTab: undefined;
  HealthRecordsTab: undefined;
};
