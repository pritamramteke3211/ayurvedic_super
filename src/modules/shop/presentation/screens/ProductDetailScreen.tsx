/**
 * @file src/modules/shop/presentation/screens/ProductDetailScreen.tsx
 * @description Comprehensive product specification screen displaying Ayurvedic ingredients, benefits, and sticky CTA.
 *
 * Invariants:
 * - Implements 4 UI states (Loading Skeleton, Error with Retry, Product Data).
 * - Sticky bottom purchase bar for instant quantity adjustments and cart synchronization.
 */

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch, useAppSelector } from '../../../../app/state/hooks';
import {
  fetchProductById,
  addToCartAsync,
  updateCartQuantityAsync,
  toggleWishlistAsync,
  selectShop,
  selectIsWishlisted,
} from '../../../../app/state/shopSlice';
import { ShopStackParamList } from '../../../../app/navigation/type';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { Button } from '../../../../shared/components/Button';
import { Badge } from '../../../../shared/components/Badge';
import { Skeleton } from '../../../../shared/components/Skeleton';
import { ErrorView } from '../../../../shared/components/ErrorView';
import {
  StarIcon,
  HeartIcon,
  LeafIcon,
  ShieldVerifiedIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  CartIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

type ScreenRouteProp = RouteProp<ShopStackParamList, 'ProductDetails'>;
type NavigationProp = StackNavigationProp<ShopStackParamList, 'ProductDetails'>;

export const ProductDetailScreen: React.FC = () => {
  const route = useRoute<ScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();

  const { productId } = route.params;
  const shopState = useAppSelector(selectShop);
  const isWishlisted = useAppSelector(selectIsWishlisted(productId));
  const product = shopState.selectedProduct;

  const [quantity, setQuantity] = useState(1);

  // Check if item is already in cart
  const cartItem = shopState.cart.find((item) => item.product.id === productId);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const handleToggleWishlist = () => {
    dispatch(toggleWishlistAsync(productId));
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCartAsync({ productId: product.id, quantity }));
  };

  const handleIncrementCart = () => {
    if (!product) return;
    if (quantityInCart < product.stockCount) {
      dispatch(
        updateCartQuantityAsync({
          productId: product.id,
          quantity: quantityInCart + 1,
        }),
      );
    }
  };

  const handleDecrementCart = () => {
    if (!product) return;
    dispatch(
      updateCartQuantityAsync({
        productId: product.id,
        quantity: quantityInCart - 1,
      }),
    );
  };

  // 1. Loading State
  if (shopState.isLoadingProductDetails) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <Skeleton width="100%" height={320} borderRadius={0} />
        <View style={{ padding: spacing.lg }}>
          <Skeleton width="30%" height={16} borderRadius={4} style={{ marginBottom: 12 }} />
          <Skeleton width="90%" height={24} borderRadius={4} style={{ marginBottom: 12 }} />
          <Skeleton width="50%" height={20} borderRadius={4} style={{ marginBottom: 20 }} />
          <Skeleton width="100%" height={80} borderRadius={8} style={{ marginBottom: 20 }} />
          <Skeleton width="100%" height={120} borderRadius={8} />
        </View>
      </View>
    );
  }

  // 2. Error State
  if (shopState.productDetailsError || !product) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <ErrorView
          title="Product Unavailable"
          message={shopState.productDetailsError || 'Unable to retrieve product details.'}
          onRetry={() => dispatch(fetchProductById(productId))}
        />
      </View>
    );
  }

  const hasDiscount =
    product.discountPrice !== undefined && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero Image */}
        <View style={[styles.imageContainer, { backgroundColor: isDark ? '#1C2E24' : '#F0F7F4' }]}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Top Bar Floating Buttons */}
          <View style={styles.floatingTopBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.iconCircleBtn,
                {
                  backgroundColor: isDark ? 'rgba(20,30,25,0.85)' : 'rgba(255,255,255,0.9)',
                },
              ]}
              hitSlop={8}
            >
              <Text style={[styles.backArrowText, { color: colors.text }]}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleToggleWishlist}
              style={[
                styles.iconCircleBtn,
                {
                  backgroundColor: isDark ? 'rgba(20,30,25,0.85)' : 'rgba(255,255,255,0.9)',
                },
              ]}
              hitSlop={8}
            >
              <HeartIcon
                size={20}
                color={isWishlisted ? colors.error : colors.text}
                filled={isWishlisted}
              />
            </TouchableOpacity>
          </View>

          {/* Discount Badge */}
          {hasDiscount && (
            <View
              style={[
                styles.discountPill,
                { backgroundColor: colors.accent, borderRadius: borderRadius.sm },
              ]}
            >
              <Text style={styles.discountPillText}>{discountPercent}% SPECIAL DISCOUNT</Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View
          style={[
            styles.detailsContainer,
            {
              backgroundColor: colors.card,
              borderTopLeftRadius: borderRadius.xl,
              borderTopRightRadius: borderRadius.xl,
              padding: spacing.lg,
            },
          ]}
        >
          {/* Category & Stock Row */}
          <View style={styles.categoryRow}>
            <Text
              style={[
                styles.categoryText,
                { color: colors.primary, fontSize: typography.caption.fontSize },
              ]}
            >
              {product.category}
            </Text>
            <View
              style={[
                styles.stockBadge,
                {
                  backgroundColor: product.inStock
                    ? isDark
                      ? '#1C3829'
                      : '#E8F5E9'
                    : isDark
                    ? '#3A1E1E'
                    : '#FFEBEE',
                  borderRadius: borderRadius.sm,
                },
              ]}
            >
              <Text
                style={[
                  styles.stockBadgeText,
                  { color: product.inStock ? colors.primary : colors.error },
                ]}
              >
                {product.inStock ? `In Stock (${product.stockCount} left)` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Product Title */}
          <Text
            style={[
              styles.productTitle,
              { color: colors.text, fontSize: typography.h2.fontSize },
            ]}
          >
            {product.name}
          </Text>

          {/* Rating & Verified Trust Row */}
          <View style={styles.ratingTrustRow}>
            <View style={styles.ratingChip}>
              <StarIcon size={16} color="#D4A373" />
              <Text
                style={[
                  styles.ratingNumber,
                  { color: colors.text, fontSize: typography.body.fontSize },
                ]}
              >
                {product.rating.toFixed(1)}
              </Text>
              <Text
                style={[
                  styles.reviewsText,
                  { color: colors.textMuted, fontSize: typography.caption.fontSize },
                ]}
              >
                ({product.reviewCount} reviews)
              </Text>
            </View>

            <View style={styles.verifiedRow}>
              <ShieldVerifiedIcon size={16} color={colors.primary} />
              <Text
                style={[
                  styles.verifiedText,
                  { color: colors.primary, fontSize: typography.caption.fontSize },
                ]}
              >
                100% Certified Authentic
              </Text>
            </View>
          </View>

          {/* Pricing Row */}
          <View
            style={[
              styles.pricingBox,
              {
                backgroundColor: isDark ? '#1C2E24' : '#F5FAF7',
                borderColor: colors.border,
                borderRadius: borderRadius.md,
                padding: spacing.md,
              },
            ]}
          >
            <View style={styles.priceRow}>
              <Text
                style={[
                  styles.effectivePrice,
                  { color: colors.primary, fontSize: typography.h1.fontSize },
                ]}
              >
                ₹{product.effectivePrice}
              </Text>
              {hasDiscount && (
                <Text
                  style={[
                    styles.strikethroughPrice,
                    { color: colors.textMuted, fontSize: typography.h3.fontSize },
                  ]}
                >
                  ₹{product.price}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.inclusiveTax,
                { color: colors.textMuted, fontSize: typography.caption.fontSize },
              ]}
            >
              Inclusive of all taxes • Free delivery above ₹500
            </Text>
          </View>

          {/* Key Herbal Ingredients */}
          <View style={styles.sectionBlock}>
            <View style={styles.sectionHeaderRow}>
              <LeafIcon size={18} color={colors.primary} />
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, fontSize: typography.h3.fontSize },
                ]}
              >
                Key Ayurvedic Botanicals
              </Text>
            </View>
            <View style={styles.ingredientChipsWrap}>
              {product.ingredients.map((ing) => (
                <View
                  key={ing}
                  style={[
                    styles.ingredientChip,
                    {
                      backgroundColor: isDark ? '#1F3A2D' : '#E8F5E9',
                      borderColor: colors.primary,
                      borderRadius: borderRadius.round,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.ingredientChipText,
                      { color: colors.primary, fontSize: typography.caption.fontSize },
                    ]}
                  >
                    🌿 {ing}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Therapeutic Benefits */}
          <View style={styles.sectionBlock}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: typography.h3.fontSize },
              ]}
            >
              Therapeutic Benefits
            </Text>
            {product.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <CheckCircleIcon size={16} color={colors.primary} />
                <Text
                  style={[
                    styles.benefitText,
                    { color: colors.text, fontSize: typography.body.fontSize },
                  ]}
                >
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          {/* Formulation & Usage Description */}
          <View style={styles.sectionBlock}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontSize: typography.h3.fontSize },
              ]}
            >
              About the Formulation
            </Text>
            <Text
              style={[
                styles.descriptionText,
                { color: colors.text, fontSize: typography.body.fontSize },
              ]}
            >
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Action Bar */}
      <View
        style={[
          styles.stickyBottomBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
          },
        ]}
      >
        {quantityInCart > 0 ? (
          <View style={styles.inCartActionRow}>
            {/* Quantity Stepper in Bottom Bar */}
            <View
              style={[
                styles.bottomStepper,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleDecrementCart}
                hitSlop={8}
                style={styles.stepperBtn}
              >
                <MinusIcon size={16} color={colors.text} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.stepperQtyText,
                  { color: colors.text, fontSize: typography.body.fontSize },
                ]}
              >
                {quantityInCart}
              </Text>
              <TouchableOpacity
                onPress={handleIncrementCart}
                disabled={quantityInCart >= product.stockCount}
                hitSlop={8}
                style={styles.stepperBtn}
              >
                <PlusIcon
                  size={16}
                  color={
                    quantityInCart >= product.stockCount
                      ? colors.textMuted
                      : colors.primary
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Go to Cart CTA */}
            <View style={styles.ctaButtonWrapper}>
              <Button
                title="View in Cart"
                variant="primary"
                onPress={() => navigation.navigate('Cart')}
                leftIcon={<CartIcon size={18} color="#FFFFFF" />}
                fullWidth
              />
            </View>
          </View>
        ) : (
          <View style={styles.addCartActionRow}>
            <View>
              <Text
                style={[
                  styles.footerTotalLabel,
                  { color: colors.textMuted, fontSize: typography.caption.fontSize },
                ]}
              >
                Total Price
              </Text>
              <Text
                style={[
                  styles.footerTotalPrice,
                  { color: colors.primary, fontSize: typography.h2.fontSize },
                ]}
              >
                ₹{product.effectivePrice * quantity}
              </Text>
            </View>

            <View style={styles.addToCartWrapper}>
              <Button
                title={product.inStock ? 'Add to Cart' : 'Out of Stock'}
                disabled={!product.inStock}
                variant="primary"
                onPress={handleAddToCart}
                leftIcon={<CartIcon size={18} color="#FFFFFF" />}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingTopBar: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  iconCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  backArrowText: {
    fontSize: 20,
    fontWeight: '700',
  },
  discountPill: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detailsContainer: {
    marginTop: -20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  productTitle: {
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 10,
  },
  ratingTrustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontWeight: '700',
    marginLeft: 4,
  },
  reviewsText: {
    marginLeft: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedText: {
    fontWeight: '600',
    marginLeft: 4,
  },
  pricingBox: {
    borderWidth: 1,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  effectivePrice: {
    fontWeight: '800',
    marginRight: 10,
  },
  strikethroughPrice: {
    textDecorationLine: 'line-through',
  },
  inclusiveTax: {
    fontWeight: '500',
  },
  sectionBlock: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: '700',
    marginLeft: 6,
  },
  ingredientChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientChip: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ingredientChipText: {
    fontWeight: '600',
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  benefitText: {
    flex: 1,
    marginLeft: 8,
    lineHeight: 20,
  },
  descriptionText: {
    lineHeight: 22,
    marginTop: 6,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  inCartActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  stepperBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperQtyText: {
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  ctaButtonWrapper: {
    flex: 1,
  },
  addCartActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerTotalLabel: {
    fontWeight: '500',
  },
  footerTotalPrice: {
    fontWeight: '800',
  },
  addToCartWrapper: {
    minWidth: 160,
  },
});
