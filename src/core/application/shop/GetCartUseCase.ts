/**
 * @file src/core/application/shop/GetCartUseCase.ts
 * @description Application use case to retrieve the persisted shopping cart.
 *
 * Invariants:
 * - Returns an array of CartItem domain models restored from repository storage.
 */

import { ShopRepository } from '../../domain/shop/ShopRepository';
import { CartItem } from '../../domain/shop/CartItem';

export class GetCartUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(): Promise<CartItem[]> {
    return this.repository.getSavedCart();
  }
}
