import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from '../../product/product-option-group.entity';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';
import { OrderProductOptionPersist } from './order-product-option.persist';
import { OrderLinePersist } from './order-line.entity';

@Entity()
export class OrderProductOptionGroupPersist extends BaseEntity {
  constructor(
    productOptionGroupName: string,
    ordering: number,
    productionOptionList: OrderProductOptionPersist[],
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

  @ManyToOne(type => OrderLinePersist, orderLine => orderLine.productOptionGroupList)
  orderLine: OrderLinePersist;

  @OneToMany(
    type => OrderProductOptionPersist,
    orderProductOption => orderProductOption.productionOptionGroup,
    {
      cascade: true,
    },
  )
  productionOptionList: OrderProductOptionPersist[];
}
