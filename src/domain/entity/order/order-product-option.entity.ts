import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from '../product/product-option-group.entity';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';
import { OrderLine } from './order-line.entity';
import { OrderProductOptionGroup } from './order-product-option-group.entity';

@Entity()
export class OrderProductOption extends BaseEntity {
  constructor(
    productOptionPrice: number,
    productOptionName: string,
    ordering: number,
  ) {
    super();
    this.productOptionPrice = productOptionPrice;
    this.productOptionName = productOptionName;
    this.ordering = ordering;
  }

  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'int', nullable: false })
  productOptionPrice: number;
  @Column({ type: 'varchar', nullable: false })
  productOptionName: string;
  @Column({ type: 'int', nullable: false })
  ordering: number;

  @ManyToOne(
    type => OrderProductOptionGroup,
    OrderProductOptionGroup => OrderProductOptionGroup.productionOptionList,
  )
  productionOptionGroup: OrderProductOptionGroup;
}
