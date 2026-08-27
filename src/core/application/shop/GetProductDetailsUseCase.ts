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
