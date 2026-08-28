/**
 * @file src/core/domain/shop/CartCalculator.ts
 * @description Pure calculation engine for shopping cart subtotals, item discounts, shipping thresholds, and totals.
 *
 * Invariants:
 * - Free shipping applies automatically when subtotal > ₹500 or cart is empty (₹0), otherwise ₹50.
 * - Total equals max(0, subtotal - discount + deliveryFee).
 * - Zero external framework dependencies; fully unit-tested domain service.
 */

import { CartItem } from './CartItem';

export interface CartSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}

export class CartCalculator {
  static calculateSummary(items: CartItem[]): CartSummary {
    let subtotal = 0;
    let totalDiscount = 0;
    let itemCount = 0;

    for (const item of items) {
      const originalItemTotal = item.product.price * item.quantity;
      const effectiveItemTotal = item.product.effectivePrice * item.quantity;

      subtotal += originalItemTotal;
      totalDiscount += (originalItemTotal - effectiveItemTotal);
      itemCount += item.quantity;
    }

    const deliveryFee = subtotal > 500 || subtotal === 0 ? 0 : 50;
    const total = Math.max(0, subtotal - totalDiscount + deliveryFee);

    return {
      subtotal,
      discount: totalDiscount,
      deliveryFee,
      total,
      itemCount,
    };
  }
}
