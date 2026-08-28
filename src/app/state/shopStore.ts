/**
 * @file src/app/state/shopStore.ts
 * @description Redux-backed facade providing typed hooks and unified action dispatchers for the Shop module.
 *
 * Invariants:
 * - Backed 100% by Redux Toolkit store.
 * - Components can consume shop state with useShopStore() or useAppSelector((state) => state.shop).
 * - shopActions provides direct action dispatchers for products, cart, wishlist, and checkout.
 */

import { store } from './store';
import { useAppSelector } from './hooks';
import {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setPriceRange,
  setInStockOnly,
  setMinRating,
  resetFilters,
  clearCheckoutStatus,
  fetchProducts,
  fetchMoreProducts,
  fetchProductById,
  hydrateCartAndWishlist,
  addToCartAsync,
  updateCartQuantityAsync,
  removeFromCartAsync,
  toggleWishlistAsync,
  checkoutCartAsync,
  type ShopState,
} from './shopSlice';
import { ProductSortOption } from '../../core/domain/shop/ShopRepository';

export type { ShopState };

/**
 * Hook to consume Shop state from Redux.
 */
export function useShopStore(): ShopState {
  return useAppSelector((state) => state.shop);
}

/**
 * Direct action dispatchers backed by Redux Toolkit.
 */
export const shopActions = {
  fetchProducts: async (refresh: boolean = false) => {
    return store.dispatch(fetchProducts({ refresh })).unwrap();
  },

  fetchMoreProducts: async () => {
    const state = store.getState().shop;
    if (state.hasMore && !state.isLoadingMore && !state.isLoadingProducts) {
      return store.dispatch(fetchMoreProducts()).unwrap();
    }
  },

  fetchProductById: async (productId: string) => {
    return store.dispatch(fetchProductById(productId)).unwrap();
  },

  hydrateCartAndWishlist: async () => {
    return store.dispatch(hydrateCartAndWishlist()).unwrap();
  },

  setSearchQuery: (query: string) => {
    store.dispatch(setSearchQuery(query));
    store.dispatch(fetchProducts({ refresh: true }));
  },

  setSelectedCategory: (category: string) => {
    store.dispatch(setSelectedCategory(category));
    store.dispatch(fetchProducts({ refresh: true }));
  },

  setSortBy: (sortBy: ProductSortOption) => {
    store.dispatch(setSortBy(sortBy));
    store.dispatch(fetchProducts({ refresh: true }));
  },

  setFilters: (filters: {
    selectedCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    minRating?: number;
    sortBy?: ProductSortOption;
  }) => {
    if (filters.selectedCategory !== undefined) store.dispatch(setSelectedCategory(filters.selectedCategory));
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      store.dispatch(setPriceRange({ minPrice: filters.minPrice, maxPrice: filters.maxPrice }));
    }
    if (filters.inStockOnly !== undefined) store.dispatch(setInStockOnly(filters.inStockOnly));
    if (filters.minRating !== undefined) store.dispatch(setMinRating(filters.minRating));
    if (filters.sortBy !== undefined) store.dispatch(setSortBy(filters.sortBy));
    store.dispatch(fetchProducts({ refresh: true }));
  },

  resetFilters: () => {
    store.dispatch(resetFilters());
    store.dispatch(fetchProducts({ refresh: true }));
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    return store.dispatch(addToCartAsync({ productId, quantity })).unwrap();
  },

  updateCartQuantity: async (productId: string, quantity: number) => {
    return store.dispatch(updateCartQuantityAsync({ productId, quantity })).unwrap();
  },

  removeFromCart: async (productId: string) => {
    return store.dispatch(removeFromCartAsync(productId)).unwrap();
  },

  toggleWishlist: async (productId: string) => {
    return store.dispatch(toggleWishlistAsync(productId)).unwrap();
  },

  checkout: async (deliveryAddress?: string) => {
    return store.dispatch(checkoutCartAsync(deliveryAddress)).unwrap();
  },

  clearCheckoutStatus: () => {
    store.dispatch(clearCheckoutStatus());
  },
};
