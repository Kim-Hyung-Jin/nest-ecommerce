import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from '../product/product-option-group.entity';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';
import { OrderAddress } from './order.address.entity';
import { OrderLine } from './order-line.entity';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  orderCode: string = v4();

  constructor(
    userId: string,
    payMethod: string,
    orderAddress: OrderAddress,
    orderLineList: OrderLine[],
  ) {
    super();
    this.userId = userId;
    this.payMethod = payMethod;
    this.orderAddress = orderAddress;
    this.orderLineList = orderLineList;
  }

  userId: string;
  payMethod: string;
  orderAddress: OrderAddress;
  orderLineList: OrderLine[];
}
