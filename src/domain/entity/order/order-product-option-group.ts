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
import { OrderProductOptionPersist } from './persist/order-product-option.persist';
import { OrderLinePersist } from './persist/order-line.entity';
import { OrderProductOptionGroupPersist } from './persist/order-product-option-group.persist';

export class OrderProductOptionGroup {
  persist: OrderProductOptionGroupPersist;

  constructor(persist: OrderProductOptionGroupPersist) {
    this.persist = persist;
  }
}
