import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from '../../product/product-option-group.entity';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';
import { OrderAddressPersist } from './order.address.persist';
import { OrderLinePersist } from './order-line.entity';

@Entity()
export class OrderPersist extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  orderCode: string = v4();

  constructor(
    userId: string,
    payMethod: string,
    orderAddress: OrderAddressPersist,
    orderLineList: OrderLinePersist[],
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
  @OneToOne(type => OrderAddressPersist, orderAddress => orderAddress.order, {
    cascade: true,
  })
  @JoinColumn()
  address: OrderAddressPersist;

  @OneToMany(type => OrderLinePersist, orderLine => orderLine.order, {
    cascade: true,
  })
  orderLineList: OrderLinePersist[];
}
