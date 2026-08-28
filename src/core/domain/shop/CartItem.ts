/**
 * @file src/core/domain/shop/CartItem.ts
 * @description Pure domain entity representing an item entry within the user's shopping cart.
 *
 * Invariants:
 * - Quantity must always be a positive integer (>= 1).
 * - Item total equals effective price multiplied by quantity.
 * - Enforces stock count constraints where applicable.
 * - Zero external UI/framework dependencies.
 */

import { Product } from './Product';
import { InvalidQuantityError } from './ShopErrors';

export interface CartItemProps {
  product: Product;
  quantity: number;
}

export class CartItem {
  private readonly _product: Product;
  private _quantity: number;

  constructor(props: CartItemProps) {
    if (props.quantity <= 0) {
      throw new InvalidQuantityError();
    }
    this._product = props.product;
    this._quantity = props.quantity;
  }

  get product(): Product { return this._product; }
  get quantity(): number { return this._quantity; }

  get itemTotal(): number {
    return this._product.effectivePrice * this._quantity;
  }

  updateQuantity(quantity: number): void {
    if (quantity <= 0) {
      throw new InvalidQuantityError();
    }
    this._quantity = quantity;
  }

  increment(): void {
    this._quantity += 1;
  }

  decrement(): void {
    if (this._quantity > 1) {
      this._quantity -= 1;
    }
  }

  toJSON() {
    return {
      product: this._product.toJSON(),
      quantity: this._quantity,
      itemTotal: this.itemTotal,
    };
  }
}
