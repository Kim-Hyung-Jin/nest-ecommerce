import ProductOptionGroup from './product-option-group.entity';
import { ProductsPersist } from './persist/product.persist-entity';
import ProductOption from './product-option.entity';

export enum ProductStatus {
  PREPARE = '준비중',
  ONSALE = '판매중',
  ENDOFSALE = '판매종료',
}

export class Products {
  private readonly _id: number;

  private readonly _productName: string;

  private readonly _productCode: string;

  private readonly _productPrice: number;

  private readonly _status: ProductStatus;

  private _productOptionGroupList: ProductOptionGroup[]; // TODO setter 안열면 안되나

  get id(): number {
    return this._id;
  }

  get productName(): string {
    return this._productName;
  }

  get productCode(): string {
    return this._productCode;
  }

  get productPrice(): number {
    return this._productPrice;
  }

  get status(): ProductStatus {
    return this._status;
  }

  get productOptionGroupList(): ProductOptionGroup[] {
    return this._productOptionGroupList;
  }

  set productOptionGroupList(value: ProductOptionGroup[]) {
    this._productOptionGroupList = value;
  }

  constructor(persist: ProductsPersist) {
    console.log('@@@!! ' + JSON.stringify(persist));
    this._productName = persist.productName;
    this._productCode = persist.productCode;
    this._productPrice = persist.productPrice;
    this._status = persist.status;
    this._productOptionGroupList = persist.productOptionGroupList.map(value => {
      return new ProductOptionGroup(value);
    });
  }
}
