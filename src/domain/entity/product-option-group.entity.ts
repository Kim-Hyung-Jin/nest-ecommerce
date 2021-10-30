import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOption from './product-option.entity';
import { Products } from './product.entity';

@Entity()
export default class ProductOptionGroup extends BaseEntity {
  @PrimaryGeneratedColumn() private _id: number;

  @Column({ type: 'varchar', nullable: false })
  private readonly _productOptionGroupName: string;

  @Column({ type: 'int', nullable: false }) private readonly _ordering: number;

  @OneToMany(
    type => ProductOption,
    productOption => productOption.productOptionGroup,
    {
      cascade: true,
    },
  )
  private readonly _productOptionList: ProductOption[];

  @ManyToOne(type => Products, product => product.productOptionGroupList)
  private _product: Products;

  get id(): number {
    return this._id;
  }

  get productOptionGroupName(): string {
    return this._productOptionGroupName;
  }

  get ordering(): number {
    return this._ordering;
  }

  get productOptionList(): ProductOption[] {
    return this._productOptionList;
  }

  get product(): Products {
    return this._product;
  }

  constructor(
    productOptionGroupName: string,
    ordering: number,
    productOptionList: ProductOption[],
  ) {
    super();
    this._productOptionGroupName = productOptionGroupName;
    this._ordering = ordering;
    this._productOptionList = productOptionList;
  }
}
