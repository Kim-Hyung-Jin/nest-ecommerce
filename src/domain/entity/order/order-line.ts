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
import { OrderProductOptionGroupPersist } from './persist/order-product-option-group.persist';
import { ProductStatus } from '../product/product.entity';
import { OrderPersist } from './persist/order.persist';
import { OrderLinePersist } from './persist/order-line.entity';

export enum OrderStatus {
  PRE_PAYED = '결제전',
  PAYED = '결제완료',
  CANCEL = '주문취소',
  SHIPPING = '배송중',
  DELIVERED = '배송완료',
}

export class OrderLine extends BaseEntity {
  persist: OrderLinePersist;

  constructor(persist: OrderLinePersist) {
    super();
    this.persist = persist;
  }

  onPayed() {
    if (this.persist.status !== OrderStatus.PRE_PAYED)
      new Error('올바른 주문 상태가 아님.');
    this.persist.status = OrderStatus.PAYED;
  }

  onShipping() {
    if (this.persist.status !== OrderStatus.PAYED)
      new Error('올바른 주문 상태가 아님.');
    this.persist.status = OrderStatus.SHIPPING;
  }

  onCancel() {
    if (
      this.persist.status === OrderStatus.SHIPPING ||
      this.persist.status === OrderStatus.DELIVERED ||
      this.persist.status === OrderStatus.CANCEL
    )
      throw new Error('주문 취소 불가 상태');

    this.persist.status = OrderStatus.CANCEL;
  }

  onDelivered() {
    if (this.persist.status !== OrderStatus.SHIPPING)
      new Error('올바른 배송 상태가 아님.');
    this.persist.status = OrderStatus.DELIVERED;
  }
}
