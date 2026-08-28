/**
 * @file src/core/application/shop/GetProductsUseCase.ts
 * @description Application use case to fetch paginated and multi-filtered Ayurvedic products from the catalog.
 *
 * Invariants:
 * - Delegates searching, multi-criteria filtering, and sorting to the repository layer.
 * - Returns PaginatedResult<Product> preserving domain encapsulation.
 */

import { ShopRepository, ProductFilterCriteria } from '../../domain/shop/ShopRepository';
import { Product } from '../../domain/shop/Product';
import { PaginatedResult, PaginationParams } from '../../types/common';

export class GetProductsUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(params: PaginationParams & { filters?: ProductFilterCriteria }): Promise<PaginatedResult<Product>> {
    return this.repository.getProducts(params);
  }
}
