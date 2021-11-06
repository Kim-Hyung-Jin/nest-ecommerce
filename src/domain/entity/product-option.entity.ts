import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from './product-option-group.entity';

@Entity()
export default class ProductOption extends BaseEntity {
  @PrimaryGeneratedColumn() private _id: number;

  @Column({ type: 'varchar', nullable: false })
  private readonly _productOptionName: string;

  @Column({ type: 'int', nullable: false }) private readonly _ordering: number;

  @Column({ type: 'int', nullable: false }) private _productOptionPrice: number;

  @ManyToOne(
    type => ProductOptionGroup,
    productOptionGroup => productOptionGroup.productOptionList,
  )
  private readonly _productOptionGroup: ProductOptionGroup;

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
    super();
    this._productOptionName = productOptionName;
    this._ordering = ordering;
    this._productOptionPrice = productOptionPrice;
  }
}
