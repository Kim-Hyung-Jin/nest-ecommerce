import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from './product-option-group.entity';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';

export enum ProductStatus {
  PREPARE = '준비중',
  ON_SALE = '판매중',
  END_OF_SALE = '판매종료',
}

@Entity()
export class Products extends BaseEntity {
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

  @PrimaryGeneratedColumn() private _id: number;

  @Column({ type: 'varchar', nullable: false })
  private readonly _productName: string;

  @Column({ type: 'varchar', nullable: false })
  private _productCode: string = v4();

  @Column({ type: 'int', nullable: false })
  private readonly _productPrice: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PREPARE,
  })
  private _status: ProductStatus = ProductStatus.PREPARE;

  @OneToMany(
    type => ProductOptionGroup,
    ProductOptionGroup => ProductOptionGroup.product,
    {
      cascade: true,
    },
  )
  private readonly _productOptionGroupList: ProductOptionGroup[];

  constructor(
    productName: string,
    productPrice: number,
    productOptionGroupList: ProductOptionGroup[],
  ) {
    super();
    this._productName = productName;
    this._productPrice = productPrice;
    this._productOptionGroupList = productOptionGroupList;
  }
}
