/**
 * @file src/core/application/shop/RemoveFromCartUseCase.ts
 * @description Application use case to remove a specific item from the shopping cart.
 *
 * Invariants:
 * - Filters out the specified product ID and updates repository storage.
 */

import { ShopRepository } from '../../domain/shop/ShopRepository';
import { CartItem } from '../../domain/shop/CartItem';

export class RemoveFromCartUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(productId: string): Promise<CartItem[]> {
    const currentCart = await this.repository.getSavedCart();
    const filtered = currentCart.filter((i) => i.product.id !== productId);
    await this.repository.saveCart(filtered);
    return filtered;
  }
}
