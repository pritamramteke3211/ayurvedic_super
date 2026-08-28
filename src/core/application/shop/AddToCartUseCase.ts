/**
 * @file src/core/application/shop/AddToCartUseCase.ts
 * @description Application use case to safely add an Ayurvedic product to the cart.
 *
 * Invariants:
 * - Validates product existence and in-stock status before modification.
 * - Prevents cart item quantity from exceeding product.stockCount.
 * - Persists the updated cart to the repository before returning.
 */

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

    if (!product.inStock || product.stockCount <= 0) {
      throw new OutOfStockError(product.name);
    }

    const currentCart = await this.repository.getSavedCart();
    const existingIndex = currentCart.findIndex((item) => item.product.id === productId);

    let updatedCart: CartItem[];
    if (existingIndex >= 0) {
      const currentQty = currentCart[existingIndex].quantity;
      const targetQty = Math.min(product.stockCount, currentQty + quantity);
      currentCart[existingIndex].updateQuantity(targetQty);
      updatedCart = [...currentCart];
    } else {
      const initialQty = Math.min(product.stockCount, Math.max(1, quantity));
      const newItem = new CartItem({ product, quantity: initialQty });
      updatedCart = [...currentCart, newItem];
    }

    await this.repository.saveCart(updatedCart);
    return updatedCart;
  }
}
