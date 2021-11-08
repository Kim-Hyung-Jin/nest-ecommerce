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

@Entity()
export default class ProductOptionGroup {
  set productOptionList(value: ProductOption[]) {
    this._productOptionList = value;
  }
  private readonly _id: number;

  private readonly _productOptionGroupName: string;

  private _productOptionList: ProductOption[];

  private readonly _product: ProductsPersist;

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

  get product(): ProductsPersist {
    return this._product;
  }

  get ordering(): number {
    return this._ordering;
  }

  constructor(
    productOptionGroupName: string,
    productOptionList: ProductOption[],
    ordering: number,
  ) {
    this._productOptionGroupName = productOptionGroupName;
    this._productOptionList = productOptionList;
    this._ordering = ordering;
  }
}
