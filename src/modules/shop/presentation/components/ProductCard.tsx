/**
 * @file src/modules/shop/presentation/components/ProductCard.tsx
 * @description High-performance, memoized Ayurvedic product card for FlashList virtualized feeds.
 *
 * Invariants:
 * - Uses React.memo for smooth 60–120 FPS scrolling over 20,000 items.
 * - Touch interactions utilize useNativeDriver spring animations.
 * - Displays discount badges, stock indicators, Ayurvedic ratings, and instant add-to-cart.
 */

import React, { useRef } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Product } from '../../../../core/domain/shop/Product';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import { Button } from '../../../../shared/components/Button';
import { Badge } from '../../../../shared/components/Badge';
import {
  StarIcon,
  HeartIcon,
  CartIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  quantityInCart: number;
  onPress: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = React.memo(
  ({
    product,
    isWishlisted,
    quantityInCart,
    onPress,
    onAddToCart,
    onToggleWishlist,
  }) => {
    const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 4,
      }).start();
    };

    const hasDiscount =
      product.discountPrice !== undefined && product.discountPrice < product.price;
    const discountPercent = hasDiscount
      ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
      : 0;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: borderRadius.lg,
          },
        ]}
      >
        <Pressable
          onPress={() => onPress(product)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.innerPressable}
        >
          {/* Product Image & Wishlist Button */}
          <View style={[styles.imageWrapper, { backgroundColor: isDark ? '#1C2E24' : '#F0F7F4' }]}>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.productImage}
              resizeMode="cover"
            />

            {/* Discount Badge */}
            {hasDiscount && (
              <View
                style={[
                  styles.discountBadge,
                  {
                    backgroundColor: colors.accent,
                    borderRadius: borderRadius.sm,
                  },
                ]}
              >
                <Text style={styles.discountBadgeText}>{discountPercent}% OFF</Text>
              </View>
            )}

            {/* Wishlist Heart Button */}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              style={[
                styles.wishlistButton,
                {
                  backgroundColor: isDark ? 'rgba(20,30,25,0.85)' : 'rgba(255,255,255,0.9)',
                },
              ]}
              hitSlop={8}
            >
              <HeartIcon
                size={18}
                color={isWishlisted ? colors.error : colors.textMuted}
                filled={isWishlisted}
              />
            </Pressable>
          </View>

          {/* Details Section */}
          <View style={[styles.details, { padding: spacing.md }]}>
            {/* Category */}
            <Text
              style={[
                styles.categoryText,
                { color: colors.primary, fontSize: typography.caption.fontSize },
              ]}
              numberOfLines={1}
            >
              {product.category}
            </Text>

            {/* Product Title */}
            <Text
              style={[
                styles.nameText,
                { color: colors.text, fontSize: typography.body.fontSize },
              ]}
              numberOfLines={2}
            >
              {product.name}
            </Text>

            {/* Rating Row */}
            <View style={styles.ratingRow}>
              <StarIcon size={14} color="#D4A373" />
              <Text
                style={[
                  styles.ratingText,
                  { color: colors.text, fontSize: typography.caption.fontSize },
                ]}
              >
                {product.rating.toFixed(1)}
              </Text>
              <Text
                style={[
                  styles.reviewCountText,
                  { color: colors.textMuted, fontSize: typography.caption.fontSize },
                ]}
              >
                ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
              </Text>
            </View>

            {/* Price & Action Row */}
            <View style={styles.priceActionRow}>
              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text
                    style={[
                      styles.priceText,
                      { color: colors.primary, fontSize: typography.h3.fontSize },
                    ]}
                  >
                    ₹{product.effectivePrice}
                  </Text>
                  {hasDiscount && (
                    <Text
                      style={[
                        styles.originalPriceText,
                        { color: colors.textMuted, fontSize: typography.caption.fontSize },
                      ]}
                    >
                      ₹{product.price}
                    </Text>
                  )}
                </View>

                {!product.inStock && (
                  <Text style={[styles.outOfStockText, { color: colors.error }]}>
                    Out of Stock
                  </Text>
                )}
              </View>

              {/* Add to Cart Button */}
              {product.inStock && (
                <View style={styles.buttonWrapper}>
                  {quantityInCart > 0 ? (
                    <View
                      style={[
                        styles.inCartBadge,
                        {
                          backgroundColor: isDark ? '#1E3A2F' : '#E8F5E9',
                          borderColor: colors.primary,
                          borderRadius: borderRadius.md,
                        },
                      ]}
                    >
                      <CartIcon size={14} color={colors.primary} />
                      <Text style={[styles.inCartText, { color: colors.primary }]}>
                        {quantityInCart} in Cart
                      </Text>
                    </View>
                  ) : (
                    <Button
                      title="Add"
                      variant="outline"
                      size="sm"
                      onPress={() => onAddToCart(product)}
                      leftIcon={<CartIcon size={14} color={colors.primary} />}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.discountPrice === nextProps.product.discountPrice &&
      prevProps.isWishlisted === nextProps.isWishlisted &&
      prevProps.quantityInCart === nextProps.quantityInCart
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  innerPressable: {
    flexDirection: 'row',
  },
  imageWrapper: {
    width: 110,
    minHeight: 130,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  wishlistButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  categoryText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  nameText: {
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontWeight: '700',
    marginLeft: 4,
  },
  reviewCountText: {
    marginLeft: 3,
  },
  priceActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontWeight: '700',
    marginRight: 6,
  },
  originalPriceText: {
    textDecorationLine: 'line-through',
  },
  outOfStockText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  buttonWrapper: {
    marginLeft: 8,
  },
  inCartBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
  },
  inCartText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
});
