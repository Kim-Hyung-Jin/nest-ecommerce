import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOption from './product-option.entity';
import { ProductsPersist } from './persist/product.persist-entity';
import { Products } from './product.entity';
import ProductOptionGroupPersist from './persist/product-option-group.persist-entity';

export default class ProductOptionGroup {
  private readonly _id: number;

  private readonly _productOptionGroupName: string;

  private _productOptionList: ProductOption[];

  private readonly _product: Products;

  private readonly _ordering: number;

  get id(): number {
    return this._id;
  }

  get productOptionGroupName(): string {
    return this._productOptionGroupName;
  }

  get productOptionList(): ProductOption[] {
    return this._productOptionList;
  }

  set productOptionList(value: ProductOption[]) {
    this._productOptionList = value;
  }

  get product(): Products {
    return this._product;
  }

  get ordering(): number {
    return this._ordering;
  }

  constructor(persist: ProductOptionGroupPersist) {
    this._id = persist.id;
    this._productOptionGroupName = persist.productOptionGroupName;
    this._product = new Products(persist.product);
    this._ordering = persist.ordering;
    this._productOptionList = persist.productOptionList.map(value => {
      return new ProductOption(value);
    });
  }
}
