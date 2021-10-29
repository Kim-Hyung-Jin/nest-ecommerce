import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from './product-option-group.entity';

export enum ProductStatus {
  PREPARE = '준비중',
  ON_SALE = '판매중',
  END_OF_SALE = '판매종료',
}

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productName: string;

  @Column({ type: 'varchar', nullable: false })
  productCode: string;

  @Column({ type: 'int', nullable: false })
  productPrice: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.PREPARE })
  status: ProductStatus;

  @OneToMany(type => ProductOptionGroup, productGroup => productGroup.id)
  productOptionGroupList: ProductOptionGroup[];
}
