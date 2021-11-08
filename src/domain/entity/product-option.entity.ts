import ProductOptionGroup from './product-option-group.entity';

export default class ProductOption {
  get id(): number {
    return this._id;
  }

  get productOptionName(): string {
    return this._productOptionName;
  }

  get ordering(): number {
    return this._ordering;
  }

  get productOptionPrice(): number {
    return this._productOptionPrice;
  }

  get productOptionGroup(): ProductOptionGroup {
    return this._productOptionGroup;
  }

  constructor(
    productOptionName: string,
    ordering: number,
    productOptionPrice: number,
  ) {
    this._productOptionName = productOptionName;
    this._ordering = ordering;
    this._productOptionPrice = productOptionPrice;
  }

  private readonly _id: number;

  private readonly _productOptionName: string;

  private readonly _ordering: number;

  private readonly _productOptionPrice: number;

  private readonly _productOptionGroup: ProductOptionGroup;
}
