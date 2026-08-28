/**
 * @file src/modules/shop/presentation/components/CartItemRow.tsx
 * @description Interactive cart item tile with quantity stepper and stock boundary validation.
 *
 * Invariants:
 * - Emits quantity updates and removals immediately.
 * - Prevents quantity increments beyond product.stockCount.
 */

import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CartItem } from '../../../../core/domain/shop/CartItem';
import { useAppTheme } from '../../../../app/theme/useAppTheme';
import {
  PlusIcon,
  MinusIcon,
  TrashIcon,
} from '../../../../shared/components/icons/AyurvedicIcons';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: (productId: string, currentQty: number) => void;
  onDecrement: (productId: string, currentQty: number) => void;
  onRemove: (productId: string) => void;
  onPress: (productId: string) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onPress,
}) => {
  const { colors, spacing, borderRadius, typography, isDark } = useAppTheme();
  const { product, quantity } = item;

  const itemTotal = product.effectivePrice * quantity;
  const isMaxStockReached = quantity >= product.stockCount;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: borderRadius.lg,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
      ]}
    >
      <Pressable
        onPress={() => onPress(product.id)}
        style={styles.innerContent}
      >
        {/* Product Image */}
        <Image
          source={{ uri: product.imageUrl }}
          style={[
            styles.image,
            {
              borderRadius: borderRadius.md,
              backgroundColor: isDark ? '#1C2E24' : '#F0F7F4',
            },
          ]}
          resizeMode="cover"
        />

        {/* Info */}
        <View style={styles.infoCol}>
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.categoryText,
                { color: colors.primary, fontSize: typography.caption.fontSize },
              ]}
              numberOfLines={1}
            >
              {product.category}
            </Text>

            {/* Remove / Trash */}
            <TouchableOpacity
              onPress={() => onRemove(product.id)}
              hitSlop={8}
              style={styles.removeBtn}
            >
              <TrashIcon size={16} color={colors.error} />
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.productName,
              { color: colors.text, fontSize: typography.body.fontSize },
            ]}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Unit Price */}
          <View style={styles.unitPriceRow}>
            <Text
              style={[
                styles.unitPrice,
                { color: colors.text, fontSize: typography.caption.fontSize },
              ]}
            >
              ₹{product.effectivePrice} each
            </Text>
            {product.discountPrice && (
              <Text
                style={[
                  styles.originalPrice,
                  { color: colors.textMuted, fontSize: typography.caption.fontSize },
                ]}
              >
                ₹{product.price}
              </Text>
            )}
          </View>

          {/* Stepper and Item Total */}
          <View style={styles.bottomRow}>
            {/* Stepper */}
            <View
              style={[
                styles.stepperContainer,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  borderRadius: borderRadius.md,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  if (quantity > 1) {
                    onDecrement(product.id, quantity);
                  } else {
                    onRemove(product.id);
                  }
                }}
                hitSlop={6}
                style={styles.stepperBtn}
              >
                {quantity === 1 ? (
                  <TrashIcon size={13} color={colors.error} />
                ) : (
                  <MinusIcon size={13} color={colors.text} />
                )}
              </TouchableOpacity>

              <Text
                style={[
                  styles.quantityText,
                  { color: colors.text, fontSize: typography.body.fontSize },
                ]}
              >
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (!isMaxStockReached) {
                    onIncrement(product.id, quantity);
                  }
                }}
                disabled={isMaxStockReached}
                hitSlop={6}
                style={[styles.stepperBtn, isMaxStockReached && styles.disabledBtn]}
              >
                <PlusIcon
                  size={13}
                  color={isMaxStockReached ? colors.textMuted : colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Item Total */}
            <Text
              style={[
                styles.itemTotalText,
                { color: colors.primary, fontSize: typography.h3.fontSize },
              ]}
            >
              ₹{itemTotal}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
  },
  innerContent: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  removeBtn: {
    padding: 2,
  },
  productName: {
    fontWeight: '600',
    lineHeight: 18,
    marginVertical: 2,
  },
  unitPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  unitPrice: {
    fontWeight: '600',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    marginLeft: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  stepperBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.3,
  },
  quantityText: {
    fontWeight: '700',
    minWidth: 20,
    textAlign: 'center',
  },
  itemTotalText: {
    fontWeight: '700',
  },
});
