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

  receiverName: string;
  receiverPhone: string;
  receiverZipcode: string;
  receiverAddress1: string;
  receiverAddress2: string;
}
