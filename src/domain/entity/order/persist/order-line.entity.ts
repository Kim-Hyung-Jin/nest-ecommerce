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
import { CreateOrderProductOptionGroup } from '../../../dto/order/order.command';
import { OrderProductOptionGroupPersist } from './order-product-option-group.persist';
import { ProductStatus } from '../../product/product.entity';
import { OrderPersist } from './order.persist';

export enum OrderStatus {
  PRE_PAYED = '결제전',
  PAYED = '결제완료',
  CANCEL = '주문취소',
  SHIPPING = '배송중',
  DELIVERED = '배송완료',
}

@Entity()
export class OrderLinePersist extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'int', nullable: false })
  ordering: number;
  @Column({ type: 'varchar', nullable: false })
  productCode: string;
  @Column({ type: 'int', nullable: false })
  orderCount: number;
  @Column({ type: 'int', nullable: false })
  productPrice: number;
  @Column({
    type: 'simple-enum',
    enum: OrderStatus,
    default: OrderStatus.PRE_PAYED,
  })
  status: OrderStatus = OrderStatus.PRE_PAYED;

  @ManyToOne(type => OrderPersist, order => order.orderLineList)
  order: OrderPersist;

  @OneToMany(
    type => OrderProductOptionGroupPersist,
    orderProductOptionGroup => orderProductOptionGroup.orderLine,
    {
      cascade: true,
    },
  )
  productOptionGroupList: OrderProductOptionGroupPersist[];

  constructor(
    ordering: number,
    productCode: string,
    orderCount: number,
    productPrice: number,
    productOptionGroupList: OrderProductOptionGroupPersist[],
  ) {
    super();
    this.ordering = ordering;
    this.productCode = productCode;
    this.orderCount = orderCount;
    this.productPrice = productPrice;
    this.productOptionGroupList = productOptionGroupList;
  }

}
