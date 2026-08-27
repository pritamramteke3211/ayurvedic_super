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
