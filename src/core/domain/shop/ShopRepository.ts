import { Product } from './Product';
import { CartItem } from './CartItem';
import { PaginatedResult, PaginationParams } from '../../types/common';

export type ProductSortOption = 'popular' | 'price_low_high' | 'price_high_low' | 'rating';

export interface ProductFilterCriteria {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  minRating?: number;
  sortBy?: ProductSortOption;
}

export interface ShopRepository {
  getProducts(params: PaginationParams & { filters?: ProductFilterCriteria }): Promise<PaginatedResult<Product>>;
  getProductById(id: string): Promise<Product | null>;
  getSavedCart(): Promise<CartItem[]>;
  saveCart(items: CartItem[]): Promise<void>;
  getWishlist(): Promise<string[]>;
  toggleWishlist(productId: string): Promise<boolean>;
}
