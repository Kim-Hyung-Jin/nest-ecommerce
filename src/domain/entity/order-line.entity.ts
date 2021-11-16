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
import { CreateOrderProductOptionGroup } from '../dto/order.command';
import { OrderProductOptionGroup } from './order-product-option-group.entity';

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

  ordering: number;
  productCode: string;
  orderCount: number;
  productPrice: number;
  productOptionGroupList: OrderProductOptionGroup[];
  status: OrderStatus = OrderStatus.PRE_PAYED;

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
    if (this.status != OrderStatus.PRE_PAYED)
      new Error('올바른 주문 상태가 아님.');
    this.status = OrderStatus.PAYED;
  }

  onShipping() {
    if (this.status != OrderStatus.PAYED) new Error('올바른 주문 상태가 아님.');
    this.status = OrderStatus.SHIPPING;
  }

  onCancel() {
    if (
      this.status == OrderStatus.SHIPPING ||
      this.status == OrderStatus.DELIVERED
    )
      new Error('주문 취소 불가 상태');

    this.status = OrderStatus.CANCEL;
  }

  onDelivered() {
    if (this.status != OrderStatus.SHIPPING) new Error('올바른 배송 상태가 아님.');
    this.status = OrderStatus.DELIVERED;
  }
}
