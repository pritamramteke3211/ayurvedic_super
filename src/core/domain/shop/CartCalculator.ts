import { CartItem } from './CartItem';
import { Product } from './Product';

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
