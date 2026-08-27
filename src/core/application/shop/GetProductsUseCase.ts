import { ShopRepository, ProductFilterCriteria } from '../../domain/shop/ShopRepository';
import { Product } from '../../domain/shop/Product';
import { PaginatedResult, PaginationParams } from '../../types/common';

export class GetProductsUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(params: PaginationParams & { filters?: ProductFilterCriteria }): Promise<PaginatedResult<Product>> {
    return this.repository.getProducts(params);
  }
}
