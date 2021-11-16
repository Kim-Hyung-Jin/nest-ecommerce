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

@Entity()
export class OrderProductOption extends BaseEntity {
  constructor(productOptionPrice: number, productOptionName: string, ordering: number) {
    super();
    this.productOptionPrice = productOptionPrice;
    this.productOptionName = productOptionName;
    this.ordering = ordering;
  }
  @PrimaryGeneratedColumn() id: number;

  productOptionPrice: number;
  productOptionName: string;
  ordering: number;
}
