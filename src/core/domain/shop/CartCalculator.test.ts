/**
 * @file src/core/domain/shop/CartCalculator.test.ts
 * @description Unit tests for pure CartCalculator domain logic.
 *
 * Invariants:
 * - Subtotal is calculated from original product prices * quantity.
 * - Discount is calculated from the difference between original and discount price * quantity.
 * - Delivery fee is waived (₹0) when subtotal > ₹500 or cart is empty, otherwise ₹50.
 * - Total is never negative and accurately reflects subtotal - discount + deliveryFee.
 */

import { CartCalculator } from './CartCalculator';
import { CartItem } from './CartItem';
import { Product } from './Product';

describe('CartCalculator Domain Engine', () => {
  const createMockProduct = (id: string, price: number, discountPrice?: number): Product => {
    return new Product({
      id,
      name: `Ayurvedic Product ${id}`,
      category: 'Immunity',
      price,
      discountPrice,
      rating: 4.8,
      reviewCount: 120,
      imageUrl: 'https://example.com/product.jpg',
      description: 'Herbal immunity booster',
      inStock: true,
      stockCount: 10,
      ingredients: ['Ashwagandha', 'Amla'],
      benefits: ['Boosts energy', 'Enhances immunity'],
    });
  };

  it('should return 0 for all fields when cart is empty', () => {
    const summary = CartCalculator.calculateSummary([]);

    expect(summary.subtotal).toBe(0);
    expect(summary.discount).toBe(0);
    expect(summary.deliveryFee).toBe(0);
    expect(summary.total).toBe(0);
    expect(summary.itemCount).toBe(0);
  });

  it('should calculate correct subtotal and apply delivery fee when subtotal is under ₹500', () => {
    const product = createMockProduct('p1', 300);
    const item = new CartItem({ product, quantity: 1 });

    const summary = CartCalculator.calculateSummary([item]);

    expect(summary.subtotal).toBe(300);
    expect(summary.discount).toBe(0);
    expect(summary.deliveryFee).toBe(50);
    expect(summary.total).toBe(350);
    expect(summary.itemCount).toBe(1);
  });

  it('should waive delivery fee when subtotal exceeds ₹500', () => {
    const product = createMockProduct('p2', 600);
    const item = new CartItem({ product, quantity: 1 });

    const summary = CartCalculator.calculateSummary([item]);

    expect(summary.subtotal).toBe(600);
    expect(summary.discount).toBe(0);
    expect(summary.deliveryFee).toBe(0);
    expect(summary.total).toBe(600);
    expect(summary.itemCount).toBe(1);
  });

  it('should correctly calculate discounts for discounted items', () => {
    const product = createMockProduct('p3', 400, 350); // ₹50 discount per unit
    const item = new CartItem({ product, quantity: 2 }); // total discount = ₹100, subtotal = ₹800

    const summary = CartCalculator.calculateSummary([item]);

    expect(summary.subtotal).toBe(800);
    expect(summary.discount).toBe(100);
    expect(summary.deliveryFee).toBe(0); // subtotal 800 > 500
    expect(summary.total).toBe(700); // 800 - 100 + 0
    expect(summary.itemCount).toBe(2);
  });

  it('should handle multi-item carts with mixed quantities and discounts', () => {
    const p1 = createMockProduct('p1', 200, 180); // ₹20 off each, qty 2 -> sub 400, disc 40
    const p2 = createMockProduct('p2', 150); // no discount, qty 1 -> sub 150, disc 0
    // Total subtotal = 550 (>500 -> free delivery), discount = 40, total = 510

    const items = [
      new CartItem({ product: p1, quantity: 2 }),
      new CartItem({ product: p2, quantity: 1 }),
    ];

    const summary = CartCalculator.calculateSummary(items);

    expect(summary.subtotal).toBe(550);
    expect(summary.discount).toBe(40);
    expect(summary.deliveryFee).toBe(0);
    expect(summary.total).toBe(510);
    expect(summary.itemCount).toBe(3);
  });
});
