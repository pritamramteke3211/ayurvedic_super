import { ShopRepository } from '../../domain/shop/ShopRepository';
import { CartItem } from '../../domain/shop/CartItem';

export class GetCartUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(): Promise<CartItem[]> {
    return this.repository.getSavedCart();
  }
}
