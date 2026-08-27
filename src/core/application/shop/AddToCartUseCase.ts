import { ShopRepository } from '../../domain/shop/ShopRepository';
import { CartItem } from '../../domain/shop/CartItem';
import { ProductNotFoundError, OutOfStockError } from '../../domain/shop/ShopErrors';

export class AddToCartUseCase {
  constructor(private readonly repository: ShopRepository) {}

  async execute(productId: string, quantity = 1): Promise<CartItem[]> {
    const product = await this.repository.getProductById(productId);
    if (!product) {
      throw new ProductNotFoundError(productId);
    }

    if (!product.inStock) {
      throw new OutOfStockError(product.name);
    }

    const currentCart = await this.repository.getSavedCart();
    const existingIndex = currentCart.findIndex(item => item.product.id === productId);

    let updatedCart: CartItem[];
    if (existingIndex >= 0) {
      currentCart[existingIndex].updateQuantity(
        currentCart[existingIndex].quantity + quantity
      );
      updatedCart = [...currentCart];
    } else {
      const newItem = new CartItem({ product, quantity });
      updatedCart = [...currentCart, newItem];
    }

    await this.repository.saveCart(updatedCart);
    return updatedCart;
  }
}
