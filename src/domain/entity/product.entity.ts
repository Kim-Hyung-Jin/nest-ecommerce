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
  ONSALE = '판매중',
  ENDOFSALE = '판매종료',
}

@Entity()
export class Products extends BaseEntity {
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
    type => ProductOptionGroup,
    ProductOptionGroup => ProductOptionGroup.product,
    {
      cascade: true,
    },
  )
  readonly productOptionGroupList: ProductOptionGroup[];

  constructor(
    productName: string,
    productPrice: number,
    productOptionGroupList: ProductOptionGroup[],
  ) {
    super();
    this.productName = productName;
    this.productPrice = productPrice;
    this.productOptionGroupList = productOptionGroupList;
  }

  updateProductInfo(productName: string, productPrice: number) {
    if (productName == undefined && productPrice == undefined) {
      throw new Error('업데이트 할 값이 없음');
    }

    if (productName != undefined) {
      this.productName = productName;
    }

    if (productName != undefined) {
      this.productPrice = productPrice;
    }
  }
}
