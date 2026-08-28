/**
 * @file src/core/application/shop/GetWishlistUseCase.ts
 * @description Application use case to fetch the user's wishlisted product ID collection.
 *
 * Invariants:
 * - Returns string array of product IDs persisted in storage.
 */

import { ShopRepository } from '../../domain/shop/ShopRepository';

export class GetWishlistUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(): Promise<string[]> {
    return this.repository.getWishlist();
  }
}
