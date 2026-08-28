// Barrel export for Shop module
export * from '../../core/domain/shop/Product';
export * from '../../core/domain/shop/CartItem';
export * from '../../core/domain/shop/ShopErrors';
export * from '../../core/domain/shop/CartCalculator';
export * from '../../core/domain/shop/ShopRepository';
export * from '../../core/application/shop/GetProductsUseCase';
export * from '../../core/application/shop/GetProductDetailsUseCase';
export * from '../../core/application/shop/AddToCartUseCase';
export * from '../../core/application/shop/UpdateCartQuantityUseCase';
export * from '../../core/application/shop/RemoveFromCartUseCase';
export * from '../../core/application/shop/GetCartUseCase';
export * from '../../core/application/shop/ToggleWishlistUseCase';
export * from '../../core/application/shop/GetWishlistUseCase';
export * from '../../core/application/shop/CheckoutUseCase';

// Presentation
export * from './presentation/screens/ProductListScreen';
export * from './presentation/screens/ProductDetailScreen';
export * from './presentation/screens/CartScreen';
export * from './presentation/components/ProductCard';
export * from './presentation/components/CategoryFilterChips';
export * from './presentation/components/SortFilterModal';
export * from './presentation/components/CartItemRow';
export * from './presentation/components/BillSummaryCard';

