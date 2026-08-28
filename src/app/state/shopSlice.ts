/**
 * @file src/app/state/shopSlice.ts
 * @description Redux Toolkit slice for the Ayurvedic Shop module.
 * Coordinates 20,000 product feed pagination, multi-filtering, cart operations, MMKV persistence, and checkout.
 *
 * Invariants:
 * - Employs pure domain use cases for side-effect and repository operations.
 * - Handles 4 UI states (Loading, Empty, Error, Data) for product listing and cart.
 * - Synchronously persists cart items and wishlist IDs to local MMKV storage.
 */

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../core/domain/shop/Product';
import { CartItem } from '../../core/domain/shop/CartItem';
import { CartCalculator, CartSummary } from '../../core/domain/shop/CartCalculator';
import { ProductSortOption } from '../../core/domain/shop/ShopRepository';
import { mockShopRepository } from '../../infrastructure/repositories/MockShopRepository';
import { GetProductsUseCase } from '../../core/application/shop/GetProductsUseCase';
import { GetProductDetailsUseCase } from '../../core/application/shop/GetProductDetailsUseCase';
import { AddToCartUseCase } from '../../core/application/shop/AddToCartUseCase';
import { UpdateCartQuantityUseCase } from '../../core/application/shop/UpdateCartQuantityUseCase';
import { RemoveFromCartUseCase } from '../../core/application/shop/RemoveFromCartUseCase';
import { GetCartUseCase } from '../../core/application/shop/GetCartUseCase';
import { ToggleWishlistUseCase } from '../../core/application/shop/ToggleWishlistUseCase';
import { GetWishlistUseCase } from '../../core/application/shop/GetWishlistUseCase';
import { CheckoutUseCase } from '../../core/application/shop/CheckoutUseCase';
import { logger } from '../../infrastructure/logging/logger';
import { RootState } from './store';

// Instantiate application use cases
const getProductsUseCase = new GetProductsUseCase(mockShopRepository);
const getProductDetailsUseCase = new GetProductDetailsUseCase(mockShopRepository);
const addToCartUseCase = new AddToCartUseCase(mockShopRepository);
const updateCartQuantityUseCase = new UpdateCartQuantityUseCase(mockShopRepository);
const removeFromCartUseCase = new RemoveFromCartUseCase(mockShopRepository);
const getCartUseCase = new GetCartUseCase(mockShopRepository);
const toggleWishlistUseCase = new ToggleWishlistUseCase(mockShopRepository);
const getWishlistUseCase = new GetWishlistUseCase(mockShopRepository);
const checkoutUseCase = new CheckoutUseCase(mockShopRepository);

export interface CheckoutSuccessInfo {
  orderId: string;
  total: number;
  date: string;
  itemCount: number;
}

export interface ShopState {
  // Product Catalog & Filter State
  products: Product[];
  page: number;
  hasMore: boolean;
  total: number;
  isLoadingProducts: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  productError: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: ProductSortOption;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  minRating?: number;

  // Product Details
  selectedProduct: Product | null;
  isLoadingProductDetails: boolean;
  productDetailsError: string | null;

  // Cart & Wishlist (Persisted via MMKV)
  cart: CartItem[];
  wishlist: string[];
  appliedCoupon: string | null;
  couponDiscountPercent: number;
  isCartLoading: boolean;

  // Checkout
  isCheckingOut: boolean;
  checkoutSuccess: CheckoutSuccessInfo | null;
  checkoutError: string | null;
}

const initialState: ShopState = {
  products: [],
  page: 1,
  hasMore: true,
  total: 0,
  isLoadingProducts: false,
  isLoadingMore: false,
  isRefreshing: false,
  productError: null,
  searchQuery: '',
  selectedCategory: 'All',
  sortBy: 'popular',
  minPrice: undefined,
  maxPrice: undefined,
  inStockOnly: false,
  minRating: undefined,

  selectedProduct: null,
  isLoadingProductDetails: false,
  productDetailsError: null,

  cart: [],
  wishlist: [],
  appliedCoupon: null,
  couponDiscountPercent: 0,
  isCartLoading: false,

  isCheckingOut: false,
  checkoutSuccess: null,
  checkoutError: null,
};

// -------------------------------------------------------------
// Async Thunks
// -------------------------------------------------------------

export const fetchProducts = createAsyncThunk(
  'shop/fetchProducts',
  async (
    options: { refresh?: boolean } | void,
    { getState, rejectWithValue },
  ) => {
    try {
      const state = (getState() as RootState).shop;
      const page = options?.refresh ? 1 : 1;

      const result = await getProductsUseCase.execute({
        page,
        limit: 20,
        filters: {
          query: state.searchQuery,
          category: state.selectedCategory,
          sortBy: state.sortBy,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          inStockOnly: state.inStockOnly,
          minRating: state.minRating,
        },
      });

      return {
        products: result.items,
        total: result.total,
        page: result.page,
        hasMore: result.hasMore,
        isRefresh: !!options?.refresh,
      };
    } catch (error: any) {
      logger.error('ShopSlice', 'Failed to fetch products', error);
      return rejectWithValue(error.message || 'Failed to fetch Ayurvedic products');
    }
  },
);

export const fetchMoreProducts = createAsyncThunk(
  'shop/fetchMoreProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as RootState).shop;
      if (!state.hasMore || state.isLoadingMore || state.isLoadingProducts) {
        return null;
      }

      const nextPage = state.page + 1;

      const result = await getProductsUseCase.execute({
        page: nextPage,
        limit: 20,
        filters: {
          query: state.searchQuery,
          category: state.selectedCategory,
          sortBy: state.sortBy,
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          inStockOnly: state.inStockOnly,
          minRating: state.minRating,
        },
      });

      return {
        products: result.items,
        total: result.total,
        page: result.page,
        hasMore: result.hasMore,
      };
    } catch (error: any) {
      logger.error('ShopSlice', 'Failed to fetch more products', error);
      return rejectWithValue(error.message || 'Failed to load more products');
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'shop/fetchProductById',
  async (productId: string, { rejectWithValue }) => {
    try {
      const product = await getProductDetailsUseCase.execute(productId);
      return product;
    } catch (error: any) {
      logger.error('ShopSlice', `Failed to fetch product details for ${productId}`, error);
      return rejectWithValue(error.message || 'Product not found');
    }
  },
);

export const hydrateCartAndWishlist = createAsyncThunk(
  'shop/hydrateCartAndWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const [savedCart, savedWishlist] = await Promise.all([
        getCartUseCase.execute(),
        getWishlistUseCase.execute(),
      ]);
      return { cart: savedCart, wishlist: savedWishlist };
    } catch (error: any) {
      logger.error('ShopSlice', 'Failed to hydrate cart & wishlist from MMKV', error);
      return rejectWithValue('Failed to load local storage');
    }
  },
);

export const addToCartAsync = createAsyncThunk(
  'shop/addToCartAsync',
  async (
    { productId, quantity = 1 }: { productId: string; quantity?: number },
    { rejectWithValue },
  ) => {
    try {
      const updatedCart = await addToCartUseCase.execute(productId, quantity);
      return updatedCart;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Could not add to cart');
    }
  },
);

export const updateCartQuantityAsync = createAsyncThunk(
  'shop/updateCartQuantityAsync',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue },
  ) => {
    try {
      const updatedCart = await updateCartQuantityUseCase.execute(
        productId,
        quantity,
      );
      return updatedCart;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Could not update quantity');
    }
  },
);

export const removeFromCartAsync = createAsyncThunk(
  'shop/removeFromCartAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      const updatedCart = await removeFromCartUseCase.execute(productId);
      return updatedCart;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Could not remove item');
    }
  },
);

export const toggleWishlistAsync = createAsyncThunk(
  'shop/toggleWishlistAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      await toggleWishlistUseCase.execute(productId);
      const updatedWishlist = await getWishlistUseCase.execute();
      return updatedWishlist;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Could not update wishlist');
    }
  },
);

export const checkoutCartAsync = createAsyncThunk(
  'shop/checkoutCartAsync',
  async (_deliveryAddress: string | undefined, { getState, rejectWithValue }) => {
    try {
      const state = (getState() as RootState).shop;
      if (state.cart.length === 0) {
        throw new Error('Your cart is empty');
      }

      const order = await checkoutUseCase.execute();
      return {
        orderId: order.orderId,
        total: order.summary.total,
        date: order.placedAt,
        itemCount: order.summary.itemCount,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Checkout failed');
    }
  },
);

// -------------------------------------------------------------
// Slice Definition
// -------------------------------------------------------------

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action: PayloadAction<ProductSortOption>) => {
      state.sortBy = action.payload;
    },
    setPriceRange: (
      state,
      action: PayloadAction<{ minPrice?: number; maxPrice?: number }>,
    ) => {
      state.minPrice = action.payload.minPrice;
      state.maxPrice = action.payload.maxPrice;
    },
    setInStockOnly: (state, action: PayloadAction<boolean>) => {
      state.inStockOnly = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number | undefined>) => {
      state.minRating = action.payload;
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      const code = action.payload.trim().toUpperCase();
      if (code === 'AMRUTAM10' || code === 'VEDIC10') {
        state.appliedCoupon = code;
        state.couponDiscountPercent = 10;
      } else if (code === 'AYURVEDA20' || code === 'AMRUTAM20') {
        state.appliedCoupon = code;
        state.couponDiscountPercent = 20;
      } else {
        state.appliedCoupon = null;
        state.couponDiscountPercent = 0;
      }
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.couponDiscountPercent = 0;
    },
    clearCheckoutStatus: (state) => {
      state.checkoutSuccess = null;
      state.checkoutError = null;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = 'All';
      state.sortBy = 'popular';
      state.minPrice = undefined;
      state.maxPrice = undefined;
      state.inStockOnly = false;
      state.minRating = undefined;
    },
  },
  extraReducers: (builder) => {
    // fetchProducts
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        if (action.meta.arg && typeof action.meta.arg === 'object' && action.meta.arg.refresh) {
          state.isRefreshing = true;
        } else {
          state.isLoadingProducts = true;
        }
        state.productError = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoadingProducts = false;
        state.isRefreshing = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoadingProducts = false;
        state.isRefreshing = false;
        state.productError = (action.payload as string) || 'Failed to load products';
      });

    // fetchMoreProducts
    builder
      .addCase(fetchMoreProducts.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(fetchMoreProducts.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        if (action.payload) {
          state.products = [...state.products, ...action.payload.products];
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.hasMore = action.payload.hasMore;
        }
      })
      .addCase(fetchMoreProducts.rejected, (state) => {
        state.isLoadingMore = false;
      });

    // fetchProductById
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoadingProductDetails = true;
        state.productDetailsError = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoadingProductDetails = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoadingProductDetails = false;
        state.productDetailsError = (action.payload as string) || 'Product not found';
      });

    // hydrateCartAndWishlist
    builder.addCase(hydrateCartAndWishlist.fulfilled, (state, action) => {
      state.cart = action.payload.cart;
      state.wishlist = action.payload.wishlist;
    });

    // addToCartAsync
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.cart = action.payload;
    });

    // updateCartQuantityAsync
    builder.addCase(updateCartQuantityAsync.fulfilled, (state, action) => {
      state.cart = action.payload;
    });

    // removeFromCartAsync
    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      state.cart = action.payload;
    });

    // toggleWishlistAsync
    builder.addCase(toggleWishlistAsync.fulfilled, (state, action) => {
      state.wishlist = action.payload;
    });

    // checkoutCartAsync
    builder
      .addCase(checkoutCartAsync.pending, (state) => {
        state.isCheckingOut = true;
        state.checkoutError = null;
        state.checkoutSuccess = null;
      })
      .addCase(checkoutCartAsync.fulfilled, (state, action) => {
        state.isCheckingOut = false;
        state.checkoutSuccess = action.payload;
        state.cart = [];
        state.appliedCoupon = null;
        state.couponDiscountPercent = 0;
      })
      .addCase(checkoutCartAsync.rejected, (state, action) => {
        state.isCheckingOut = false;
        state.checkoutError = (action.payload as string) || 'Checkout failed';
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setPriceRange,
  setInStockOnly,
  setMinRating,
  applyCoupon,
  removeCoupon,
  clearCheckoutStatus,
  resetFilters,
} = shopSlice.actions;

export const shopReducer = shopSlice.reducer;

// -------------------------------------------------------------
// Selectors
// -------------------------------------------------------------

export const selectShop = (state: RootState) => state.shop;
export const selectProducts = (state: RootState) => state.shop.products;
export const selectCart = (state: RootState) => state.shop.cart;
export const selectWishlist = (state: RootState) => state.shop.wishlist;
export const selectIsWishlisted = (productId: string) => (state: RootState) =>
  state.shop.wishlist.includes(productId);

export const selectCartItemCount = (state: RootState): number => {
  return state.shop.cart.reduce((total, item) => total + item.quantity, 0);
};

export const selectCartSummary = (state: RootState): CartSummary => {
  const baseSummary = CartCalculator.calculateSummary(state.shop.cart);
  if (state.shop.couponDiscountPercent > 0 && baseSummary.subtotal > 0) {
    const couponExtraDiscount = Math.round(
      (baseSummary.subtotal * state.shop.couponDiscountPercent) / 100,
    );
    const finalTotal = Math.max(
      0,
      baseSummary.subtotal - (baseSummary.discount + couponExtraDiscount) + baseSummary.deliveryFee,
    );
    return {
      ...baseSummary,
      discount: baseSummary.discount + couponExtraDiscount,
      total: finalTotal,
    };
  }
  return baseSummary;
};
