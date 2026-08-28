/**
 * @file src/infrastructure/repositories/MockShopRepository.ts
 * @description In-memory and MMKV-persisted mock implementation of ShopRepository.
 * Manages 20,000 virtualized Ayurvedic products, cart persistence, and wishlist sync.
 *
 * Invariants:
 * - Deterministically parses and searches across the 20,000 product catalog.
 * - Simulates realistic network latency and chaos fault injection via ChaosFaultSimulator.
 * - Persists cart state and wishlist IDs synchronously in MMKV for instant restore across app sessions.
 */

import {
  ShopRepository,
  ProductFilterCriteria,
  ProductSortOption,
} from '../../core/domain/shop/ShopRepository';
import { Product, ProductProps } from '../../core/domain/shop/Product';
import { CartItem, CartItemProps } from '../../core/domain/shop/CartItem';
import { PaginatedResult, PaginationParams } from '../../core/types/common';
import {
  generateProductByIndex,
  TOTAL_MOCK_PRODUCTS_COUNT,
} from '../mock/shopMockData';
import { storage } from '../storage/mmkv';
import { chaosSimulator } from '../api/mockServer';
import { logger } from '../logging/logger';

const CART_STORAGE_KEY = 'amrutam_shop_user_cart';
const WISHLIST_STORAGE_KEY = 'amrutam_shop_user_wishlist';

export class MockShopRepository implements ShopRepository {
  private productsCache: Product[] | null = null;

  /**
   * Lazily loads and caches the 20,000 in-memory product catalog.
   */
  private getProductsDataset(): Product[] {
    if (!this.productsCache) {
      const startTime = Date.now();
      const dataset: Product[] = new Array(TOTAL_MOCK_PRODUCTS_COUNT);
      for (let i = 0; i < TOTAL_MOCK_PRODUCTS_COUNT; i++) {
        dataset[i] = new Product(generateProductByIndex(i));
      }
      this.productsCache = dataset;
      logger.info(
        'MockShopRepository',
        `Generated 20,000 products in ${Date.now() - startTime}ms`,
      );
    }
    return this.productsCache;
  }

  /**
   * Fetches paginated, multi-filtered, and sorted products from the 20,000 dataset.
   */
  async getProducts(
    params: PaginationParams & { filters?: ProductFilterCriteria } = {
      page: 1,
      limit: 20,
    },
  ): Promise<PaginatedResult<Product>> {
    await chaosSimulator.simulateNetworkHop();

    const allProducts = this.getProductsDataset();
    const { page = 1, limit = 20, filters } = params;

    let filtered = allProducts;

    if (filters) {
      const { query, category, minPrice, maxPrice, inStockOnly, minRating, sortBy } = filters;

      if (query && query.trim().length > 0) {
        const q = query.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
            p.benefits.some((b) => b.toLowerCase().includes(q)),
        );
      }

      if (category && category !== 'All') {
        filtered = filtered.filter((p) => p.category === category);
      }

      if (minPrice !== undefined) {
        filtered = filtered.filter((p) => p.effectivePrice >= minPrice);
      }

      if (maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.effectivePrice <= maxPrice);
      }

      if (inStockOnly) {
        filtered = filtered.filter((p) => p.inStock);
      }

      if (minRating !== undefined && minRating > 0) {
        filtered = filtered.filter((p) => p.rating >= minRating);
      }

      if (sortBy) {
        filtered = this.applySorting([...filtered], sortBy);
      }
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const items = filtered.slice(startIndex, startIndex + limit);

    return {
      items,
      total,
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  }

  /**
   * Sort helper for products.
   */
  private applySorting(products: Product[], sortBy: ProductSortOption): Product[] {
    switch (sortBy) {
      case 'price_low_high':
        return products.sort((a, b) => a.effectivePrice - b.effectivePrice);
      case 'price_high_low':
        return products.sort((a, b) => b.effectivePrice - a.effectivePrice);
      case 'rating':
        return products.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      case 'popular':
      default:
        return products.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }

  /**
   * Finds a product by its unique ID.
   */
  async getProductById(id: string): Promise<Product | null> {
    await chaosSimulator.simulateNetworkHop();

    const allProducts = this.getProductsDataset();
    const found = allProducts.find((p) => p.id === id);
    return found || null;
  }

  /**
   * Retrieves saved cart items from MMKV storage.
   */
  async getSavedCart(): Promise<CartItem[]> {
    try {
      const stored = storage.getObject<CartItemProps[]>(CART_STORAGE_KEY);
      if (!stored || !Array.isArray(stored)) {
        return [];
      }
      return stored.map(
        (item) =>
          new CartItem({
            product: new Product(item.product as unknown as ProductProps),
            quantity: item.quantity,
          }),
      );
    } catch (e) {
      logger.error('MockShopRepository', 'Failed to read cart from MMKV', e);
      return [];
    }
  }

  /**
   * Persists user cart items to MMKV storage.
   */
  async saveCart(items: CartItem[]): Promise<void> {
    try {
      const serialized = items.map((item) => item.toJSON());
      storage.setObject(CART_STORAGE_KEY, serialized);
      logger.info('MockShopRepository', `Saved ${items.length} cart items to MMKV`);
    } catch (e) {
      logger.error('MockShopRepository', 'Failed to save cart to MMKV', e);
    }
  }

  /**
   * Retrieves user wishlist product IDs from MMKV storage.
   */
  async getWishlist(): Promise<string[]> {
    try {
      const stored = storage.getObject<string[]>(WISHLIST_STORAGE_KEY);
      return stored && Array.isArray(stored) ? stored : [];
    } catch (e) {
      logger.error('MockShopRepository', 'Failed to read wishlist from MMKV', e);
      return [];
    }
  }

  /**
   * Toggles product in wishlist and updates MMKV.
   */
  async toggleWishlist(productId: string): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist();
      const index = wishlist.indexOf(productId);
      let isWishlisted: boolean;

      if (index >= 0) {
        wishlist.splice(index, 1);
        isWishlisted = false;
      } else {
        wishlist.push(productId);
        isWishlisted = true;
      }

      storage.setObject(WISHLIST_STORAGE_KEY, wishlist);
      return isWishlisted;
    } catch (e) {
      logger.error('MockShopRepository', 'Failed to toggle wishlist in MMKV', e);
      return false;
    }
  }
}

export const mockShopRepository = new MockShopRepository();
