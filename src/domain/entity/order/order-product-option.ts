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
import { OrderLinePersist } from './persist/order-line.entity';
import { OrderProductOptionGroupPersist } from './persist/order-product-option-group.persist';
import { OrderProductOptionPersist } from './persist/order-product-option.persist';

export class OrderProductOption {
  persist: OrderProductOptionPersist;

  constructor(persist: OrderProductOptionPersist) {
    this.persist = persist;
  }
}
