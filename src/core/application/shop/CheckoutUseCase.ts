import { ShopRepository } from '../../domain/shop/ShopRepository';
import { CartCalculator, CartSummary } from '../../domain/shop/CartCalculator';
import { ShopDomainError } from '../../domain/shop/ShopErrors';

export interface CheckoutResult {
  orderId: string;
  summary: CartSummary;
  placedAt: string;
}

export class CheckoutUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(): Promise<CheckoutResult> {
    const cartItems = await this.repository.getSavedCart();

    if (cartItems.length === 0) {
      throw new ShopDomainError('Cannot checkout an empty cart.');
    }

    const summary = CartCalculator.calculateSummary(cartItems);

    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Clear cart on successful order
    await this.repository.saveCart([]);

    return {
      orderId,
      summary,
      placedAt: new Date().toISOString(),
    };
  }
}
