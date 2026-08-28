/**
 * @file src/core/domain/shop/Product.ts
 * @description Pure domain entity representing an Ayurvedic herbal product or remedy.
 *
 * Invariants:
 * - Immutable core properties (id, name, category, ingredients, benefits).
 * - Effective price dynamically reflects discount price when valid.
 * - In-stock status strictly requires inStock flag === true AND stockCount > 0.
 * - Zero external framework or React Native dependencies.
 */

export interface ProductProps {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  inStock: boolean;
  stockCount: number;
  ingredients: string[];
  benefits: string[];
}

export class Product {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _category: string;
  private readonly _price: number;
  private readonly _discountPrice?: number;
  private readonly _rating: number;
  private readonly _reviewCount: number;
  private readonly _imageUrl: string;
  private readonly _description: string;
  private _inStock: boolean;
  private _stockCount: number;
  private readonly _ingredients: string[];
  private readonly _benefits: string[];

  constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._category = props.category;
    this._price = props.price;
    this._discountPrice = props.discountPrice;
    this._rating = props.rating;
    this._reviewCount = props.reviewCount;
    this._imageUrl = props.imageUrl;
    this._description = props.description;
    this._inStock = props.inStock;
    this._stockCount = props.stockCount;
    this._ingredients = props.ingredients;
    this._benefits = props.benefits;
  }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get category(): string { return this._category; }
  get price(): number { return this._price; }
  get discountPrice(): number | undefined { return this._discountPrice; }
  get rating(): number { return this._rating; }
  get reviewCount(): number { return this._reviewCount; }
  get imageUrl(): string { return this._imageUrl; }
  get description(): string { return this._description; }
  get inStock(): boolean { return this._inStock && this._stockCount > 0; }
  get stockCount(): number { return this._stockCount; }
  get ingredients(): string[] { return [...this._ingredients]; }
  get benefits(): string[] { return [...this._benefits]; }

  get effectivePrice(): number {
    return this._discountPrice !== undefined && this._discountPrice < this._price
      ? this._discountPrice
      : this._price;
  }

  toJSON(): Readonly<ProductProps> {
    return Object.freeze({
      id: this._id,
      name: this._name,
      category: this._category,
      price: this._price,
      discountPrice: this._discountPrice,
      rating: this._rating,
      reviewCount: this._reviewCount,
      imageUrl: this._imageUrl,
      description: this._description,
      inStock: this._inStock,
      stockCount: this._stockCount,
      ingredients: this._ingredients,
      benefits: this._benefits,
    });
  }
}
