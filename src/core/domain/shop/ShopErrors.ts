/**
 * @file src/core/domain/shop/ShopErrors.ts
 * @description Typed error hierarchy for domain and business rule violations in the Shop module.
 *
 * Invariants:
 * - Extends base Error with descriptive error name and message.
 * - Captures out-of-stock, item not found, invalid quantity, and checkout boundary failures.
 */

export class ShopDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShopDomainError';
  }
}

export class ProductNotFoundError extends ShopDomainError {
  constructor(id: string) {
    super(`Product with ID ${id} was not found.`);
    this.name = 'ProductNotFoundError';
  }
}

export class OutOfStockError extends ShopDomainError {
  constructor(productName: string) {
    super(`Product "${productName}" is out of stock.`);
    this.name = 'OutOfStockError';
  }
}

export class InvalidQuantityError extends ShopDomainError {
  constructor(message = 'Quantity must be greater than zero.') {
    super(message);
    this.name = 'InvalidQuantityError';
  }
}
