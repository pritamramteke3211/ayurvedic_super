/**
 * @file src/modules/shop/presentation/screens/ProductListScreen.tsx
 * @description 20,000 Ayurvedic products feed with FlashList virtualization, debounced search, and multi-filters.
 *
 * Invariants:
 * - Implements 4 explicit UI states: Loading (Skeleton), Empty (EmptyState), Error (ErrorView + Retry), Data (FlashList).
 * - High-speed infinite scroll pagination over 20,000 virtualized items.
 * - Floating cart FAB displays real-time cart item counts and navigates to CartScreen.
 */

import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../../../app/state/hooks';
import {
  fetchProducts,
  fetchMoreProducts,
  hydrateCartAndWishlist,
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setPriceRange,
  setInStockOnly,
  setMinRating,
  resetFilters,
  addToCartAsync,
  toggleWishlistAsync,
  selectShop,
  selectCartItemCount,
} from '../../../../app/state/shopSlice';
import { ShopStackParamList } from '../../../../app/navigation/type';
import { Product } from '../../../../core/domain/shop/Product';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { ProductCard } from '../components/ProductCard';
import { CategoryFilterChips } from '../components/CategoryFilterChips';
import { SortFilterModal, FilterStateValues } from '../components/SortFilterModal';
import { Skeleton } from '../../../../shared/components/Skeleton';
import { EmptyState } from '../../../../shared/components/EmptyState';
import { ErrorView } from '../../../../shared/components/ErrorView';
import {
  SearchLensIcon,
  FilterIcon,
  CartIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

type NavigationProp = StackNavigationProp<ShopStackParamList, 'ProductList'>;

export const ProductListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();

  const shopState = useAppSelector(selectShop);
  const cartItemCount = useAppSelector(selectCartItemCount);

  const [localSearch, setLocalSearch] = useState(shopState.searchQuery);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial load
  useEffect(() => {
    dispatch(hydrateCartAndWishlist());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Debounced search
  const handleSearchChange = (text: string) => {
    setLocalSearch(text);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      dispatch(setSearchQuery(text));
      dispatch(fetchProducts());
    }, 300);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    dispatch(setSearchQuery(''));
    dispatch(fetchProducts());
  };

  const handleSelectCategory = (category: string) => {
    dispatch(setSelectedCategory(category));
    dispatch(fetchProducts());
  };

  const handleApplyFilters = (filters: FilterStateValues) => {
    dispatch(setSortBy(filters.sortBy));
    dispatch(
      setPriceRange({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      }),
    );
    dispatch(setInStockOnly(filters.inStockOnly));
    dispatch(setMinRating(filters.minRating));
    dispatch(fetchProducts());
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
    setLocalSearch('');
    dispatch(fetchProducts());
  };

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetails', { productId: product.id });
    },
    [navigation],
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCartAsync({ productId: product.id, quantity: 1 }));
    },
    [dispatch],
  );

  const handleToggleWishlist = useCallback(
    (product: Product) => {
      dispatch(toggleWishlistAsync(product.id));
    },
    [dispatch],
  );

  const activeFiltersCount = [
    shopState.sortBy !== 'popular',
    shopState.minPrice !== undefined || shopState.maxPrice !== undefined,
    shopState.inStockOnly,
    shopState.minRating !== undefined,
  ].filter(Boolean).length;

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => {
      const isWishlisted = shopState.wishlist.includes(item.id);
      const cartItem = shopState.cart.find((ci) => ci.product.id === item.id);
      const quantityInCart = cartItem ? cartItem.quantity : 0;

      return (
        <ProductCard
          product={item}
          isWishlisted={isWishlisted}
          quantityInCart={quantityInCart}
          onPress={handleProductPress}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
        />
      );
    },
    [
      shopState.wishlist,
      shopState.cart,
      handleProductPress,
      handleAddToCart,
      handleToggleWishlist,
    ],
  );

  const renderFooter = () => {
    if (!shopState.isLoadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text
          style={[
            styles.loadingMoreText,
            { color: colors.textMuted, fontSize: typography.caption.fontSize },
          ]}
        >
          Loading more Ayurvedic formulations...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header & Search Bar */}
      <View
        style={[
          styles.headerSection,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View>
            <Text
              style={[
                styles.title,
                { color: colors.text, fontSize: typography.h2.fontSize },
              ]}
            >
              Ayurvedic Shop
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.textMuted, fontSize: typography.caption.fontSize },
              ]}
            >
              20,000+ Pure Herbal Formulations & Oils
            </Text>
          </View>

          {/* Header Cart Icon with Badge */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={[
              styles.headerCartBtn,
              {
                backgroundColor: isDark ? '#1C2E24' : '#F0F7F4',
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <CartIcon size={20} color={colors.primary} />
            {cartItemCount > 0 && (
              <View
                style={[
                  styles.headerBadge,
                  { backgroundColor: colors.accent, borderRadius: borderRadius.round },
                ]}
              >
                <Text style={styles.headerBadgeText}>
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Input & Filter Button */}
        <View style={styles.searchFilterRow}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <SearchLensIcon size={18} color={colors.textMuted} />
            <TextInput
              value={localSearch}
              onChangeText={handleSearchChange}
              placeholder="Search formulations, herbs, doshas..."
              placeholderTextColor={colors.textMuted}
              style={[
                styles.searchInput,
                { color: colors.text, fontSize: typography.body.fontSize },
              ]}
            />
            {localSearch.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} hitSlop={8}>
                <Text style={[styles.clearBtn, { color: colors.textMuted }]}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setIsFilterModalVisible(true)}
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFiltersCount > 0 ? colors.primary : colors.background,
                borderColor: colors.border,
                borderRadius: borderRadius.md,
              },
            ]}
          >
            <FilterIcon
              size={18}
              color={activeFiltersCount > 0 ? '#FFFFFF' : colors.primary}
            />
            {activeFiltersCount > 0 && (
              <View style={styles.filterCountBadge}>
                <Text style={styles.filterCountText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Category Filter Chips */}
        <CategoryFilterChips
          selectedCategory={shopState.selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </View>

      {/* 4 Explicit UI States */}

      {/* 1. Initial Loading State (Skeletons) */}
      {shopState.isLoadingProducts && !shopState.isRefreshing && (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.skeletonCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: borderRadius.lg,
                  padding: spacing.md,
                  marginHorizontal: spacing.md,
                  marginVertical: spacing.xs,
                },
              ]}
            >
              <View style={styles.skeletonRow}>
                <Skeleton width={90} height={100} borderRadius={8} />
                <View style={styles.skeletonDetails}>
                  <Skeleton width="40%" height={12} borderRadius={4} style={{ marginBottom: 8 }} />
                  <Skeleton width="85%" height={16} borderRadius={4} style={{ marginBottom: 8 }} />
                  <Skeleton width="30%" height={12} borderRadius={4} style={{ marginBottom: 12 }} />
                  <Skeleton width="50%" height={20} borderRadius={4} />
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 2. Error State */}
      {!shopState.isLoadingProducts && shopState.productError && (
        <ErrorView
          title="Catalog Load Failed"
          message={shopState.productError}
          onRetry={() => dispatch(fetchProducts())}
        />
      )}

      {/* 3. Empty State */}
      {!shopState.isLoadingProducts &&
        !shopState.productError &&
        shopState.products.length === 0 && (
          <EmptyState
            title="No Products Found"
            description="No Ayurvedic remedies match your current search or filters. Try adjusting criteria."
            actionTitle="Reset All Filters"
            onActionPress={handleResetFilters}
          />
        )}

      {/* 4. Data State (FlashList Virtualized Feed) */}
      {!shopState.isLoadingProducts &&
        !shopState.productError &&
        shopState.products.length > 0 && (
          <FlashList
            data={shopState.products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            onEndReached={() => dispatch(fetchMoreProducts())}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={shopState.isRefreshing}
                onRefresh={() => dispatch(fetchProducts({ refresh: true }))}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
          />
        )}

      {/* Filter & Sort Bottom Sheet Modal */}
      <SortFilterModal
        visible={isFilterModalVisible}
        initialFilters={{
          sortBy: shopState.sortBy,
          minPrice: shopState.minPrice,
          maxPrice: shopState.maxPrice,
          inStockOnly: shopState.inStockOnly,
          minRating: shopState.minRating,
        }}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  headerSection: {
    borderBottomWidth: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 2,
    fontWeight: '500',
  },
  headerCartBtn: {
    width: 42,
    height: 42,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  searchFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    paddingVertical: 0,
  },
  clearBtn: {
    fontSize: 14,
    paddingHorizontal: 6,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D4A373',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterCountText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  listContent: {
    paddingVertical: 8,
  },
  loadingMoreContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingMoreText: {
    marginTop: 6,
    fontWeight: '500',
  },
  skeletonContainer: {
    paddingTop: 8,
  },
  skeletonCard: {
    borderWidth: 1,
  },
  skeletonRow: {
    flexDirection: 'row',
  },
  skeletonDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
});
