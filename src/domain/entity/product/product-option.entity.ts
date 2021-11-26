import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import ProductOptionGroup from './product-option-group.entity';

@Entity()
export default class ProductOption extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ type: 'varchar', nullable: false })
  productOptionName: string;

  @Column({ type: 'int', nullable: false }) ordering: number;

  @Column({ type: 'int', nullable: false }) productOptionPrice: number;

  @ManyToOne(
    type => ProductOptionGroup,
    productOptionGroup => productOptionGroup.productOptionList,
  )
  productOptionGroup: ProductOptionGroup;

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

  updateProductOption(
    productOptionName: string,
    ordering: number,
    productOptionPrice: number,
  ) {
    if (
      productOptionName == undefined &&
      ordering == undefined &&
      productOptionPrice == undefined
    )
      throw new Error('업데이트 할 값이 없음');

    this.productOptionName = productOptionName;
    this.ordering = ordering;
    this.productOptionPrice = productOptionPrice;
  }
}
