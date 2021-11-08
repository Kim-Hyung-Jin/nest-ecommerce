import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroupPersist from './product-option-group.persist-entity';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';

export enum ProductStatus {
  PREPARE = '준비중',
  ONSALE = '판매중',
  ENDOFSALE = '판매종료',
}

@Entity()
export class ProductsPersist extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productName: string;

  @Column({ type: 'varchar', nullable: false })
  productCode: string = v4();

  @Column({ type: 'int', nullable: false })
  productPrice: number;

  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.PREPARE,
  })
  status: ProductStatus = ProductStatus.PREPARE;

  @OneToMany(
    type => ProductOptionGroupPersist,
    ProductOptionGroup => ProductOptionGroup.product,
    {
      cascade: true,
    },
  )
  productOptionGroupList: ProductOptionGroupPersist[];

  constructor(
    productName: string,
    productPrice: number,
    productOptionGroupList: ProductOptionGroupPersist[],
  ) {
    super();
    this.productName = productName;
    this.productPrice = productPrice;
    this.productOptionGroupList = productOptionGroupList;
  }
}
