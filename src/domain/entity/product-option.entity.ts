import ProductOptionGroup from './product-option-group.entity';
import ProductOptionPersist from './persist/product-option.persist-entity';

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

  constructor(persist: ProductOptionPersist) {
    this._productOptionName = persist.productOptionName;
    this._ordering = persist.ordering;
    this._productOptionPrice = persist.productOptionPrice;
  }

  private readonly _id: number;

  private readonly _productOptionName: string;

  private readonly _ordering: number;

  private readonly _productOptionPrice: number;

  private readonly _productOptionGroup: ProductOptionGroup;
}
