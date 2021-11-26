import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
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
    this.address = orderAddress;
    this.orderLineList = orderLineList;
  }

  @Column({ type: 'varchar', nullable: false })
  userId: string;
  @Column({ type: 'varchar', nullable: false })
  payMethod: string;
  @OneToOne(type => OrderAddress, orderAddress => orderAddress.order, {
    cascade: true,
  })
  @JoinColumn()
  address: OrderAddress;

  @OneToMany(type => OrderLine, orderLine => orderLine.order, {
    cascade: true,
  })
  orderLineList: OrderLine[];
}
