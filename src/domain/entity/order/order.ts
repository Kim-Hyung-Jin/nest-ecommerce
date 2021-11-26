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
import { OrderAddressPersist } from './persist/order.address.persist';
import { OrderLinePersist } from './persist/order-line.entity';
import { OrderPersist } from './persist/order.persist';

export class Order {
  persist: OrderPersist;

  constructor(persist: OrderPersist) {
    this.persist = persist;
  }
}
