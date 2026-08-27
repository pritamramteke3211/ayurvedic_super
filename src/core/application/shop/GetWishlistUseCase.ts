import { ShopRepository } from '../../domain/shop/ShopRepository';

export class GetWishlistUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(): Promise<string[]> {
    return this.repository.getWishlist();
  }
}
