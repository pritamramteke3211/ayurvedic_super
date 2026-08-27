import { ShopRepository } from '../../domain/shop/ShopRepository';
import { CartItem } from '../../domain/shop/CartItem';
import { InvalidQuantityError } from '../../domain/shop/ShopErrors';

export class UpdateCartQuantityUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(productId: string, quantity: number): Promise<CartItem[]> {
    if (quantity <= 0) {
      throw new InvalidQuantityError('Quantity must be greater than zero. To remove an item, use RemoveFromCart.');
    }

    const currentCart = await this.repository.getSavedCart();
    const item = currentCart.find(i => i.product.id === productId);

    if (item) {
      item.updateQuantity(quantity);
      await this.repository.saveCart(currentCart);
    }

    return currentCart;
  }
}
