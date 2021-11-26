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
import { CreateOrderProductOptionGroup } from '../../dto/order/order.command';
import { OrderProductOptionGroup } from './order-product-option-group.entity';
import { ProductStatus } from '../product/product.entity';
import { Order } from './order.entity';

export enum OrderStatus {
  PRE_PAYED = '결제전',
  PAYED = '결제완료',
  CANCEL = '주문취소',
  SHIPPING = '배송중',
  DELIVERED = '배송완료',
}

@Entity()
export class OrderLine extends BaseEntity {
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

  @ManyToOne(type => Order, order => order.orderLineList)
  order: Order;

  @OneToMany(
    type => OrderProductOptionGroup,
    orderProductOptionGroup => orderProductOptionGroup.orderLine,
    {
      cascade: true,
    },
  )
  productOptionGroupList: OrderProductOptionGroup[];

  constructor(
    ordering: number,
    productCode: string,
    orderCount: number,
    productPrice: number,
    productOptionGroupList: OrderProductOptionGroup[],
  ) {
    super();
    this.ordering = ordering;
    this.productCode = productCode;
    this.orderCount = orderCount;
    this.productPrice = productPrice;
    this.productOptionGroupList = productOptionGroupList;
  }

  onPayed() {
    if (this.status !== OrderStatus.PRE_PAYED)
      new Error('올바른 주문 상태가 아님.');
    this.status = OrderStatus.PAYED;
  }

  onShipping() {
    if (this.status !== OrderStatus.PAYED)
      new Error('올바른 주문 상태가 아님.');
    this.status = OrderStatus.SHIPPING;
  }

  onCancel() {
    if (
      this.status === OrderStatus.SHIPPING ||
      this.status === OrderStatus.DELIVERED ||
      this.status === OrderStatus.CANCEL
    )
      throw new Error('주문 취소 불가 상태');

    this.status = OrderStatus.CANCEL;
  }

  onDelivered() {
    if (this.status !== OrderStatus.SHIPPING)
      new Error('올바른 배송 상태가 아님.');
    this.status = OrderStatus.DELIVERED;
  }
}
