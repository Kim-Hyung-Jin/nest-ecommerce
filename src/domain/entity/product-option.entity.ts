import ProductOptionGroup from './product-option-group.entity';
import ProductOptionPersist from './persist/product-option.persist-entity';

export default class ProductOption {
  private persist: ProductOptionPersist;

  get id(): number {
    return this.persist.id;
  }

  get productOptionName(): string {
    return this.persist.productOptionName;
  }

  get ordering(): number {
    return this.persist.ordering;
  }

  get productOptionPrice(): number {
    return this.persist.productOptionPrice;
  }

  constructor(persist: ProductOptionPersist) {
    this.persist = persist;
  }
}
