import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from '../product/product-option-group.entity';
import { randomUUID } from 'crypto';
import { v4 } from 'uuid';
import { Order } from './order.entity';

@Entity()
export class OrderAddress extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  constructor(
    receiverName: string,
    receiverPhone: string,
    receiverZipcode: string,
    receiverAddress1: string,
    receiverAddress2: string,
  ) {
    super();
    this.receiverName = receiverName;
    this.receiverPhone = receiverPhone;
    this.receiverZipcode = receiverZipcode;
    this.receiverAddress1 = receiverAddress1;
    this.receiverAddress2 = receiverAddress2;
  }

  @Column({ type: 'varchar', nullable: false })
  receiverName: string;
  @Column({ type: 'varchar', nullable: false })
  receiverPhone: string;
  @Column({ type: 'varchar', nullable: false })
  receiverZipcode: string;
  @Column({ type: 'varchar', nullable: false })
  receiverAddress1: string;
  @Column({ type: 'varchar', nullable: false })
  receiverAddress2: string;

  @OneToOne(type => Order, order => order.address)
  order: Order;
}
