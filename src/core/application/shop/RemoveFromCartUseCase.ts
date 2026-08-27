import { ShopRepository } from '../../domain/shop/ShopRepository';
import { CartItem } from '../../domain/shop/CartItem';

export class RemoveFromCartUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(productId: string): Promise<CartItem[]> {
    const currentCart = await this.repository.getSavedCart();
    const filtered = currentCart.filter(i => i.product.id !== productId);
    await this.repository.saveCart(filtered);
    return filtered;
  }
}
