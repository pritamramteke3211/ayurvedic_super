/**
 * @file src/core/application/shop/ToggleWishlistUseCase.ts
 * @description Application use case to toggle a product's presence in the user's wishlist.
 *
 * Invariants:
 * - Returns boolean flag indicating whether the product is now wishlisted (true) or un-wishlisted (false).
 */

import { ShopRepository } from '../../domain/shop/ShopRepository';

export class ToggleWishlistUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(productId: string): Promise<boolean> {
    return this.repository.toggleWishlist(productId);
  }
}
