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
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productName: string;

  @Column({ type: 'varchar', nullable: false })
  productCode: string = v4.uuidv4();

  @Column({ type: 'int', nullable: false })
  productPrice: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.PREPARE })
  status: ProductStatus = ProductStatus.PREPARE;

  @OneToMany(
    type => ProductOptionGroup,
    ProductOptionGroup => ProductOptionGroup.product,
    {
      cascade: true,
    },
  )
  productOptionGroupList: ProductOptionGroup[];
}
