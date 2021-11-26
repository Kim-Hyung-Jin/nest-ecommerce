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
import { OrderProductOption } from './order-product-option.entity';
import { OrderLine } from './order-line.entity';

@Entity()
export class OrderProductOptionGroup extends BaseEntity {
  constructor(
    productOptionGroupName: string,
    ordering: number,
    productionOptionList: OrderProductOption[],
  ) {
    super();
    this.productOptionGroupName = productOptionGroupName;
    this.ordering = ordering;
    this.productionOptionList = productionOptionList;
  }

  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productOptionGroupName: string;
  @Column({ type: 'int', nullable: false })
  ordering: number;

  @ManyToOne(type => OrderLine, orderLine => orderLine.productOptionGroupList)
  orderLine: OrderLine;

  @OneToMany(
    type => OrderProductOption,
    orderProductOption => orderProductOption.productionOptionGroup,
    {
      cascade: true,
    },
  )
  productionOptionList: OrderProductOption[];
}
