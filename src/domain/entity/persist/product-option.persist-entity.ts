import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroupPersist from './product-option-group.persist-entity';

@Entity()
export default class ProductOptionPersist extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productOptionName: string;

  @Column({ type: 'int', nullable: false }) ordering: number;

  @Column({ type: 'int', nullable: false }) productOptionPrice: number;

  @ManyToOne(
    type => ProductOptionGroupPersist,
    productOptionGroup => productOptionGroup.productOptionList,
  )
  productOptionGroup: ProductOptionGroupPersist;

  constructor(
    productOptionName: string,
    ordering: number,
    productOptionPrice: number,
  ) {
    super();
    this.productOptionName = productOptionName;
    this.ordering = ordering;
    this.productOptionPrice = productOptionPrice;
  }
}
