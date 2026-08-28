/**
 * @file src/core/application/shop/UpdateCartQuantityUseCase.ts
 * @description Application use case to update the quantity of an item within the shopping cart.
 *
 * Invariants:
 * - Enforces minimum quantity of 1 (quantities <= 0 throw InvalidQuantityError).
 * - Caps target quantity to the product's available stockCount.
 * - Persists modified cart state to repository.
 */

import { ShopRepository } from '../../domain/shop/ShopRepository';
import { CartItem } from '../../domain/shop/CartItem';
import { InvalidQuantityError } from '../../domain/shop/ShopErrors';

export class UpdateCartQuantityUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(productId: string, quantity: number): Promise<CartItem[]> {
    if (quantity <= 0) {
      throw new InvalidQuantityError('Quantity must be greater than zero. To remove an item, use RemoveFromCart.');
    }

    const currentCart = await this.repository.getSavedCart();
    const item = currentCart.find((i) => i.product.id === productId);

    if (item) {
      const cappedQuantity = Math.min(item.product.stockCount, quantity);
      item.updateQuantity(cappedQuantity);
      await this.repository.saveCart(currentCart);
    }

    return currentCart;
  }
}
