import ProductOptionGroup from './product-option-group.entity';
import { ProductsPersist } from './persist/product.persist-entity';
import ProductOption from './product-option.entity';

export enum ProductStatus {
  PREPARE = '준비중',
  ONSALE = '판매중',
  ENDOFSALE = '판매종료',
}

export class Products {
  private persist: ProductsPersist;

  get id(): number {
    return this.persist.id;
  }

  get productName(): string {
    return this.persist.productName;
  }

  get productCode(): string {
    return this.persist.productCode;
  }

  get productPrice(): number {
    return this.persist.productPrice;
  }

  get status(): ProductStatus {
    return this.persist.status;
  }

  get productOptionGroupList(): ProductOptionGroup[] {
    return this.persist.productOptionGroupList.map(value => {
      return new ProductOptionGroup(value);
    });
  }

  constructor(persist: ProductsPersist) {
    this.persist = persist;
  }
}
