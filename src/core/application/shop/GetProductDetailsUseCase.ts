/**
 * @file src/core/application/shop/GetProductDetailsUseCase.ts
 * @description Application use case to fetch the complete domain details for a specified product ID.
 *
 * Invariants:
 * - Throws ProductNotFoundError if the product is not found in the repository.
 */

import { ShopRepository } from '../../domain/shop/ShopRepository';
import { Product } from '../../domain/shop/Product';
import { ProductNotFoundError } from '../../domain/shop/ShopErrors';

export class GetProductDetailsUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(productId: string): Promise<Product> {
    const product = await this.repository.getProductById(productId);
    if (!product) {
      throw new ProductNotFoundError(productId);
    }
    return product;
  }
}
