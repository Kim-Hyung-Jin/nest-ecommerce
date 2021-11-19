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
import { OrderProductOption } from './order-product-option.entity';

@Entity()
export class OrderProductOptionGroup extends BaseEntity {
  constructor(
    productOptionGroupName: string,
    ordering: number,
    productionOptionList: OrderProductOption[],
  ) {
    super();
    this.productOptionGroupName = productOptionGroupName;
    this.ordering = ordering;
    this.productionOptionList = productionOptionList;
  }

  @PrimaryGeneratedColumn() id: number;

  productOptionGroupName: string;
  ordering: number;
  productionOptionList: OrderProductOption[];
}
