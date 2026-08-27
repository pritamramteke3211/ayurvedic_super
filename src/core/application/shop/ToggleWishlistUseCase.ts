import { ShopRepository } from '../../domain/shop/ShopRepository';

export class ToggleWishlistUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(productId: string): Promise<boolean> {
    return this.repository.toggleWishlist(productId);
  }
}
